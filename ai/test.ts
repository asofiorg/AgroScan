import * as tf from "@tensorflow/tfjs-node";
import { createDataset } from "./dataset";

async function testModel() {
  // Load the saved model
  console.log("Loading saved model...");
  const model = await tf.loadLayersModel("file://./model/model.json");

  // Load training dataset
  console.log("Loading training dataset...");
  const trainDataset = await createDataset("train");

  // Evaluate the model
  console.log("Evaluating model on training dataset...");
  const evaluation = await model.evaluateDataset(trainDataset, {
    verbose: 1,
  });

  // Print results
  const [loss, accuracy] = evaluation;
  console.log("\nEvaluation Results:");
  console.log(`Loss: ${loss.dataSync()[0].toFixed(4)}`);
  console.log(`Accuracy: ${accuracy.dataSync()[0].toFixed(4)}`);

  // Clean up
  evaluation.forEach(tensor => tensor.dispose());
}

// Run the test
testModel().catch(error => {
  console.error("Error during testing:", error);
});
