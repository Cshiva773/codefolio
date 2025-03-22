import express from "express";
//import { getProfile } from "../controllers/user.controller.js";
import { getCurrentUser,updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateProfile);

export default router;