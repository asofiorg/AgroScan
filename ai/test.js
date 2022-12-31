const TeachableMachine = require("@sashido/teachablemachine-node");
const fs = require("fs");
const path = require("path");

const run = async () => {
  try {
    console.log("Loading model...");
    const model = new TeachableMachine({
      modelUrl: "https://agroscan.asofi.us/model/",
    });

    console.log("Loading images...");
    const healthyImages = fs.readdirSync(path.join(__dirname, "test/healthy"));
    const fitoImages = fs.readdirSync(path.join(__dirname, "test/fito"));
    const moniliaImages = fs.readdirSync(path.join(__dirname, "test/monilia"));
    const podBorerImages = fs.readdirSync(
      path.join(__dirname, "test/pod_borer")
    );

    const correctPredictions = [];
    const incorrectPredictions = [];

    const predict = async (imagePath) => {
      console.log("Predicting: ", imagePath);
      
      const prediction = await model.classify({
        imageUrl:
          imagePath,
      });

      console.log("Result: ", prediction[0].class);

      console.log(prediction);

      return {
        label: prediction[0].class,
        probability: prediction[0].score,
      };
    };

    const test = async (imagePath, expectedLabel) => {
      const prediction = await predict(imagePath);

      if (prediction.label === expectedLabel) {
        correctPredictions.push(prediction);
        console.log("Correct!");
      } else {
        incorrectPredictions.push(prediction);
        console.log("Incorrect!");
      }
    };

    const testImages = async (images, label) => {
      console.log(`Testing ${label} images...`);
      for (const image of images) {
        await test(`https://raw.githubusercontent.com/asofiorg/AgroScan/main/ai/test/${label}/${image}`, label);
      }
    };

    await testImages(healthyImages, "healthy");
    await testImages(fitoImages, "fito");
    await testImages(moniliaImages, "monilia");
    await testImages(podBorerImages, "pod_borer");

    console.log("Correct predictions:", correctPredictions.length);
    console.log("Incorrect predictions:", incorrectPredictions.length);
    console.log(
      "Accuracy:",
      (correctPredictions.length /
        (correctPredictions.length + incorrectPredictions.length)) *
        100
    );
  } catch (error) {
    console.error(error);
  }
};

run();
