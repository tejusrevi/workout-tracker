const client = require("../utils/db.js");
const ObjectId = require("mongodb").ObjectId;

async function _get_exercise_collection() {
  let db = await client.getDb();
  return await db.collection("exercise");
}

class Exercise {
  constructor(bodyPart, equipment, gifUrl, id, name, target) {
    this.bodyPart = bodyPart;
    this.equipment = equipment;
    this.gifUrl = gifUrl;
    this.id = id;
    this.name = name;
    this.target = target;
  }

  async save() {}

  static async getByBodyPart(bodyPart) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ bodyPart: bodyPart })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getByTargetMuscle(targetMuscle) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ target: targetMuscle })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getByBodyPartAndMuscle(bodyPart, targetMuscle) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ bodyPart: bodyPart, target: targetMuscle })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getByExerciseName(exerciseName) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ name: exerciseName })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getByBodyPartAndEquipment(bodyPart, equipment) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ bodyPart: bodyPart, equipment: equipment })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getByEquipment(equipment) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .find({ equipment: equipment })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }
  
}

module.exports.Exercise = Exercise;
