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
    // user: [{type: Schema.TypesObjectId, required:true, ref: "Profile"}]
  },
  { timestamps: true }
);
export default model("Post", postSchema);
