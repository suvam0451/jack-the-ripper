import jwt from "jsonwebtoken"

import * as dotenv from "dotenv";
dotenv.config()

export default function auth(req, res, next) {
    const token = req.header("Authorization")
    if (!token) {
        // Deny access without token
        return res.status(401).send("Access Denied")
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        req.user = verified
        next()
    } catch (err) {
        // Deny access if token expired/failed-verification
        return res.status(400).send("Invalid Token")
    }
}