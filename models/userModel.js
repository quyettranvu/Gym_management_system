import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    phone: {
      type: String,
      unique: false,
      default: "",
    },
    addresses: {
      type: [
        {
          type: String,
          trim: true,
          maxLength: 200,
        },
      ],
      default: [],
    },
    forgot_password_code: {
      type: String,
      default: "",
    },
    vip_mode: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: "default.jpg",
    },
    coverphoto: {
      type: String,
      default: "default.jpg",
    },
    images: {
      type: [String],
      default: [],
    },
    googleId: {
      type: String,
      trim: true,
      unique: false,
      sparse: true,
      default: "",
    },
    facebookId: {
      type: String,
      trim: true,
      unique: false,
      sparse: true,
      default: "",
    },
    isInstructor: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
    belovedProducts: {
      type: [
        {
          productId: {
            type: String,
            default: "",
            unique: false,
            sparse: true,
          },
          productTitle: {
            type: String,
            trim: true,
          },
          productImages: {
            type: Object,
          },
          productRating: {
            type: Number,
            default: 3,
            min: 0,
            max: 5,
          },
          productPrice: {
            type: Number,
            trim: true,
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

var UserMessage = mongoose.model("Users", userSchema);

export default UserMessage;
