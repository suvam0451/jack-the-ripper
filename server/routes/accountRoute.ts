import express from "express";
import * as controller from "../controllers/authUser"

const router = express.Router()

router.post("/account", controller.registerUser);