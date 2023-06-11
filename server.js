//Khi mình ko thêm type:module vào thì mình phái sử dụng require
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import postRoutes from "./routes/userRouter.js";
import categoryRoutes from "./routes/categoryRouter.js";
import cloudinaryRoutes from "./routes/upload.js";
import cloudinaryUserRoutes from "./routes/userUpload.js";
import productRoutes from "./routes/productRouter.js";
import paymentRoutes from "./routes/paymentRouter.js";
import authRoutes from "./routes/authRouter.js";
import deliveryRoutes from "./routes/deliveryRouter.js";
import conversationRoutes from "./routes/conversationsRouter.js";
import messageRoutes from "./routes/messagesRouter.js";
import passport from "passport";
import cookieSession from "cookie-session";
import "./middleware/passport.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

//Optimizing upload files
app.use(
  fileUpload({
    useTempFiles: true, //Use temp files instead of memory for managing the upload process.
  })
);

//Cookies settings
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Routes thiết lập làm root mặc định
app.use("/user", postRoutes);
app.use("/api", categoryRoutes);
app.use("/api", cloudinaryRoutes);
app.use("/api", cloudinaryUserRoutes);
app.use("/api", productRoutes);
app.use("/api", paymentRoutes);
app.use("/api", deliveryRoutes);
app.use("/api", conversationRoutes);
app.use("/api", messageRoutes);

//Routes for auth Google, Facebook
app.use("/auth", authRoutes);

//Connect to mongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to DB");
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
