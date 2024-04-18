import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Error posting tweet");
    }

    const addedTweet = await Tweet.create({
        owner: req.user._id,
        content
    })

    res.status(200)
        .json(new ApiResponse(200, addedTweet, "Tweet Added Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const { userId } = body.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(400, "Invalid User Id");
    }

    const userTweets = await Tweet.find({
        owner: userId
    })

    res.status(200)
        .json(200, userTweets, "Tweet Fetched Successfully")

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = body.params;
    const { content } = req.body;

    if (!tweetId || !content) {
        throw new ApiError(400, "Error While update tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content
            }
        }, { new: true })

    res.status(200)
        .json(200, updatedTweet, "Tweet Updated Successfully")
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = body.params;
    const { content } = req.body;

    if (!tweetId || !content) {
        throw new ApiError(400, "Error While update tweet");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    res.status(200)
        .json(200, deletedTweet, "Tweet Deleted Successfully")
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
