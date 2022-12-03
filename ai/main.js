const { loadData, getTrainData, getTestData } = require('./data');
const { summary, fit, evaluate, save } = require('./model');

const run = async (epochs, batchSize, modelSavePath) => {
  loadData();

  const { images: trainImages, labels: trainLabels } = getTrainData();

  console.log("Training Images (Shape): " + trainImages.shape);
  console.log("Training Labels (Shape): " + trainLabels.shape);

  summary();

  const validationSplit = 0.15;

  await fit(trainImages, trainLabels, {
    epochs,
    batchSize,
    validationSplit
  });

  const {images: testImages, labels: testLabels} = getTestData();

  const evalOutput = evaluate(testImages, testLabels);

  console.log(
      `\nEvaluation result:\n` +
      `  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; `+
      `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

  if (modelSavePath != null) {
    await save(`file://${modelSavePath}`);
    console.log(`Saved model to path: ${modelSavePath}`);
  }
}

run(10, 4, './model');
