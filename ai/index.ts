import { createDataset } from "./dataset";
import * as tf from "@tensorflow/tfjs-node";
import { CONFIG } from "./dataset";

export async function train() {
  console.log("Creating datasets...");

  const trainDataset = await createDataset("train");
  const valDataset = await createDataset("test");

  console.log("Loading model");

  const model = tf.sequential();

  model.add(tf.layers.zeroPadding2d({
    inputShape: [224, 224, 3],
    padding: [[0, 1], [0, 1]],
    name: 'Conv1_pad'
  }));

  model.add(tf.layers.conv2d({
    filters: 16,
    kernelSize: [3, 3],
    strides: [2, 2],
    padding: 'valid',
    activation: 'relu',
    name: 'Conv1'
  }));

  model.add(tf.layers.depthwiseConv2d({
    kernelSize: [3, 3],
    strides: [1, 1],
    padding: 'same',
    activation: 'relu',
    name: 'block1_depthwise'
  }));

  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: [1, 1],
    strides: [1, 1],
    padding: 'same',
    activation: 'relu',
    name: 'block1_project'
  }));

  model.add(tf.layers.depthwiseConv2d({
    kernelSize: [3, 3],
    strides: [2, 2],
    padding: 'same',
    activation: 'relu',
    name: 'block2_depthwise'
  }));

  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: [1, 1],
    strides: [1, 1],
    padding: 'same',
    activation: 'relu',
    name: 'block2_project'
  }));

  model.add(tf.layers.globalAveragePooling2d({
    name: 'global_average_pooling'
  }));
  
  model.add(tf.layers.dropout({
    rate: 0.2,
    name: 'dropout'
  }));

  model.add(tf.layers.dense({
    units: 4,
    activation: 'softmax',
    name: 'prediction'
  }));

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  model.summary();

  await model.fitDataset(trainDataset, {
    epochs: 50,
    validationData: valDataset,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (logs) {
          console.log(`Epoch ${epoch+1}: loss = ${logs.loss?.toFixed(4) || 'N/A'}, accuracy = ${logs.acc?.toFixed(4) || 'N/A'}, val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}, val_acc = ${logs.val_acc?.toFixed(4) || 'N/A'}`);
        }
      }
    }
  });

  await model.save("file://./model");

  console.log("Improved model saved successfully");
}
