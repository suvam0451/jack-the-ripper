import mongoose from "mongoose"
import { connectMongoose } from "./_util";

connectMongoose()

export const twitterUserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    twitter_id: {type: String, required: true},
    status: {type: String, required: false}
})

const TwitterUser = mongoose.model("TwitterUser", twitterUserSchema)
export default TwitterUser