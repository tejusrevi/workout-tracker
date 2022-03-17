const client = require("../utils/db.js");
const ObjectId = require("mongodb").ObjectId;

async function _get_users_collection() {
  let db = await client.getDb();
  return await db.collection("workout-program");
}

class WorkoutProgram {
  constructor(isPublic, nameOfProgram, createdBy) {
    if (isPublic == 0) {
      this.isPublic = false;
    } else {
      this.isPublic = true;
    }
    this.nameOfProgram = nameOfProgram;
    this.createdBy = createdBy;
    this.exercises = [];
  }

  async save() {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.insertOne(this);
      return mongoObj.insertedId
    } catch (err) {
      throw err;
    }
  }

  static async getWorkoutProgramByID(workoutProgramID) {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.findOne({
        _id: ObjectId(workoutProgramID),
      });
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async getAllPublicWorkoutPrograms() {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection
        .find({
          isPublic: true,
        })
        .toArray();
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async deleteWorkoutProgram(workoutProgramID) {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.deleteOne({
        _id: ObjectId(workoutProgramID),
      });
      if (mongoObj.deletedCount == 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  static async updateWorkoutProgram(
    workoutProgramID,
    newIsPublic,
    newNameOfProgram
  ) {
    let mongoObj;
    try {
      let collection = await _get_users_collection();
      if (newIsPublic != undefined) {
        if (newIsPublic == 0) {
          newIsPublic = false;
        } else {
          newIsPublic = true;
        }
        mongoObj = await collection.updateOne(
          { _id: ObjectId(workoutProgramID) },
          {
            $set: {
              isPublic: newIsPublic,
            },
          }
        );
      }

      if (newNameOfProgram != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(workoutProgramID) },
          {
            $set: {
              nameOfProgram: newNameOfProgram,
            },
          }
        );
      }

      if (mongoObj.modifiedCount == 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  static async addExerciseToWorkoutProgram(workoutProgramID, exercise, numSets, numReps){
    let mongoObj;
    try {
      let collection = await _get_users_collection();
      mongoObj = await collection.updateOne(
        { _id: ObjectId(workoutProgramID) },
        {
          $push: {
            exercises : {exercise: exercise, numSets: numSets, numReps: numReps},
          },
        }
      );
      if (mongoObj.modifiedCount == 1) {
        return true;
      } else {
        return false;
      }
    }catch(err){
      throw err;
    }
  }

  static async removeExerciseFromWorkoutProgram(workoutProgramID, exerciseID){
    let mongoObj;
    try {
      let collection = await _get_users_collection();
      mongoObj = await collection.updateOne(
        { _id: ObjectId(workoutProgramID) },
        {
          $pull: {
            exercises :{
              'exercise.id': exerciseID
            },
          },
        }
      );
      if (mongoObj.modifiedCount == 1) {
        return true;
      } else {
        return false;
      }
    }catch(err){
      throw err;
    }
  }

  static async getWorkoutProgramsByUser(userID){
    let mongoObj;
    try {
      let collection = await _get_users_collection();
      mongoObj = await collection.find({createdBy: userID}).toArray();
      return mongoObj;
    }catch(err){
      throw err;
    }
  }  
}

module.exports.WorkoutProgram = WorkoutProgram;
