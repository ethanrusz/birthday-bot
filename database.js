const { MongoClient } = require("mongodb");
const { uri } = require("./config.json");

async function connectToCluster(uri) {
  let mongoClient;

  try {
    // Connect to the cluster
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

    // Insert document with snowflake and birthday
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

    // Delete document by snowflake
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

    // Update birthday by snowflake
    await collection.findOneAndUpdate(
      { snowflake: snowflake },
      { $set: { birthday: birthday } }
    );

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

    // Find snowflakes by projecting day and month
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
    ]);

    // Get IDs from JSON
    await cursor.forEach((result) => {
      birthdayIDs.push(`${result.snowflake}`);
    });

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

    // Find document by snowflake
    const birthdayID = await collection.findOne({ snowflake: snowflake });

    if (birthdayID === null) {
      return null;
    }

    const birthday = birthdayID.birthday;
    const month = birthday.getUTCMonth();
    const day = birthday.getUTCDate();

    // return month name and day of birth from birthdayID no offset
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
