import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      default: "",
    },
    paymentID: {
      type: [String], // Set type to Array of Strings
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Delivery", deliverySchema);
