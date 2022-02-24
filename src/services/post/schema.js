import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    image: {
      type: String,
      default: "https://picsum.photos/200/300",
    },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

postSchema.static("findPostsWithUsers", async function (mongoQuery) {
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

export default model("Post", postSchema);
