var passwordHash = require('password-hash');
const User = require('../model/user.js').User;
const validator = require('../utils/validate-fields.js');

module.exports.addLocal = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  var hashedPassword = passwordHash.generate(password);

  let isFormValid = validator.validUserInfo(username, email, password);
  console.log(isFormValid)
  if (isFormValid.valid){
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
