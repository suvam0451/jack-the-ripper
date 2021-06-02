import mongoose from "mongoose"

export const twitterUserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    api_key: {type: String, required: true},
    craftingWatchlist: {type: [Number], default: [], required: false}
})

const TwitterUser = mongoose.model("TwitterUser", twitterUserSchema)
export default TwitterUser