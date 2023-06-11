import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    promotionalPrice: {
      type: mongoose.Decimal128,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5,
    },
    reviews: {
      type: [
        {
          userPhoto: {
            type: String,
            default: "default.jpg",
          },
          userName: {
            type: String,
            trim: true,
            default: "",
          },
          rating: {
            type: Number,
            default: 3,
            min: 0,
            max: 5,
          },
          comment: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", productSchema);
