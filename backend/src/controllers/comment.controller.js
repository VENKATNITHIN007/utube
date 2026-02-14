import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    let pageNumber = parseInt(page) || 1;
    let limitt = parseInt(limit) || 10;
    let skip = (pageNumber - 1) * limitt;
    const videoIdd = new mongoose.Types.ObjectId(videoId);
    const comments = await Comment.find({
      video: videoIdd,
    })
      .skip(skip)
      .limit(limitt);
    if (comments) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, comments, "comments feteeeecdd successfully")
        );
    }
    if (!comments) {
      return new ApiResponse(200, null, "no comments");
    }
  } catch (error) {
    console.log(error);
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;
  const videoIdd = new mongoose.Types.ObjectId(videoId);
  //   console.log(content);
  if (!content) {
    throw new ApiError(400, "content is required");
  }
  if (content) {
    try {
      const comment = await Comment.create({
        content,
        video: videoIdd,
        owner: req.user._id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, comment, "comment posted successfully"));
    } catch (error) {
      throw new ApiError(500, "error while adding comment");
    }
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const commentIdd = new mongoose.Types.ObjectId(commentId);

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentIdd,
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "comment edited successfully")
      );
  } catch (error) {
    throw new ApiError(500, error, "error while updatingComment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const commentIdd = new mongoose.Types.ObjectId(commentId);

  try {
    await Comment.findByIdAndDelete(commentIdd);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "comment deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error, "error while Deleting Comment");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
