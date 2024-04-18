import { Router } from "express";
import { verifyUser } from "../middlwares/auth.middlware.js";

import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyUser)

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router