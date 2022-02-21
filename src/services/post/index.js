import express from "express";
import createHttpError from "http-errors";
import PostSchema from "./schema.js";

const postRouter = express.Router();

postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostSchema(req.body);
    const { _id } = await newPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostSchema.find();
    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

export default postRouter;
