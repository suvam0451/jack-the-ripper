import jwt from "jsonwebtoken"

import * as dotenv from "dotenv";
dotenv.config()

export default function auth(req, res, next) {
    const token = req.header("auth-token")
    if (!token) {
        return res.status(401).send("Access Denied")
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        req.user = verified
        next()
        // return res.status(200).send("Successful Private Route Access")
    } catch (err) {
        return res.status(400).send("Invalid Token")
    }
}