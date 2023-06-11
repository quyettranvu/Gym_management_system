import express from "express";
import passport from "passport";
import ".././middleware/passport.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    //successRedirect: "",
  }),
  (req, res) => {
    console.log(res);
  }
);

export default router;
