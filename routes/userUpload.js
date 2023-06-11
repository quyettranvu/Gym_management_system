import express from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

// we will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload image only admin can use only
router.post("/user/upload", (req, res) => {
  try {
    //console.log(req.files);
    const file = req.files.file;

    if (file) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "user" },
        async (err, result) => {
          if (err) {
            console.log("Error occurred while uploading file");
          } else {
            res.json({ url: result.secure_url });
          }
          removeTmp(file.tempFilePath);
        }
      );
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export default router;
