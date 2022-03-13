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
const workoutProgramController = require("./controller/workoutProgramController.js");

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
        successRedirect: "/user",
        failureRedirect: "/",
      })
    );

    // Google Auth
    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        successRedirect: "/user",
        failureRedirect: "/",
      })
    );

    app.get("/user", auth.checkAuthenticated, userController.getUserByID); // Receives userID from the session
    app.post("/user", userController.addLocal);
    app.delete("/user", auth.checkAuthenticated, userController.deleteUser);
    app.put("/user", auth.checkAuthenticated, userController.updateUser);
    app.put(
      "/user/personalInformation",
      auth.checkAuthenticated,
      userController.updatePersonalInformation
    );

    app.get("/exercise/:exerciseID", exerciseController.getExerciseByID);
    app.get("/exercise", exerciseController.getAllExercise);

    app.get(
      "/workoutProgram",
      workoutProgramController.getAllPublicWorkoutPrograms
    );
    app.get(
      "/workoutProgram/:workoutProgramID",
      workoutProgramController.getWorkoutProgramByID
    );
    app.post(
      "/workoutProgram",
      auth.checkAuthenticated,
      workoutProgramController.addWorkoutProgram
    );
    app.delete(
      "/workoutProgram/:workoutProgramID",
      auth.checkAuthenticated,
      workoutProgramController.deleteWorkoutProgram
    );
    app.put(
      "/workoutProgram/:workoutProgramID",
      auth.checkAuthenticated,
      workoutProgramController.updateWorkoutProgram
    );

    app.put(
      "/workoutProgram/addExercise/:workoutProgramID",
      auth.checkAuthenticated,
      workoutProgramController.addExerciseToWorkoutProgram
    );

    app.put(
      "/workoutProgram/removeExercise/:workoutProgramID", // Exercise id passed as query param
      auth.checkAuthenticated,
      workoutProgramController.removeExerciseFromWorkoutProgram
    );

    app.get(
      "/user/workoutPrograms",
      auth.checkAuthenticated,
      workoutProgramController.getWorkoutProgramsByUser
    )

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
