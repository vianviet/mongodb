const mongoose = require("mongoose");
// require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("Database Error", error);
    process.exit(1);
  }
};
module.exports = {
  connectDB,
};
