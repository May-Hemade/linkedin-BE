import mongoose from "mongoose";
import mongooseToCsv from "mongoose-to-csv";

const { Schema, model } = mongoose;

const CommentsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// ProductSchema.static("findPoductWithReviews", async function (mongoQuery) {
//     const total = await this.countDocuments(mongoQuery.criteria)
//     const products = await this.find(mongoQuery.criteria)
//       .limit(mongoQuery.options.limit)
//       .skip(mongoQuery.options.skip)
//       .sort(mongoQuery.options.sort)
//       .populate({
//         path: "reviews",
//         select: "comment rate",
//       })
//     return { total, products }
//   })
export default model("Comments ", CommentsSchema);
