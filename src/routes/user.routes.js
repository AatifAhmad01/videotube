import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyUser, changeCurrentPassword);

router.route("/refreshAccessToken").post(refreshAccessToken);

router.route("/current-user").get(verifyUser, getCurrentUser);
router.route("/update-account").patch(verifyUser, updateAccountDetails);
router.route("/update-avatar").patch(verifyUser, upload.single("avatar"), updateAvatar)

router.route("/update-coverImage").patch(upload.single("coverImage"), updateCoverImage)

router.route("/channel/:username").get(getUserChannelProfile)

router.route("/history").get(verifyUser, getWatchHistory);


export default router