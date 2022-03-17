const WorkoutProgram = require("../model/workoutProgram.js").WorkoutProgram;
const Exercise = require("../model/exercise.js").Exercise;

module.exports.getAllPublicWorkoutPrograms = async (req, res) => {
  res.send(await WorkoutProgram.getAllPublicWorkoutPrograms());
};

module.exports.getWorkoutProgramByID = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if ( workoutObj != null ){
    if (workoutObj.isPublic){
      res.send(workoutObj);
    }
    else if (req.user){
      if (workoutObj.createdBy == req.user.user._id){
        res.send(workoutObj);
      }
    }else{
      res.send({
        success: false,
        message: "You are not authorized to view this information."
      });
    }
  }else{
    res.send({
      success: false,
      message: "Invalid Workout Program ID"
    });
  }
};

module.exports.addWorkoutProgram = async (req, res) => {
  let isPublic = req.body.isPublic;
  let nameOfProgram = req.body.nameOfProgram;
  let createdBy = req.user.user._id;

  let wasCreated = false;
  let msg = {};

  if (isPublic && nameOfProgram) {
    wasCreated = await new WorkoutProgram(
      isPublic,
      nameOfProgram,
      createdBy
    ).save();
    msg = {
      success: true,
      message: "A new workout program was created."
    }
  } else {
    msg = {
      success: false,
      message: "Missing values for isPublic and nameOfWorkout."
    }
  }
  res.send(msg)
};

module.exports.deleteWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  let wasDeleted = false;
  if (workoutObj == null) {
    res.send("Invalid ID.");
  } else if (workoutObj.createdBy == req.user.user._id) {
    wasDeleted = await WorkoutProgram.deleteWorkoutProgram(workoutProgramID));
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
