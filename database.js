const { MongoClient } = require("mongodb");
const { uri } = require("./config.json");

async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

async function insertPerson(snowflake, birthday) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("birthdaybot");
    const collection = db.collection("person");

    await collection.insertOne({
      snowflake: snowflake,
      birthday: birthday,
    });

    console.log(`Added ${snowflake}`);
  } finally {
    await mongoClient.close();
  }
}

async function removePerson(snowflake) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("birthdaybot");
    const collection = db.collection("person");

    await collection.deleteOne({ snowflake: snowflake });

    console.log(`Removed ${snowflake}`);
  } finally {
    await mongoClient.close();
  }
}

async function updatePerson(snowflake, birthday) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("birthdaybot");
    const collection = db.collection("person");

    await collection.findOneAndUpdate(
      { snowflake: snowflake },
      { $set: { birthday: birthday } }
    );

    console.log(`Updated ${snowflake}`);
  } finally {
    await mongoClient.close();
  }
}

module.exports = {
  insertPerson,
  removePerson,
  updatePerson,
};
