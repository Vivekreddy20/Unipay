const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB is running");

    // Retrieve and print all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:");
    collections.forEach(collection => console.log(collection.name));
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
