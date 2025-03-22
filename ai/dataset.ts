import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";
import path from "path";
import { Jimp } from "jimp";

export const CONFIG = {
  IMAGE: {
    WIDTH: 224,
    HEIGHT: 224,
    CHANNELS: 3,
    BATCH_SIZE: 32,
    SHUFFLE_BUFFER: 100,
  },
  LABELS: {
    HEALTHY: 0,
    FITO: 1,
    MONILIA: 2,
    POD_BORER: 3,
  },
  IMAGE_FORMATS: [".jpg"] as string[],
} as const;

interface ImageData {
  images: tf.Tensor3D[];
  labels: number[];
}

interface DatasetPaths {
  label: number;
  path: string;
}

function validateImagePath(imagePath: string): void {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image path does not exist: ${imagePath}`);
  }

  const ext = path.extname(imagePath).toLowerCase();
  if (!CONFIG.IMAGE_FORMATS.includes(ext)) {
    throw new Error(`Unsupported image format: ${ext}`);
  }
}

async function readImage(imagePath: string): Promise<tf.Tensor3D> {
  try {
    validateImagePath(imagePath);

    console.log("Loading:", imagePath);

    const image = await Jimp.read(imagePath);
    const { data, width, height } = image.bitmap;

    if (width !== CONFIG.IMAGE.WIDTH || height !== CONFIG.IMAGE.HEIGHT) {
      image.resize({ w: CONFIG.IMAGE.WIDTH, h: CONFIG.IMAGE.HEIGHT });
    }

    const imageTensor = tf.tidy(() => {
      const tensor = tf.tensor2d(data, [height, width * 4]);
      return tensor
        .reshape([height, width, 4])
        .slice(
          [0, 0, 0],
          [CONFIG.IMAGE.HEIGHT, CONFIG.IMAGE.WIDTH, CONFIG.IMAGE.CHANNELS]
        )
        .cast("float32")
        .div(tf.scalar(255)) as tf.Tensor3D;
    });

    return imageTensor;
  } catch (error: unknown) {
    throw new Error(`Failed to read image ${imagePath}: ${error}`);
  }
}

async function readImages(label: number, basePath: string): Promise<ImageData> {
  try {
    if (!fs.existsSync(basePath)) {
      throw new Error(`Directory does not exist: ${basePath}`);
    }

    const imagePaths = fs
      .readdirSync(basePath)
      .filter((file) => CONFIG.IMAGE_FORMATS.includes(path.extname(file)))
      .map((fileName: string) => path.join(basePath, fileName));

    const images: tf.Tensor3D[] = [];
    const labels: number[] = [];
    let processed = 0;
    const total = imagePaths.length;

    for (const imagePath of imagePaths) {
      try {
        const imageTensor = await readImage(imagePath);
        images.push(imageTensor);
        labels.push(label);

        processed++;
        if (processed % 10 === 0) {
          console.log(`Progress: ${processed}/${total} images processed`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn(`Skipping image ${imagePath}: ${error.message}`);
        } else {
          console.warn(`Skipping image ${imagePath}: Unknown error`);
        }
        continue;
      }
    }

    return { images, labels };
  } catch (error: unknown) {
    throw new Error(`Failed to read images from ${basePath}: ${error}`);
  }
}

export async function createDataset(
  split: "train" | "test" = "train"
): Promise<tf.data.Dataset<tf.TensorContainer>> {
  const datasets: DatasetPaths[] = [
    { label: CONFIG.LABELS.HEALTHY, path: `./ai/data/${split}/healthy` },
    { label: CONFIG.LABELS.FITO, path: `./ai/data/${split}/fito` },
    { label: CONFIG.LABELS.MONILIA, path: `./ai/data/${split}/monilia` },
    { label: CONFIG.LABELS.POD_BORER, path: `./ai/data/${split}/pod_borer` },
  ];

  try {
    console.log(`Starting ${split} dataset creation...`);

    const allData = [];

    for (const { label, path } of datasets) {
      console.log(`Processing ${path}...`);
      const data = await readImages(label, path);
      allData.push(data);
    }

    const images = allData.flatMap((data) => data.images);
    const labels = allData.flatMap((data) => data.labels);

    if (images.length === 0) {
      throw new Error("No valid images found in the dataset");
    }

    console.log(`${split} dataset created with ${images.length} images`);

    const oneHotLabels = tf.oneHot(
      tf.tensor1d(labels, "int32"),
      Object.keys(CONFIG.LABELS).length
    );

    const oneHotArray = oneHotLabels.arraySync() as number[][];

    const dataset = tf.data.zip({
      xs: tf.data.array(images),
      ys: tf.data.array(oneHotArray),
    });

    return dataset
      .shuffle(CONFIG.IMAGE.SHUFFLE_BUFFER)
      .batch(CONFIG.IMAGE.BATCH_SIZE)
      .prefetch(1);
  } catch (error: unknown) {
    throw new Error(`Failed to create dataset: ${error}`);
  } finally {
    tf.disposeVariables();
  }
}
