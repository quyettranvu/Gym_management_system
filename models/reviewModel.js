import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
