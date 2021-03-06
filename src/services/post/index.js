import express from "express";
import createHttpError from "http-errors";
import PostSchema from "./schema.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import q2m from "query-to-mongo";

const postRouter = express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "posts",
    },
  }),
}).single("image");

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
    const posts = await PostSchema.find().populate({
      path: "user likes",
    });
    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostSchema.findById(req.params.postId).populate({
      path: "user",
    });

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

postRouter.post("/:postId", cloudinaryUploader, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const updatedPost = await PostSchema.findByIdAndUpdate(
      postId,
      { image: req.file.path },
      {
        new: true,
      }
    );
    console.log("file path:", req.file);

    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId/like", async (req, res, next) => {
  // try {
  //   const postId = req.params.id
  //   const { _id } = req.body;
  //   const isLiked = await PostSchema.findOne({ _id: postId, likes: _id });
  //   if (isLiked) {
  //     await PostSchema.findByIdAndUpdate(postId, { $pull: { likes: _id } });
  //     res.send("UNLIKED");
  //   } else {
  //     await PostSchema.findByIdAndUpdate(postId, { $push: { likes: _id } });
  //     res.send("LIKED");
  //   }
  // } catch (error) {
  //   res.send(500).send({ message: error.message });
  //}
  try {
    const postId = req.params.postId;
    const reqPost = await PostSchema.findById(postId);
    console.log(req.body);
    if (reqPost) {
      const isAlreadyLiked = reqPost.likes.find(
        (_id) => _id.toString() === req.body.user
      );
      console.log(isAlreadyLiked);
      if (!isAlreadyLiked) {
        const updatedPost = await PostSchema.findByIdAndUpdate(
          postId,
          { $push: { likes: req.body.user } },
          { new: true }
        );
        console.log(updatedPost);
        console.log("like");

        res.status(201).send(updatedPost);
      } else {
        const updatedPost = await PostSchema.findByIdAndUpdate(
          postId,
          { $pull: { likes: req.body.user } },
          { new: true }
        );
        console.log("??nlike");
        res.status(201).send(updatedPost);
      }
    } else {
      next(
        createHttpError(404, `POST  WITH ID:- ${postId} CANNOT UPDATED  !!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
