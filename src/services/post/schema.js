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
    likes: [{ type: Schema.Types.ObjectId, ref: "Profile" }],

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
      path: "profiles Comments",
    });
  return { total, users };
});
postSchema.static("findPostsWithComments", async function (mongoQuery) {
  const total = await this.countDocuments(mongoQuery.criteria);
  const comments = await this.find(mongoQuery.criteria)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({
      path: "comments",
    });
  return { total, comments };
});

export default model("Post", postSchema);

/* postSchema.pre("save", async function (done) {
  try {
    const isExist = await profilesModel.findById(this.profile);
    if (isExist) {
      done();
    } else {
      const error = new Error("this profile does not exist");
      error.status = 400;
      done(error);
    }
  } catch (error) {
    done(error);
  }
}); */
