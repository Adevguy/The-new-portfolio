import mongoose from "mongoose";
const { Schema, model } = mongoose;

const blogsSchema = new Schema({
  header: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => {
      const date = new Date();
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        day: "numeric",
      });
    },
  },
});

export default model("Blog", blogsSchema);