var passwordHash = require('password-hash');
const User = require('../model/user.js').User;
const validator = require('../utils/validate-fields.js');

module.exports.addLocal = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  console.log("register")
  console.log(req.body)

  let isFormValid = validator.validUserInfo(username, email, password);
  if (isFormValid.valid){
      var hashedPassword = passwordHash.generate(password);
      let new_user = new User(true, username, email, hashedPassword);
      let userInserted = await new_user.save();
      if (userInserted){
        msg = 'User ' + username + ' was correctly inserted to the database.'
      }
      else{
        msg = 'Email address already exists. Try logging in.'
      }           
  } else {
      msg = isFormValid.errorMessage;
  }
  res.send(msg);     
};

module.exports.addWorkoutPlan = async (req, res) => {
  let userID = req.user.user._id;
  let day = req.body.day;
  let workoutID = req.body.workoutID;

  res.send(await User.addWorkoutPlan(userID, day, workoutID));

};

module.exports.deleteWorkoutPlan = async (req, res) => {
  let userID = req.user.user._id;
  let day = req.params.day;
  let workoutID = req.params.workoutID;

  res.send(await User.deleteWorkoutPlan(userID, day, workoutID));

};
