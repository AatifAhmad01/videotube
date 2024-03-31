import { Router } from "express";
import { registerUser, loginUser, findUser } from "../controllers/user.controller.js";
import { upload } from "../middlwares/multer.middlware.js";

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



router.route("/login").get(loginUser);

router.route("/findUser").get(findUser)

export default router