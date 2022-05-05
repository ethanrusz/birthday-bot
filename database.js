const { MongoClient } = require("mongodb");
const { uri } = require("./config.json");

async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect(); // Generate new connection to db

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
    }); // Insert new birthday

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

    await collection.deleteOne({ snowflake: snowflake }); // Delete document by snowflake

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
    ); // Update birthday by snowflake

    console.log(`Updated ${snowflake}`);
  } finally {
    await mongoClient.close();
  }
}

async function findByDate(day, month) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("birthdaybot");
    const collection = db.collection("person");

    let birthdayIDs = [];
    const cursor = collection.aggregate([
      {
        $project: {
          snowflake: 1,
          day: { $dayOfMonth: "$birthday" },
          month: { $month: "$birthday" },
        },
      },
      {
        $match: { day: day, month: month },
      },
    ]); // Find snowflakes by projecting day and month

    await cursor.forEach((result) => {
      birthdayIDs.push(`${result.snowflake}`);
    }); // Get IDs from json

    if (birthdayIDs.length === 0) {
      return null;
    }

    return birthdayIDs;
  } finally {
    await mongoClient.close();
  }
}

async function findByUser(snowflake) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("birthdaybot");
    const collection = db.collection("person");

    const birthdayID = await collection.findOne({ snowflake: snowflake }); // Find document by snowflake
    // return month name and day of birth from birthdayID no offset

    if (birthdayID === null) {
      return null;
    }

    const birthday = birthdayID.birthday;
    const month = birthday.getUTCMonth();
    const day = birthday.getUTCDate();

    return {
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][month],
      day: day,
    };
  } finally {
    await mongoClient.close();
  }
}

module.exports = {
  insertPerson,
  removePerson,
  updatePerson,
  findByDate,
  findByUser,
};
