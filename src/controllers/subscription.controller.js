import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    const isSubscribed = Subscription.findOne({ _id: channelId })

    let returnMessage = "";

    if (isSubscribed) {
        await Subscription.deleteOne({ _id: channelId })
        returnMessage = "Unsubscribed successfully"
    }
    else {
        await Subscription.create(
            {
                channel: channelId,
                subscriber: req.user._id
            })
        returnMessage = "Subscribed successfully"
    }

    res.status(200)
        .json(new ApiResponse(200, {}, returnMessage))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) throw new ApiError(400, "Invalid channel Id");

    const subscribers = await User.aggregate(
        [
            {
                $match: {
                    _id: channelId,
                },
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel"
                }
            }
        ]
    )

    if (!subscribers) throw new ApiError(500, "Something Went wronge");

    res.status(200)
        .json(new ApiResponse(200, subscribers, "Subcribers Fetched Successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channels = await Subscription.aggregate(
        [
            {
                $lookup: {
                    from: "subscriptions",
                    localField: subscriberId,
                    foreignField: "subscriber"
                }
            }
        ]
    )

    res.status(200)
        .json(new ApiResponse(200, channels, "Subscribers Fetched Successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}