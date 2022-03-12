var emailValidator = require("email-validator");

var errorMessage;
module.exports.validUserInfo = (username, email, password) =>{
  errorMessage = "";
  if (validUsername(username) & validEmail(email) & validPassword(password)){
    return { valid: true }
  }else{
    return { valid: false,
      errorMessage: errorMessage
   }
  }
}

validUsername = (username) => {
  if (username == ""){
    errorMessage += "Please enter an username <br/>";
    return false;
  }
  return true;
}

validEmail = (email) => {
  if (email == ""){
    errorMessage += "Please enter an email address <br/>";
    return false;
  }
  if (!emailValidator.validate(email)){
    errorMessage += "Invalid email address <br/>";
    return false;
  }
  return true;
}

validPassword = (password) => {
  if (password == ""){
    errorMessage += "Please enter a password \n";
    return false;
  }
  return true;
}