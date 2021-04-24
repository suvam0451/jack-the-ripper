import mongoose from "mongoose"
import { connectMongoose } from "./_util";

connectMongoose()

export const BookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true}
})

const Book = mongoose.model("Book", BookSchema)
export default Book

