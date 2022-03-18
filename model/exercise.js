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

  static async getExerciseByID(exerciseID) {
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection
        .findOne({ id: exerciseID })
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getAllExercise(bodyPart, target, equipment) {
    let queryString = {};
    if (bodyPart) {
      queryString["bodyPart"] = bodyPart;
    }
    if (target) {
      queryString["target"] = target;
    }
    if (equipment) {
      queryString["equipment"] = equipment;
    }
    try {
      let exerciseCollection = await _get_exercise_collection();
      let mongoObj = await exerciseCollection.find(queryString).toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }
}

module.exports.Exercise = Exercise;
