import mongoose from "mongoose";
import mongooseToCsv from "mongoose-to-csv";

const { Schema, model } = mongoose;

const CommentsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comments: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

CommentsSchema.static("findCommentsWithUsers", async function (mongoQuery) {
  const total = await this.countDocuments(mongoQuery.criteria);
  const users = await this.find(mongoQuery.criteria)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({
      path: "profiles",
    });
  return { total, users };
});
export default model("Comments ", CommentsSchema);
