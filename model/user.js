const client = require('../utils/db.js');

async function _get_users_collection (){
    let db = await client.getDb();
    return await db.collection('user');
};

/**
 * The class contact, with a main constructor and two methods
 * to add more fields retrieved with the third-party APIs
 */

class User {
  constructor(username, email, password){
    this.username = username;
    this.email = email;
    this.password = password;
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

  async save(){
     if (await User.emailDoesNotExists(this.email)){
      try{
        let collection = await _get_users_collection();
        let mongoObj = await collection.insertOne(this);
        console.log('1 User was inserted in the database with id -> '+mongoObj.insertedId);
        return 'User correctly inserted in the Database.';            
      }catch(err){
        throw err
      } 
     }else{
       return 'User with email address exists'
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
}

module.exports.User = User;