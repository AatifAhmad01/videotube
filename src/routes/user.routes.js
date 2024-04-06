import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlwares/multer.middlware.js";
import { verifyUser } from "../middlwares/auth.middlware.js";

const router = Router();

router.route("/register").post(upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]
), registerUser);

router.route("/login").post(loginUser);


//Secure routes //User needs to be logged in
router.route("/logout").post(verifyUser, logoutUser)

router.route("/refreshAccessToken").post(refreshAccessToken);


export default router