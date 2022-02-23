import express from "express";
import createHttpError from "http-errors";
import PostModel from "../post/schema.js";
import Profile from "../profiles/schema.js";
import CommentModel from "./schema.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import fs from "fs";
import json2csv from "json2csv";
import path from "path";

import { join, dirname } from "path";

const commentRouter = express.Router();

commentRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const comments = await PostModel.find(
      { _id: req.params.postId },
      "comments"
    );
    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
});
// commentRouter.post("/:postId/comments", async (req, res, next) => {
//   try {
//     const comment = { ...req.body, post: req.params.postId };
//     const newExperience = new CommentModel(comment);
//     const { _id } = await newExperience.save();
//     res.status(201).send({ _id });
//   } catch (error) {
//     next(error);
//   }
commentRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const commentToPost = new CommentModel(req.body);
    const { _id } = await commentToPost.save();
    // console.log(commentToPost._id);
    const postsUpdated = await PostModel.findOneAndUpdate(
      { _id: req.params.postId },
      { $push: { comments: _id } },
      { new: true }
    );

    res.status(201).send(postsUpdated);
  } catch (error) {
    next(error);
  }
});
commentRouter.get("/:postId/comments/", async (req, res, next) => {
  try {
    const comments = await PostModel.find({
      _id: req.params.postId,
    });
    console.log(comments[0].comments);
    // const postDeleted = await PostModel.findOneAndDelete({});
    res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
});
commentRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const arrayComments = await PostModel.findById(
      req.params.postId,
      "comments"
    );
    const commentsIds = arrayComments.comments;
    const comments = await CommentModel.findByIdAndDelete(req.params.commentId);
    if (comments) {
      res.status(200).send("Comment has been removed!");
    } else {
      res.status(200).send("Comment not found");
    }
  } catch (error) {
    next(error);
  }
}); //it removes the comment from the CommentModel but not from the post array

commentRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.commentId,
      req.body
    );
    res.status(200).send(updatedComment);
  } catch (error) {
    next(error);
  }
});

// postRouter.put("/:postId", async (req, res, next) => {
//   try {
//     const postsUpdated = await PostSchema.findOneAndUpdate(
//       req.params.postId,
//       req.body,
//       { new: true }
//     );
//     res.status(200).send(postsUpdated);
//   } catch (error) {
//     next(error);
//   }
// });
export default commentRouter;
