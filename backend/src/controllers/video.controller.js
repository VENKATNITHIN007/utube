import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, userId } = req.query;

  // if (!query && !userId) {
  //   return res.status(200).json(new ApiResponse(200, null, "no videos"));
  // }
  try {
    if (query) {
      let pageNumber = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      let skip = (pageNumber - 1) * limit;
      const videos = await Video.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ views: -1 }) // Sort by views in descending order
        .skip(skip) // Skip previous pages
        .limit(limit);

      return res
        .status(200)
        .json(new ApiResponse(200, videos, "videos  fetched successfully"));
    }
  } catch (error) {
    throw new ApiError(404, "error in retriveing video through query");
  }
  if (userId) {
    console.log("here");
    let userIdd = userId.toString();
    const channel = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userIdd),
        },
      },

      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "owner",
          as: "userVideos",
        },
      },
      {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers",
          },

          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          userVideos: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(401, "channel does not exists");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
      );
  }
});

//TODO: get all videos based on query, sort, pagination
// mongoose.Types.ObjectId: Converts a string to a MongoDB ObjectId.
//  $or: MongoDB operator for logical OR conditions.
// $regex: MongoDB operator for pattern matching.
// $options: "i": Makes regex case-insensitive.
// Video.countDocuments(queryObject): Counts documents matching the query.
// Sorting: Defined using an object like { field: 1 } (ascending) or { field: -1 } (descending).

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "videofile and thumbnail are required");
  }
  const videoFile = await uploadOnCloudinary(videoLocalPath, {
    resource_type: "video",
  });
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(
      400,
      "video file or thumbail failed to upload on cloudinary"
    );
  }
  const video = await Video.create({
    title,
    description,
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    duration: videoFile?.duration,
    owner: req.user._id,
  });
  const createdVideo = await Video.findById(video._id);
  if (!createdVideo) {
    throw new ApiError(500, "video not found in database");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdVideo, "video published successfully"));
});
const getVideoById = await asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },

    {
      $project: {
        "owner.fullName": 1,
        "owner.username": 1,
        "owner.avatar": 1,
        title: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  const owner = video.owner.toString();
  const currentUser = req.user._id.toString();

  if (!owner || !currentUser) {
    throw new ApiError(401, "Not authorized to delete the video");
  }

  if (owner === currentUser) {
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    return res
      .status(200)
      .json(new ApiResponse(200, deleteVideo, "video deleted successfully"));
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
