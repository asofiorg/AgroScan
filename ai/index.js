const createDataset = require("./dataset");
const createModel = require("./model");

const train = async () => {
  const dataset = await createDataset();

  console.log("Loading model")
  const model = createModel();
  console.log("model loaded")

  await model.fitDataset(dataset, {
    epochs: 50,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      },
    },
  });

  await model.save("file://./model");
};

train();
