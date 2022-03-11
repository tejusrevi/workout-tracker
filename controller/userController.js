const User = require('../model/user.js').User
var passwordHash = require('password-hash');


module.exports.addLocal = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  var hashedPassword = passwordHash.generate(password);

  //TODO Validator
  let isValid = true;
  if (isValid){
      let new_user = new User(true, username, email, hashedPassword);
      let userInserted = await new_user.save();
      if (userInserted){
        msg = 'User ' + username + ' was correctly inserted to the database.'
      }
      else{
        msg = 'Email address already exists. Try logging in.'
      }           
  } else {
      msg = 'Error. User not inserted in the database.';
  }

  res.send(msg);     
};

module.exports.addNonLocal = async (username, email) => {
  if (User.emailDoesNotExists(email)){
    let new_user = new User(false, username, email);
    let msg = await new_user.save();
  }
};

module.exports.validateUser = async (email, password) => {
  if (passwordHash.verify(password, await User.getPasswordFor(email))) return true;
  return false;
}

module.exports.getUserDetails = async (email) => {
  return await User.getUserDetails(email)
}