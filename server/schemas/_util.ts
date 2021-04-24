import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1:27017/local";

export function connectMongoose() {
  mongoose.connect(uri, (err) => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Successfully Connected to MongoDB");
      return true;
    }
  });
}
