import passport from "passport";
import passportauth from "passport-google-oauth20";
import Users from "../models/userModel.js";

var GoogleStrategy = passportauth.Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      Users.findOne({ googleId: profile.id }).then((exsitingUser) => {
        if (exsitingUser) {
          done(null, exsitingUser);
        } else {
          new Users({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "",
            googleId: profile.id,
          })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
