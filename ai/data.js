const {
  node,
  scalar,
  concat,
  oneHot,
  tensor1d,
} = require("@tensorflow/tfjs-node");
const { readdirSync, readFileSync } = require("fs");
const { join } = require("path");

const TRAIN_IMAGES_DIR = "./ai/data/train";
const TEST_IMAGES_DIR = "./ai/data/test";

function loadImages(dataDir) {
  const images = [];
  const labels = [];

  const files = readdirSync(dataDir);
  files.forEach((file) => {
    if (!file.toLocaleLowerCase().endsWith(".jpg")) {
      return;
    }

    const filePath = join(dataDir, file);

    const buffer = readFileSync(filePath);
    const imageTensor = node
      .decodeImage(buffer)
      .resizeNearestNeighbor([96, 96])
      .toFloat()
      .div(scalar(255.0))
      .expandDims();
    images.push(imageTensor);

    if (file.toLocaleLowerCase().startsWith("healthy_")) {
      labels.push(0);
    } else {
      labels.push(1);
    }
  });
  console.log("Labels are");
  console.log(labels);
  return [images, labels];
}

class CacaoDataset {
  constructor() {
    this.trainData = [];
    this.testData = [];
  }

  loadData() {
    console.log("Loading images...");
    this.trainData = loadImages(TRAIN_IMAGES_DIR);
    this.testData = loadImages(TEST_IMAGES_DIR);
    console.log("Images loaded successfully.");
  }

  getTrainData() {
    return {
      images: concat(this.trainData[0]),
      labels: oneHot(tensor1d(this.trainData[1], "int32"), 2).toFloat(),
    };
  }

  getTestData() {
    return {
      images: concat(this.testData[0]),
      labels: oneHot(tensor1d(this.testData[1], "int32"), 2).toFloat(),
    };
  }
}

module.exports = new CacaoDataset();
