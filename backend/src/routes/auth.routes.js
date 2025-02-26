import express from "express";
import { signup, login, logout, refreshToken } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();

router.route("/signup").post(upload.fields([
    {name:"avatar",maxCount:1}
]), signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyJWT, logout);

export default router;
