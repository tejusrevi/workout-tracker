const client = require('../utils/db.js');
const ObjectID = require('mongodb').ObjectId;
var passwordHash = require('password-hash');

async function _get_users_collection (){
    let db = await client.getDb();
    return await db.collection('user');
};


class User {
  constructor(isLocal, username, email, password){
    this.isLocal = isLocal;
    this.username = username;
    this.email = email;
    this.password = password;
    this.workoutPlan ={ "sunday" : [],
                        "monday" : [],
                        "tuesday" : [],
                        "wednesday" : [],
                        "thursday" : [],
                        "friday" : [],
                        "saturday" : []
    };
  }

  async save(){
     if (await User.emailDoesNotExists(this.email)){
      try{
        let collection = await _get_users_collection();
        let mongoObj = await collection.insertOne(this);
        console.log('1 User was inserted in the database with id -> '+mongoObj.insertedId);
        return true;            
      }catch(err){
        throw err
      } 
     }else{
       return false;
     }       
  }

  static async emailDoesNotExists(email){
    try{
      let collection = await _get_users_collection();
      let count = await collection.count({email: email})
      console.log( count )
      if (count > 0){
        return false
      }
      return true
    }catch(err){
      throw err
    }
  }

  static async getPasswordFor(email){
    let o = await User.emailDoesNotExists(email)
    console.log(o)
    if ( !o ){
      try{
        let collection = await _get_users_collection();
        let mongoObj = await collection.findOne({email: email})
        return mongoObj.password;
      }catch(err){
        throw err;
      }
    }
  }

  static async getUserDetails(email){
    try{
      let collection = await _get_users_collection();
      let mongoObj = await collection.findOne({email: email})
      return mongoObj;
    }catch(err){
      throw err;
    }
  }

  static async addNonLocal (username, email){
    if (User.emailDoesNotExists(email)){
      let new_user = new User(false, username, email);
      let msg = await new_user.save();
    }
  };

  static async authenticateUser(email, password){
    if (passwordHash.verify(password, await User.getPasswordFor(email))) return true;
    return false;
  }

  static async addWorkoutPlan(userID, day, workoutID){
    try{
      let collection = await _get_users_collection();
      let mongoObj;
      if (day == 0){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.sunday" : workoutID }});
      }else if (day == 1){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.monday" : workoutID }});
      }else if (day == 2){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.tuesday" : workoutID }});
      }else if (day == 3){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.wednesday" : workoutID }});
      }else if (day == 4){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.thursday" : workoutID }});
      }else if (day == 5){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.friday" : workoutID }});
      }else if (day == 6){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $push: { "workoutPlan.saturday" : workoutID }});
      }else{
        return "Incorrect date."
      }
      return "Workout "+ workoutID +" was added.";            
    }catch(err){
      throw err
    } 
  }

  static async deleteWorkoutPlan(userID, day, workoutID){
    try{
      let collection = await _get_users_collection();
      let mongoObj;
      if (day == 0){
        mongoObj = await collection.updateOne({_id: ObjectID(userID)}, { $pull: { "workoutPlan.sunday" : workoutID}});
      }else if (day == 1){
        mongoObj = await collection.updateOne({_id: ObjectID(userID)}, { $pull: { "workoutPlan.monday" : workoutID}});
      }else if (day == 2){
        mongoObj = await collection.updateOne({_id: ObjectID(userID)}, { $pull: { "workoutPlan.tuesday" : workoutID}});
      }else if (day == 3){
        mongoObj = await collection.updateOne({_id: ObjectID(userID)}, { $pull: { "workoutPlan.wednesday" : workoutID}});
      }else if (day == 4){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $pull: { "workoutPlan.thursday" : workoutID }});
      }else if (day == 5){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $pull: { "workoutPlan.friday" : workoutID }});
      }else if (day == 6){
        mongoObj = await collection.updateOne({ _id: ObjectID(userID) },{ $pull: { "workoutPlan.saturday" : workoutID }});
      }else{
        return "Incorrect date."
      }

      if (mongoObj.modifiedCount == 1){
        return "Workout "+ workoutID +" was removed.";
      }else{
        return "Error in deleting " + workoutID;
      }
    }catch(err){
      throw err
    } 
  }
}

module.exports.User = User;