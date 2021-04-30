import mongoose from "mongoose"
import { connectMongoose } from "./_util";

connectMongoose()

type ytRequestStatus = "completed" | "pending" | "running"

export const youtubeRequest = new mongoose.Schema({
    id: {type: String, required: true},
    query: {type: String, required: true},
    status: {type: String, required: false},
    completed_file: {type: String, required: false}
})

const ytRequest = mongoose.model("ytRequest", youtubeRequest)
export default ytRequest