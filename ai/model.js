const tf = require("@tensorflow/tfjs-node");

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;

const createModel = () => {
  const model = tf.sequential();

  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 3],
      kernelSize: 3,
      filters: 32,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 32,
      activation: "relu",
    })
  );

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 64,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 64,
      activation: "relu",
    })
  );

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({ units: 512, activation: "relu" }));

  model.add(tf.layers.dense({ units: 4, activation: "softmax" }));

  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"],
  });

  return model;
};

module.exports = createModel;
