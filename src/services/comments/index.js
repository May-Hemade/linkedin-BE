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
    const commentToInsert = { ...req.body };
    const postsUpdated = await PostModel.findOneAndUpdate(
      { _id: req.params.postId },
      { $push: { comments: commentToInsert } },
      { new: true }
    );
    res.status(200).send(postsUpdated);
  } catch (error) {
    next(error);
  }
});
commentRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const comments = await PostModel.find(
      {
        _id: req.params.postId,
      },
      "comments"
    );
    console.log(comments);
    // const postDeleted = await PostModel.findOneAndDelete({});
    res.status(200).send(comments);
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
