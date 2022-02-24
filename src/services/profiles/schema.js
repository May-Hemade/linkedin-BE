import mongoose from "mongoose"

const { Schema, model } = mongoose

const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      required: false,
      default:
        "https://simulacionymedicina.es/wp-content/uploads/2015/11/default-avatar-300x300-1.jpg",
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String },
  },
  {
    timestamps: true,
  }
)

export default model("Profile", profileSchema)
