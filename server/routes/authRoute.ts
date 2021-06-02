import express from "express";
import * as controller from "../controllers/authUser"

const router = express.Router()

// Routing
router.post("/register", controller.registerUser);
router.get("/", controller.allUsers);
router.delete("/remove/:id", controller.removeUserByID);
router.post("/login", controller.userLogin)

export default router