import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
import uploadCloudinary from "../utils/Cloudinary.service.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something Went Wronge");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // Get user data from client
    // Validate email/password
    // check if user already exists
    // check Images, check for avatar
    // Upload images to coloudinary, avatar check
    // Create user object, create entry in db
    // Remove Password and refresh token
    // check for user creation
    // Return response

    console.log(req.body);

    const { userName, fullName, email, password } = req.body;

    // if (!userName || !fullName || !email || !password) {
    //     throw new ApiError(400, "All fields are required")
    // }

    if (
        [userName, fullName, email, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        console.log("Cover Image found");
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar needed");
    }

    const avatarResponse = await uploadCloudinary(avatarLocalPath);
    const coverImageResponse = await uploadCloudinary(coverImageLocalPath);

    if (!avatarResponse) {
        throw new ApiError(400, "Files uploading Error");
    }

    const user = await User.create({
        fullName,
        avatar: avatarResponse.url,
        coverImage: coverImageResponse?.url || "",
        email,
        userName: userName.toLowerCase(),
        password
    })

    const userInDb = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!userInDb) {
        throw new ApiError(500, "Something Went wronge while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, userInDb, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    // Get data from body
    // Validate data
    // Find user 
    // Generate refresh and access tokens
    // Cookie parser

    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "Please enter email or userName");
    }

    const user = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = User.findById(user._id)
        .select("-password -refreshToken");


    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200,
                {
                    loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            "refreshToken": undefined
        }
    });

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // get refresh token from user
    // validate refresh token
    // verify refresh token
    // get user from db
    // compare incoming token with token in db
    // generate new tokens 
    // return new tokens

    const incommingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verifty(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (user.refreshToken !== incommingRefreshToken) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        const cookieOptions = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken,
                    },
                    "AccessToken Refreshed"
                )
            );


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }



})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}