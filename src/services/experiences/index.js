import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./schema.js";
import q2m from "query-to-mongo";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import fs from "fs";
import json2csv from "json2csv";
import path from "path";

import { join, dirname } from "path";

const experienceRouter = express.Router();
const publicFolderPath = join(process.cwd(), "./public/expriences");
experienceRouter.get("/:username/experiences/CSV", async (req, res, next) => {
  try {
    const dateTime = new Date()
      .toISOString()
      .slice(-24)
      .replace(/\D/g, "")
      .slice(0, 14);

    const filePath = path.join(
      publicFolderPath,

      "csv-" + dateTime + ".csv"
    );

    let csv;

    const experience = await ExperienceModel.find({
      username: req.params.username,
    });

    const fields = [
      "role",
      "company",
      "startDate",
      "endDate",
      "description",
      "username",
    ];

    csv = json2csv.parse(experience, { fields });

    fs.writeFile(filePath, csv, function (err) {
      if (err) {
        return res.json(err).status(500);
      } else {
        setTimeout(function () {
          fs.unlink(filePath, function (err) {
            if (err) {
              console.error(err);
            }
            console.log("File has been Deleted");
          });
        }, 30000);

        const source = fs.createReadStream(filePath);
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=experiences.csv"
        );

        const transform = new json2csv.Transform({
          fields: fields,
        });
        const destination = res;

        pipeline(source, transform, destination, (err) => {
          if (err) next(err);
        });
      }
    });
  } catch (error) {
    next(error);
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
