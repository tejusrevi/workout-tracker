const Exercise = require("../model/exercise").Exercise;

module.exports.getExerciseByID = async (req, res) => {
  let exerciseID = req.params.exerciseID;
  res.send(await Exercise.getExerciseByID(exerciseID));
};

module.exports.getAllExercise = async (req, res) => {
  let bodyPart = req.query.bodyPart;
  let target = req.query.target;
  let equipment = req.query.equipment;

  res.send(await Exercise.getAllExercise(bodyPart, target, equipment));
};
