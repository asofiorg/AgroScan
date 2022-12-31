const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;

const readImage = async (imagePath) => {
  console.log("Loading: ", imagePath);
  const image = await Jimp.read(imagePath);
  const imageData = image.bitmap.data;

  const imageTensor = tf.tensor2d(imageData, [
    image.bitmap.height,
    image.bitmap.width * 4,
  ]);

  return imageTensor;
};

const readImages = async (label, basePath) => {
  const imagePaths = fs
    .readdirSync(basePath)
    .map((fileName) => path.join(basePath, fileName))
    .slice(0, 3);

  const images = [];
  const labels = [];

  for (const imagePath of imagePaths) {
    const imageTensor = await readImage(imagePath);

    const reshapedImage = imageTensor
      .reshape([imageTensor.shape[0], imageTensor.shape[1] / 4, 4])
      .slice([0, 0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH, 3]);
    const normalizedImage = tf
      .cast(reshapedImage, "float32")
      .div(tf.scalar(255));
    images.push(normalizedImage);
    labels.push(label);
  }

  return { images, labels };
};

const createDataset = async () => {
  try {
    console.log("Loading dataset");

    const healthyData = await readImages(0, "./data/healthy");
    console.log("Loaded healthy");

    const fitoData = await readImages(1, "./data/fito");
    console.log("Loaded fito");

    const moniliaData = await readImages(2, "./data/monilia");
    console.log("Loaded monilia");

    const podBorerData = await readImages(3, "./data/pod_borer");
    console.log("Loaded pod_borer");

    const images = [
      ...healthyData.images,
      ...fitoData.images,
      ...moniliaData.images,
      ...podBorerData.images,
    ];

    const labels = [
      ...healthyData.labels,
      ...fitoData.labels,
      ...moniliaData.labels,
      ...podBorerData.labels,
    ];

    const dataset = tf.data
      .zip({ xs: tf.data.array(images), ys: tf.data.array(labels) })
      .shuffle(100)
      .batch(128);

    return dataset;
  } catch (e) {
    console.error(e);
  }
};

module.exports = createDataset;
