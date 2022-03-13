const WorkoutProgram = require("../model/workoutProgram.js").WorkoutProgram;
const Exercise = require("../model/exercise.js").Exercise;
const UserController = require("../controller/userController.js");

module.exports.getAllPublicWorkoutPrograms = async (req, res) => {
  res.send(await WorkoutProgram.getAllPublicWorkoutPrograms());
};

module.exports.getWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (
    workoutObj != null &&
    (workoutObj.isPublic || workoutObj.createdBy == req.user.user._id)
  ) {
    res.send(workoutObj);
  } else {
    res.send("You are not authorized to view this information.");
  }
};

module.exports.addWorkoutProgram = async (req, res) => {
  let isPublic = req.body.isPublic;
  let nameOfProgram = req.body.nameOfProgram;
  let createdBy = req.user.user._id;

  if (isPublic && nameOfProgram) {
    let workoutProgram = await new WorkoutProgram(
      isPublic,
      nameOfProgram,
      createdBy
    ).save();
    UserController.addWorkoutProgramToUser(workoutProgram._id);
    res.send("A new workout plan was created");
  } else {
    res.send("Could not create a workout plan.");
  }
};

module.exports.deleteWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    res.send("Invalid ID.");
  } else if (workoutObj.createdBy == req.user.user._id) {
    res.send(await WorkoutProgram.deleteWorkoutProgram(workoutProgramID));
  } else {
    res.send("You are not authorized to delete this information.");
  }
};

module.exports.updateWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let isPublic = req.body.isPublic;
  let nameOfProgram = req.body.nameOfProgram;
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    res.send("Invalid ID.");
  } else if (workoutObj.createdBy == req.user.user._id) {
    res.send(
      await WorkoutProgram.updateWorkoutProgram(
        workoutProgramID,
        isPublic,
        nameOfProgram
      )
    );
  } else {
    res.send("You are not authorized to update this information.");
  }
};

module.exports.addExerciseToWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let exerciseID = req.body.exerciseID;
  let numSets = req.body.numSets;
  let numReps = req.body.numReps;
  let exercise = await Exercise.getExerciseByID(exerciseID);
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    res.send("Invalid ID.");
  } else if (workoutObj.createdBy == req.user.user._id) {
    res.send(
      await WorkoutProgram.addExerciseToWorkoutProgram(
        workoutProgramID,
        exercise,
        numSets,
        numReps
      )
    );
  } else {
    res.send("You are not authorized to add exercises to this program.");
  }
};

module.exports.removeExerciseFromWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let exerciseID = req.query.exerciseID;
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    res.send("Invalid ID.");
  } else if (workoutObj.createdBy == req.user.user._id) {
    res.send(
      await WorkoutProgram.removeExerciseFromWorkoutProgram(
        workoutProgramID,
        exerciseID
      )
    );
  } else {
    res.send("You are not authorized to add exercises to this program.");
  }
};

module.exports.getWorkoutProgramsByUser = async (req, res) => {
  let userID = req.user.user._id;

  res.send(await WorkoutProgram.getWorkoutProgramsByUser(userID));
};
