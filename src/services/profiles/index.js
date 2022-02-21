import express from "express";
import createHttpError from "http-errors";
import profilesModel from "./schema.js";
import BlogpostsModel from "../blogposts/schema.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import q2m from "query-to-mongo";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedinBE",
  },
});

const profilesRouter = express.Router();



profilesRouter.post("/", async (req, res, next) => {
  try {
    const newProfile = new profilesModel(req.body); // here happens validation of req.body, if it is not ok Mongoose will throw an error (if it is ok Profile it is not saved in db yet)
    const { _id } = await newProfile.save(); // this is the line in which the interaction with Mongo happens (it is ASYNC!)
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

profilesRouter.get("/", async (req, res, next) => {
  try {
    const profiles = await profilesModel.find();
    res.send(profiles);
  } catch (error) {
    next(error);
  }
});

profilesRouter.get("/:ProfileId", async (req, res, next) => {
  try {
    const ProfileId = req.params.ProfileId;

    const Profile = await profilesModel.findById(ProfileId);
    if (Profile) {
      res.send(Profile);
    } else {
      next(createHttpError(404, `Profile with id ${ProfileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

profilesRouter.put("/:ProfileId", async (req, res, next) => {
  try {
    const ProfileId = req.params.ProfileId;
    const updatedProfile = await profilesModel.findByIdAndUpdate(ProfileId, req.body, {
      new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
    });
    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      next(createHttpError(404, `Profile with id ${ProfileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

profilesRouter.delete("/:ProfileId", async (req, res, next) => {
  try {
    const ProfileId = req.params.ProfileId;
    const deletedProfile = await profilesModel.findByIdAndDelete(ProfileId);
    if (deletedProfile) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Profile with id ${ProfileId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

proflesRouter.post(
  "/:profileId/image",
  multer({ storage: cloudinaryStorage }).single("image"),
  async (req, res, next) => {
    try {
      const profileId = req.params.profileId;
      const updatedProfile = await profilesModel.findByIdAndUpdate(
        profileId,
        { image: req.file.path } /*  cover: req.file.path, */,
        {
          /* cover: req.file.path */
          new: true, // by default findByIdAndUpdate returns the record pre-modification, if you want to get back the newly updated record you should use the option new: true
        }
      );
      if (updatedProfile) {
        res.send(updatedProfile);
      } else {
        next(createHttpError(404, `Profile with id ${profileId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default profilesRouter;
