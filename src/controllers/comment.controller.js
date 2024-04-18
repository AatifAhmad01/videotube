import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body;

    if (!content) {
        throw ApiError(400, "No content");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    res.status(200)
        .json(new ApiResponse(200, comment, "Comment posted"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body;

    if (!content) {
        throw ApiError(400, "No content");
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content
        }
    }, { new: true })

    if (!updatedComment) throw new ApiError(500, "Something went Wronge");


    res.status(200)
        .json(new ApiResponse(200, updatedComment, "Comment Updated Successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deletedComment) throw new ApiError(500, "Something went Wronge");

    res.status(200)
        .json(new ApiResponse(200, deletedComment, "Comment Updated Successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
