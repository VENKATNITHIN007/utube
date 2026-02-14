import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //   const channel = channelId.toString();
  //   const currentuser = req.user._id.toString();
  //   let isSubscribed = await Subscription.find({
  //     subscriber: req.user._id,
  //     channel: channelId,
  //   });
  //   console.log(isSubscribed);
  //   console.log("hello");

  //   if (isSubscribed.length > 0) {
  //     const subscriptionId = isSubscribed[0]._id;
  //     const sub = await Subscription.findByIdAndDelete(subscriptionId);
  //     // console.log(isSubscribed._id);
  //     return res
  //       .status(200)
  //       .json(new ApiResponse(200, sub, "you are no longer a subscriber"));
  //   }
  //   console.log("helloo");
  //   if (isSubscribed.length == 0) {
  //     console.log("hellooo");
  //     const subscribed = await Subscription.create({
  //       subscriber: req.user?._id,
  //       channel: channelId,
  //     });
  //     if (subscribed) {
  //       return res
  //         .status(200)
  //         .json(new ApiResponse(200, subscribed, "you are now a subscriber"));
  //     }
  //     if (!subscribed) {
  //       throw new ApiError(400, "invalid");
  //     }
  //   }

  const channelIdd = new mongoose.Types.ObjectId(channelId);
  // console.log(channelIdd);
  // console.log(req.user._id);
  if (channelIdd.equals(req.user._id)) {
    return res
      .status(400)
      .json(new ApiError(400, null, "you cant subscribe to your self"));
  }
  const unsub = await Subscription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (unsub) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "you are no longer a subscriber"));
  }
  const subscribe = await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });
  if (subscribe) {
    return res
      .status(200)
      .json(new ApiResponse(200, subscribe, "you are now a subscriber"));
  }

  if (!subscribe.length == 0) {
    throw new ApiError(400, "bad request to toggle subscription");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //   let channell = channelId.toString();
  const channelIdd = new mongoose.Types.ObjectId(channelId);
  //   console.log(channelIdd);
  //   console.log(channelId);
  try {
    const subscriptions = await Subscription.aggregate([
      {
        $match: {
          channel: channelIdd,
          // subscriberCount: { sum: 1 },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriberDetails",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$subscriberDetails",
      },

      {
        $group: {
          _id: "$channel",
          subscriberCount: { $sum: 1 },
          subscriber: { $push: "$subscriberDetails" },
        },
      },

      //
      {
        $project: {
          // subscriberCount: 1,
          //   "$subscribers.userName": 1,
          // username: "$subscribers.username",
          // fullName: "$subscribers.fullName",
          // fullName: 1,
          _id: 0,
          channel: "$_id",
          subscriberCount: 1,
          subscriber: 1,
          //   arrayLength: { size: "$myArray" },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscriptions,
          "channel subscribers fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  // const currentUser=new mongoose.Types.ObjectId(req.user._id)
  const subscriberIdd = new mongoose.Types.ObjectId(subscriberId);
  try {
    const subscribeTo = await Subscription.aggregate([
      {
        $match: {
          subscriber: subscriberIdd,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribed",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
              },
            },
          ],
        },
      },

      {
        $group: {
          _id: "$subscriber",
          subscribedToCount: { $sum: 1 },
          subscribed: { $push: "$subscribed" },
        },
      },
      {
        $project: {
          _id: 0,
          subscriberID: "$_id",
          subscribed: 1,
          subscribedToCount: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribeTo,
          "fetched subscribed channels successfully"
        )
      );
  } catch (error) {
    console.log(error);
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
