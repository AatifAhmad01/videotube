import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyUser = asyncHandler(async (req, _, next) => {

    // Extract token
    // Varify Token
    // Get user from db

    // Return User
    // 

    try {
        const token = req.cookies?.accessToken || req.header
            ("Authorization")?.replace("Barear ", "");

        if (!token) {
            throw new ApiError(401, "Unauthroize Request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Request Token");
        }

        req.user = user;

        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})