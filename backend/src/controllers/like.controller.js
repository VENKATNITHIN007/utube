import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videoIdd = new mongoose.Types.ObjectId(videoId);
  const unlikeVideo = await Like.findOneAndDelete({
    video: videoIdd,
    likedBy: req.user._id,
  });
  if (unlikeVideo) {
    return res.status(200).json(new ApiResponse(200, null, "video unliked"));
  }
  const likeVideo = await Like.create({
    video: videoIdd,
    likedBy: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, likeVideo, "video liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const commentIdd = new mongoose.Types.ObjectId(commentId);
  const unlikeComment = await Like.findOneAndDelete({
    comment: commentIdd,
    likedBy: req.user._id,
  });
  if (unlikeComment) {
    return res.status(200).json(new ApiResponse(200, null, "comment unliked"));
  }
  const likeComment = await Like.create({
    comment: commentIdd,
    likedBy: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, likeComment, "comment liked"));
});
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    const userId = req.user._id; // Assuming req.user is set after authentication
    const likedVideos = await Like.find({
      likedBy: userId,
      video: { $exists: true },
    })
      .populate("video") // Populates video details
      .sort({ createdAt: -1 });

    if (likedVideos.length > 0)
      return res
        .status(200)
        .json(
          new ApiResponse(200, likedVideos, "Successfully fetched liked videos")
        );

    if (likedVideos.length == 0) {
      return new ApiResponse(200, null, "you havent liked any videos");
    }
  } catch (err) {
    res
      .status(500)
      .json(new ApiError(500, err, "error while fetching likedVideos"));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
