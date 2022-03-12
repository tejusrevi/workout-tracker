const Exercise = require("../model/exercise").Exercise;

module.exports.getByBodyPart = async (req, res) => {
  let bodyPart = req.params.bodyPart;
  res.send(await Exercise.getByBodyPart(bodyPart));
};

module.exports.getByTargetMuscle = async (req, res) => {
  let targetMuscle = req.params.targetMuscle;
  res.send(await Exercise.getByTargetMuscle(targetMuscle));

};

module.exports.getByExerciseName = async (req, res) => {
  let exerciseName = req.params.exerciseName;
  res.send(await Exercise.getByExerciseName(exerciseName));
};

module.exports.getByEquipment = async (req, res) => {
  let equipment = req.params.equipment;
  res.send(await Exercise.getByEquipment(equipment));
};



