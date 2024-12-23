const mongoose = require("mongoose")

require("dotenv").config();

const dbConnect = () => {
    mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connection successfull");
    })
    .catch((error) => {
      console.error(error);
      console.log("Database connection error");
      process.exit(1);
    });
}

module.exports = dbConnect;







