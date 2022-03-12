var emailValidator = require("email-validator");

module.exports.validUserInfo = (username, email, password) =>{
  let msg;
  if (username == "" || email == "" || password == ""){
    if (username == ""){
      msg = "Please enter an username";
    }else if (email == "") {
      msg = "Please enter an email address";
    }else if (password == "") {
      msg = "Please enter a password";
    }
  }else if (!validator.validate(email)){
    msg = "Please enter a valid email address";
  }

}

module.exports.validUsername = (username) => {
  if (username == ""){
    return "Please enter an username";
  }
}
