import express from "express";
import * as controller from "../controllers/authUser"
import authMiddleware from "../middlewares/verifyAuth"

const router = express.Router()

router.use(authMiddleware)
router.get("/", controller.registerUser);

export default router