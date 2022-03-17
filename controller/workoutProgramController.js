const WorkoutProgram = require("../model/workoutProgram.js").WorkoutProgram;
const Exercise = require("../model/exercise.js").Exercise;
const validator = require("../utils/validate-fields.js");

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
      message: "Invalid Workout Program ID."
    });
  }
};

module.exports.getWorkoutProgramsByUser = async (req, res) => {
  let userID = req.user.user._id;
  res.send(await WorkoutProgram.getWorkoutProgramsByUser(userID));
};

module.exports.addWorkoutProgram = async (req, res) => {
  let isPublic = req.body.isPublic;
  let nameOfProgram = req.body.nameOfProgram;
  let createdBy = req.user.user._id;

  let insertedID;
  let msg = {};

  let isFormValid = validator.validWorkoutProgramInfo(isPublic, nameOfProgram);

  if (isFormValid.valid) {
    if (isPublic != null && nameOfProgram != null) {
      insertedID = await new WorkoutProgram(
        isPublic,
        nameOfProgram,
        createdBy
      ).save();
      msg = {
        success: true,
        message: "A new workout program was created.",
        insertedID: insertedID
      }
    } else {
      msg = {
        success: false,
        message: "Missing values for isPublic and nameOfWorkout."
      }
    }
  }else{
    msg = {
      success: false,
      message: isFormValid.errorMessage
    }
  }

  res.send(msg)
};

module.exports.deleteWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  let msg = {};
  if (workoutObj == null) {
    msg = {
      success: false,
      message: "Invalid Workout Program ID."
    }
  } else if (workoutObj.createdBy == req.user.user._id) {
    await WorkoutProgram.deleteWorkoutProgram(workoutProgramID);
    msg = {
      success: true,
      message: "Workout Plan was deleted."
    }
  } else {
    msg = {
      success: false,
      message: "You are not authorized to delete this information."
    }
  }
  res.send(msg)
};

module.exports.updateWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let isPublic = req.body.isPublic;
  let nameOfProgram = req.body.nameOfProgram;
  let msg = {};
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    msg = {
      success: false,
      message: "Invalid Workout Program ID."
    }
  } else if (workoutObj.createdBy == req.user.user._id) {
      await WorkoutProgram.updateWorkoutProgram(
        workoutProgramID,
        isPublic,
        nameOfProgram
      )
      msg = {
        success: true,
        message: "Workout Plan was deleted."
      }
  } else {
    msg = {
      success: false,
      message: "You are not authorized to update this information."
    }
  }
  res.send(msg);
};

module.exports.addExerciseToWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let exerciseID = req.body.exerciseID;
  let numSets = req.body.numSets;
  let numReps = req.body.numReps;
  let exercise = await Exercise.getExerciseByID(exerciseID);
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    msg = {
      success: false,
      message: "Invalid Workout Program ID."
    }
  } else if (workoutObj.createdBy == req.user.user._id) {
    let wasUpdated = await WorkoutProgram.addExerciseToWorkoutProgram(
        workoutProgramID,
        exercise,
        numSets,
        numReps
      )
    if (wasUpdated){
      msg = {
        success: true,
        message: "Exercise was addedd to workout program."
      }
    }else {
      msg = {
        success: false,
        message: "Exercise was not addedd to workout program."
      }
    }
  } else {
    msg = {
      success: false,
      message: "You are not authorized to add exercises to this program."
    }
  }
  res.send(msg);
};

module.exports.removeExerciseFromWorkoutProgram = async (req, res) => {
  let workoutProgramID = req.params.workoutProgramID;
  let exerciseID = req.query.exerciseID;
  let msg = {}
  workoutObj = await WorkoutProgram.getWorkoutProgramByID(workoutProgramID);
  if (workoutObj == null) {
    msg = {
      success: false,
      message: "Invalid ID."
    }
  } else if (workoutObj.createdBy == req.user.user._id) {
      let wasRemoved = await WorkoutProgram.removeExerciseFromWorkoutProgram(
        workoutProgramID,
        exerciseID
      )
      if (wasRemoved){
        msg = {
          success: true,
          message: "Exercise removed from workout program."
        }
      }else {
        msg = {
          success: false,
          message: "Could not removed exercise from the workout program."
        }
      }
  } else {
    msg = {
      success: false,
      message: "You are not authorized to add exercises to this program."
    }
  }
  res.send(msg);
};

