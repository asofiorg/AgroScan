const createDataset = require("./dataset");
const createModel = require("./model");

const train = async () => {
  const dataset = await createDataset();
  const model = createModel();

  await model.fitDataset(dataset, {
    epochs: 10,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      },
    },
  });

  await model.save("file://./model");
};

train();
