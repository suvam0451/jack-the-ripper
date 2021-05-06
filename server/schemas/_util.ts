import mongoose from "mongoose";

import * as dotenv from "dotenv";
dotenv.config()


const uri = process.env.CONTAINERIZED == "true" ? "mongodb://mongo:27017/local" : "mongodb://127.0.0.1:27017/local";

export function connectMongoose() {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Successfully Connected to MongoDB");
      return true;
    }
  });
}
