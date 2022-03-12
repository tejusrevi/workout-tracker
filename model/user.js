const client = require('../utils/db.js');
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
    this.workoutPlan ={"Monday" : [],
                        "Tuesday" : [],
                        "Wednesday" : [],
                        "Thursday" : [],
                        "Friday" : [],
                        "Saturday" : [],
                        "Sunday" : []
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

  static async validateUser(email, password){
    if (passwordHash.verify(password, await User.getPasswordFor(email))) return true;
    return false;
  }
}

module.exports.User = User;