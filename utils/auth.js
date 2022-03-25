const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { google } = require("googleapis");

const User = require("../model/user").User;

const GOOGLE_CLIENT_ID =
  "125650216413-snnjss4b97no4tkkcvrvbeecvopkbc9u.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);

// Setting up Google Strategy
authGoogleUser = async (request, accessToken, refreshToken, profile, done) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  await User.addNonLocal(profile.displayName, profile.email);
  userObj = await User.getUserDetails(profile.email);
  return done(null, { user: userObj });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    authGoogleUser
  )
);

//Setting up Local Strategy
authLocalUser = async (email, password, done) => {
  if (await User.authenticateUser(email, password)) {
    userObj = await User.getUserDetails(email);
    return done(null, { user: userObj });
  } else {
    return done(null, false);
  }
};

passport.use(new LocalStrategy({ usernameField: "email" }, authLocalUser));

// Serializing user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializing user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Checks if the request is made from an authenticated session
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send({
      success: false,
      message: "User needs to be authenticated to perform this action.",
    });
  }
};

module.exports = { checkAuthenticated };
