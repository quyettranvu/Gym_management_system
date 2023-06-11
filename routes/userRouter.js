import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.post("/forgotpassword", userCtrl.forgotPassword);
router.post("/resetpassword/:id/:token", userCtrl.resetPassword);

router.get("/logout", userCtrl.logout);
router.get("/refresh_token", userCtrl.refreshToken);
router.get("/infor", auth, userCtrl.getUser);
router.get("/allUsersId", userCtrl.getAllUsersById); //find users for chat(except user account)
router.get("/partnerinfor/:id", userCtrl.getUserById); //find users for chat(except user account)
router.get("/history", auth, userCtrl.history);
router.get("/getallusers", userCtrl.getAllUsers);

//Patch changes relating to cart, information, password and addresses
router.patch("/addcart", auth, userCtrl.addCart);
router.patch("/updateinfo/:id", userCtrl.updateInfo);
router.patch("/updatepass/:id", userCtrl.updatePass);
router.patch("/updateaddress/:id", userCtrl.updateAddress);
router.patch("/deleteaddress/:id", userCtrl.deleteAddress);
router.patch("/editaddress/:id", userCtrl.editAddress);
router.patch("/updatebelovedproducts/:id", userCtrl.updateBelovedProducts);
router.patch(
  "/removebelovedproducts/:userId/:productId",
  userCtrl.removeBelovedProducts
);

//Upload Informations in Profile
router.put("/upload/:id", userCtrl.uploadAvatar);
router.put("/coverupload/:id", userCtrl.uploadCover);

export default router;
