const passport = require('passport')

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const LocalStrategy = require( 'passport-local' ).Strategy;
const { google } = require("googleapis");

const userController = require('../controller/userController')

const GOOGLE_CLIENT_ID = "125650216413-snnjss4b97no4tkkcvrvbeecvopkbc9u.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

// Google Strategy
authGoogleUser = (request, accessToken, refreshToken, profile, done) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return done(null, profile);
}

passport.use(new GoogleStrategy({
  clientID:     GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback   : true
  }, 
  authGoogleUser));

//Local Strategy
authLocalUser = async (email, password, done) => {
  if (await userController.validateUser(email, password)){
    userObj = await userController.getUserDetails(email)
    return done(null, {displayName: userObj.username});
  }else{
    return done(null, false);
  } 
}

passport.use(new LocalStrategy({usernameField: 'email'}, authLocalUser))

passport.serializeUser( (user, done) => { 
  console.log(user)
  done(null, user)
} )

passport.deserializeUser((user, done) => {
  console.log(user)
  done(null, user)
}) 

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/")
}

module.exports = {checkAuthenticated}