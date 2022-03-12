const client = require('../utils/db.js');
const ObjectID = require('mongodb').ObjectId;

async function _get_exercise_collection (){
    let db = await client.getDb();
    return await db.collection('exercise');
};

module.exports.showByBodyPart = async(req,res) =>{
    
    try {
        let exerciseCollection = await _get_exercise_collection();
        let bodyPart = req.params.bodyPart;

        res.send(exerciseCollection.find({"bodyPart" : bodyPart}).pretty());
    }
    catch (err) {
        throw err;
    }
}


module.exports.showByTargetMuscle = async(req,res) =>{
    
    try {
        let exerciseCollection = await _get_exercise_collection();
        let targetMuscle = req.param.targetMuscle;

        res.send(exerciseCollection.find({"target" : targetMuscle}).pretty());
    }
    catch (err) {
        throw err;
    }
}


module.exports.showByBodyPartAndMuscle = async(req,res) =>{
    
    try {
        let exerciseCollection = await _get_exercise_collection();
        let bodyPart = req.params.bodyPart;
        let targetMuscle = req.param.targetMuscle;

        res.send(exerciseCollection.find({"bodyPart" : bodyPart, "target" : targetMuscle}).pretty());
    }
    catch (err) {
        throw err;
    }
}

module.exports.showByExerciseName = async(req,res) =>{
    
    try {
        let exerciseCollection = await _get_exercise_collection();
        let exerciseName = req.params.exerciseName;

        res.send(exerciseCollection.find({"name" : exerciseName}).pretty());
    }
    catch (err) {
        throw err;
    }
}

module.exports.showByBodyPartAndEquipment = async(req,res) =>{
    
    try {
        let exerciseCollection = await _get_exercise_collection();
        let bodyPart = req.params.bodyPart;
        let equipment = req.params.equipmentName;

        res.send(exerciseCollection.find({"bodyPart" : bodyPart, "equipment" : equipment}).pretty());
    }
    catch (err) {
        throw err;
    }
}

