const express = require("express");
const session = require("express-session");
var path = require("path");
const passport = require("passport");

const app = express();
const port = 3000;

app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); //incoming objects are strings or arrays

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

const mongo = require("./utils/db.js");
const auth = require("./utils/auth.js");

const userController = require("./controller/userController.js");
const exerciseController = require("./controller/exerciseController.js");
var server;

async function createServer() {
  try {
    await mongo.connectToDB();

    app.get("/", (req, res) => {
      res.sendFile(path.resolve("view/index.html"));
    });

    // Local auth
    app.post(
      "/auth/local",
      passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
      })
    );

    app.post("/user", userController.addLocal);

    app.delete("/user", auth.checkAuthenticated, userController.deleteUser);

    app.put("/user", auth.checkAuthenticated, userController.updateUser);

    app.put(
      "/personalInformation",
      auth.checkAuthenticated,
      userController.updatePersonalInformation
    );

    app.get("/exercise/bodyPart/:bodyPart", exerciseController.getByBodyPart);
    app.get(
      "/exercise/targetMuscle/:targetMuscle",
      exerciseController.getByTargetMuscle
    );
    app.get(
      "/exercise/exerciseName/:exerciseName",
      exerciseController.getByExerciseName
    );
    app.get(
      "/exercise/equipment/:equipment",
      exerciseController.getByEquipment
    );

    // Google Auth
    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
      })
    );

    // Dashboard
    app.get("/dashboard", auth.checkAuthenticated, (req, res) => {
      res.sendFile(path.resolve("view/authenticated/dashboard.html"));
    });

    app.get("/editProfile", auth.checkAuthenticated, (req, res) => {
      res.sendFile(path.resolve("view/authenticated/editProfile.html"));
    });

    // Add Workout Plan Form
    app.get("/workoutPlan", auth.checkAuthenticated, (req, res) => {
      res.sendFile(path.resolve("view/authenticated/addWorkoutPlan.html"));
    });

    app.post(
      "/workoutPlan",
      auth.checkAuthenticated,
      userController.addWorkoutPlan
    );
    app.delete(
      "/workoutPlan/:day/:workoutID",
      auth.checkAuthenticated,
      userController.deleteWorkoutPlan
    );

    // start the server
    server = app.listen(port, () => {
      console.log("App listening at http://localhost:%d", port);
    });
  } catch (err) {
    console.log(err);
  }
}
createServer();

/**
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function(){
    let msg = await mongo.closeDBConnection()   ;
    console.log(msg);
  });
  
});
*/
