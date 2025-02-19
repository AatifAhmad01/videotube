import { Router } from "express";
import { verifyUser } from "../middlwares/auth.middlware.js";
import { deleteVideo, getAllVideos, getVideoById, togglePublishStatus, updateVideo } from "../controllers/video.contreller.js";
import { upload } from "../middlwares/multer.middlware.js";
import { publishVideo } from "../controllers/video.contreller.js";

const router = Router();

router.use(verifyUser);

router.route("/")
    .get(getAllVideos)
    .post(upload.fields(
        [
            {
                name: "videoFile",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]
    ), publishVideo)

router.route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;