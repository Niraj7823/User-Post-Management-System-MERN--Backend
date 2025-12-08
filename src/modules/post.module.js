import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      minLength: 1,
      maxLength: 20,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      require: true,
      min: 1,
      max: 150,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
