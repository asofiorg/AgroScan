const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const path = require("path");

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;

const readImages = async (label, basePath) => {
  const imagePaths = fs
    .readdirSync(basePath)
    .map((fileName) => path.join(basePath, fileName));

  const images = [];

  for (const imagePath of imagePaths) {
    const image = await tf.node.decodeImage(imagePath, 3);

    const resizedImage = tf.image.resizeBilinear(image, [
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    ]);

    const normalizedImage = tf
      .cast(resizedImage, "float32")
      .div(tf.scalar(255));

    images.push(normalizedImage);
  }

  const labels = Array(imagePaths.length).fill(label);

  return { images, labels };
};

const createDataset = async () => {
  const healthyData = await readImages(0, "./data/healthy");
  const fitoData = await readImages(1, "./data/fito");
  const moniliaData = await readImages(2, "./data/monilia");
  const podBorerData = await readImages(3, "./data/pod_borer");

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
    .zip({ xs: images, ys: labels })
    .shuffle(images.length)
    .batch(32);

  return dataset;
};

module.exports = createDataset;
