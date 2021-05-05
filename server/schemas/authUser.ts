import mongoose from "mongoose"

export const authUserSchema = new mongoose.Schema({
    name: {type: String, required: true, min: 6},
    email: {type: String, required: true},
    password: {type: String, required: true, min: 6, max: 1024},
    date: {type: Date, default: Date.now}
})

const AuthUser = mongoose.model("AuthUser", authUserSchema)
export default AuthUser