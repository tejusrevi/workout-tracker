const Exercise = require("../model/exercise").Exercise;

module.exports.getExerciseByID = async (req, res) => {
  let exerciseID = req.params.exerciseID;
  let msg = {};
  let exerciseObj = await Exercise.getExerciseByID(exerciseID)
  if (exerciseObj){
    res.send(exerciseObj)
  }else{
    res.send(msg = {
      success: false,
      message : "Incorrect ID."
    });
  }
};

module.exports.getAllExercise = async (req, res) => {
  let bodyPart = req.query.bodyPart;
  let target = req.query.target;
  let equipment = req.query.equipment;

  res.send(await Exercise.getAllExercise(bodyPart, target, equipment));
};
