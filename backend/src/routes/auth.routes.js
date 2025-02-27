import express from "express";
import { signup, login, logout, refreshToken,changeCurrentPassword,updateProfilePicture } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();

router.route("/signup").post(upload.fields([
    {name:"avatar",maxCount:1}
]), signup);
router.post("/login", login);

router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshToken);
router.post("/update-password",verifyJWT,changeCurrentPassword)
router.post("/update-profile-picture",verifyJWT,upload.single("avatar"),updateProfilePicture)
export default router;
