const client = require("../utils/db.js");
const ObjectId = require("mongodb").ObjectId;
var passwordHash = require("password-hash");

async function _get_users_collection() {
  let db = await client.getDb();
  return await db.collection("user");
}

class User {
  constructor(isLocal, username, email, password) {
    // Core user information. Any updates made to this information will logout the user
    this.isLocal = isLocal;
    this.username = username;
    this.email = email;
    this.password = password;

    // Secondary information. Any updates made to this information will not logout the user
    this.personalInfo = {
      age: null,
      gender: null,
      height: null,
      weight: null,
      goalWeight: null,
    };
  }

  async save() {
    if (await User.emailDoesNotExists(this.email)) {
      try {
        let collection = await _get_users_collection();
        let mongoObj = await collection.insertOne(this);
        return true;
      } catch (err) {
        throw err;
      }
    } else {
      return false;
    }
  }

  static async getUserByID(userID) {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.findOne({ _id: ObjectId(userID) });
      delete mongoObj._id;
      delete mongoObj.password;
      delete mongoObj.isLocal;
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async deleteUser(userID) {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.deleteOne({ _id: ObjectId(userID) });
      if (mongoObj.deletedCount == 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(userID, newUsername, newPassword) {
    let mongoObj;
    try {
      let collection = await _get_users_collection();
      if (newUsername != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              username: newUsername,
            },
          }
        );
      }
      if (newPassword != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              password: newPassword,
            },
          }
        );
      }
      if (mongoObj.modifiedCount >= 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  static async updatePersonalInfo(
    userID,
    age,
    gender,
    height,
    weight,
    goalWeight
  ) {
    let mongoObj;
    let modified = false;
    try {
      let collection = await _get_users_collection();
      if (age != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              "personalInfo.age": parseInt(age),
            },
          }
        );
        if (mongoObj.modifiedCount == 1) {
          modified = true;
        }
      }
      if (gender != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              "personalInfo.gender": gender,
            },
          }
        );
        if (mongoObj.modifiedCount == 1) {
          modified = true;
        }
      }
      if (height != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              "personalInfo.height": parseFloat(height),
            },
          }
        );
        if (mongoObj.modifiedCount == 1) {
          modified = true;
        }
      }
      if (weight != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              "personalInfo.weight": parseFloat(weight),
            },
          }
        );
        if (mongoObj.modifiedCount == 1) {
          modified = true;
        }
      }
      if (goalWeight != undefined) {
        mongoObj = await collection.updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              "personalInfo.goalWeight": parseFloat(goalWeight),
            },
          }
        );
        if (mongoObj.modifiedCount == 1) {
          modified = true;
        }
      }

      if (modified) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  static async emailDoesNotExists(email) {
    try {
      let collection = await _get_users_collection();
      let count = await collection.count({ email: email });
      if (count > 0) {
        return false;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  static async getPasswordFor(email) {
    if (!await User.emailDoesNotExists(email)) {
      try {
        let collection = await _get_users_collection();
        let mongoObj = await collection.findOne({ email: email });
        if (mongoObj) return mongoObj.password;
      } catch (err) {
        throw err;
      }
    }
  }

  static async getUserDetails(email) {
    try {
      let collection = await _get_users_collection();
      let mongoObj = await collection.findOne({ email: email });
      return mongoObj;
    } catch (err) {
      throw err;
    }
  }

  static async addNonLocal(username, email) {
    if (User.emailDoesNotExists(email)) {
      let new_user = new User(false, username, email);
      let msg = await new_user.save();
    }
  }

  static async authenticateUser(email, password) {
    if (passwordHash.verify(password, await User.getPasswordFor(email)))
      return true;
    return false;
  }

}

module.exports.User = User;
