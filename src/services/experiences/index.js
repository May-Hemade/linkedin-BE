import express from "express"
import createHttpError from "http-errors"
import ExperienceModel from "./schema.js"

import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

import json2csv from "json2csv"



const experienceRouter = express.Router()


const Json2csvParser = json2csv.Parser;
experienceRouter.get("/:username/experiences/csv", async (req, res) => {
  try {
    const data = await ExperienceModel.find({
        username: req.params.username,
      })

    const jsonData = JSON.parse(JSON.stringify(data));
    console.log(jsonData);
    const csvFields = [
      "_id",
      "role",
      "company",
      "startDate",
      "endDate",
      "description",
      "area",
      "username",
      "createdAt",
      "updatedAt",
    ];
    const json2csvParser = new Json2csvParser({ csvFields });
    const csvData = json2csvParser.parse(jsonData);
    res.setHeader(
      "Content-disposition",
      "attachment; filename=experiences.csv"
    );
    res.set("Content-Type", "text/csv");
    res.status(200).end(csvData);
  } catch (e) {
    console.log(e);
  }
});

experienceRouter.post("/:username/experiences", async (req, res, next) => {
  try {
    const experience = { ...req.body, username: req.params.username };
    const newExperience = new ExperienceModel(experience);
    const { _id } = await newExperience.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

// experienceRouter.get("/:username/experience", async (req, res, next) => {
//   try {
//     const mongoQuery = q2m(req.query)

//     if(req.query.category){
//         mongoQuery.criteria = {category: req.query.category}
//     }

//     const { total, experiences } = await ExperienceModel.findPoductWithReviews(
//       mongoQuery
//     )
//     res.send({
//       links: mongoQuery.links("/experience", total),
//       total,
//       totalPages: Math.ceil(total / mongoQuery.options.limit),
//       experiences,
//     })
//   } catch (error) {
//     next(error)
//   }
// })

experienceRouter.get("/:username/experiences", async (req, res, next) => {
  try {
    const username = req.params.username;
    const experiences = await ExperienceModel.find({ username: username });
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experienceRouter.get(
  "/:username/experiences/:expId",
  async (req, res, next) => {
    try {
      const expId = req.params.expId;

      const experience = await ExperienceModel.findById(expId);
      if (experience) {
        res.send(experience);
      } else {
        next(createHttpError(404, `Experience with id ${expId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

experienceRouter.put(
  "/:username/experiences/:expId",
  async (req, res, next) => {
    try {
      const expId = req.params.expId;
      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        expId,
        req.body,
        {
          new: true,
        }
      );
      if (updatedExperience) {
        res.send(updatedExperience);
      } else {
        next(createHttpError(404, `Experience with id ${expId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

experienceRouter.delete(
  "/:username/experiences/:expId",
  async (req, res, next) => {
    try {
      const expId = req.params.expId;
      const deletedExperience = await ExperienceModel.findByIdAndDelete(expId);
      if (deletedExperience) {
        res.status(204).send();
      } else {
        next(
          createHttpError(404, `Experience with id ${experienceId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "experiences",
    },
  }),
}).single("image");

experienceRouter.post(
  "/:username/experiences/:expId/picture",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const expId = req.params.expId;
      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        expId,
        { image: req.file.path },
        {
          new: true,
        }
      );

      res.send(updatedExperience);
    } catch (error) {
      next(error);
    }
  }
);

experienceRouter.post(
  "/:username/experiences/:expId/picture",
  async (req, res, next) => {
    try {
      const newExperience = new ExperienceModel(req.body);
      const { _id } = await newExperience.save();
      const modifiedExperience = await ExperienceModel.findOneAndUpdate(
        req.params.expId,
        { $push: { Experiences: newExperience } },
        {
          new: true,
        }
      );

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

export default experienceRouter;
