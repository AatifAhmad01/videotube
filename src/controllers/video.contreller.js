import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadCloudinary from "../utils/Cloudinary.service.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishVideo = asyncHandler(async (req, res) => {

    // get data from body
    // validate data
    // Upload video to cloudinary
    // send response

    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All Fields are required");
    }

    const videoPath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;

    if (!videoPath) {
        throw new ApiError(400, "Video is needed");
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is needed");
    }

    const video = await uploadCloudinary(videoPath)
    const thumbnail = await uploadCloudinary(thumbnailPath)

    if (!video || !thumbnail) throw new ApiError(500, "Something Wend wronge while uploading");

    const uploadedVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        owner: req.user._id
    })

    res.status(200)
        .json(new ApiResponse(200, uploadedVideo, "Video uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Invalid Video Id");

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Invalid Video Id");

    res.status(200)
        .json(new ApiResponse(200, video, "Video Fetched Successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}