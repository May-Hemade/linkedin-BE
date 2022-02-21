import express from "express";
import createHttpError from "http-errors";
import PostSchema from "./schema.js";
import multer from "multer";

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
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostSchema.findById(req.params.postId);
    console.log(post);
    res.status(200).send(post);
  } catch (error) {
    next(error);
  }
});
postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const postDeleted = await PostSchema.findByIdAndDelete(req.params.postId);
    res.status(200).send(postDeleted);
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const postsUpdated = await PostSchema.findOneAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );
    res.status(200).send(postsUpdated);
  } catch (error) {
    next(error);
  }
});

// upload image
const upload = multer({ dest: "./media" });
postRouter.post(
  "/:postId",
  upload.single("postImage"),
  async (req, res, next) => {
    console.log(req.file);
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default postRouter;
