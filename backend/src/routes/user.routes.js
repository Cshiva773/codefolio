import express from "express";
import { getProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

export default router;