var emailValidator = require("email-validator");

var errorMessage;

/**
 * Validator for User Object
 * @param {*} username
 * @param {*} email
 * @param {*} password
 * @returns
 */
module.exports.validUserInfo = (username, email, password) => {
  errorMessage = "";
  if (validUsername(username) & validEmail(email) & validPassword(password)) {
    return { valid: true };
  } else {
    return { valid: false, errorMessage: errorMessage };
  }
};

validUsername = (username) => {
  if (username == "") {
    errorMessage += "Please enter an username <br/>";
    return false;
  }
  return true;
};

validEmail = (email) => {
  if (email == "") {
    errorMessage += "Please enter an email address <br/>";
    return false;
  }
  if (!emailValidator.validate(email)) {
    errorMessage += "Invalid email address <br/>";
    return false;
  }
  return true;
};

validPassword = (password) => {
  if (password == "") {
    errorMessage += "Please enter a password <br/>";
    return false;
  }
  return true;
};

/**
 * Validator for personalInfo object within User
 * @param {*} age
 * @param {*} gender
 * @param {*} height
 * @param {*} weight
 * @param {*} goalWeight
 * @returns
 */
module.exports.validPersonalInfo = (
  age,
  gender,
  height,
  weight,
  goalWeight
) => {
  errorMessage = "";
  if (
    validAge(age) &
    validGender(gender) &
    validHeight(height) &
    validWeight(weight) &
    validGoalWeight(goalWeight)
  ) {
    return { valid: true };
  } else {
    return { valid: false, errorMessage: errorMessage };
  }
};

validAge = (age) => {
  if (age != null) {
    if (isNaN(age)) {
      errorMessage += "Age must be a valid number <br/>";
      return false;
    }
    return true;
  }
  return true;
};

validGender = (gender) => {
  if (gender != null) {
    if (gender != "male" && gender != "female" && gender != "other") {
      errorMessage += "Illegal value for gender <br/>";
      return false;
    }
    return true;
  }
  return true;
};

validHeight = (height) => {
  if (height != null) {
    if (isNaN(height)) {
      errorMessage += "Height must be a valid number <br/>";
      return false;
    }
    return true;
  }
  return true;
};

validWeight = (weight) => {
  if (weight != null) {
    if (isNaN(weight)) {
      errorMessage += "Weight must be a valid number <br/>";
      return false;
    }
    return true;
  }
  return true;
};

validGoalWeight = (goalWeight) => {
  if (goalWeight != null) {
    if (isNaN(goalWeight)) {
      errorMessage += "Goal Weight must be a valid number <br/>";
      return false;
    }
    return true;
  }
  return true;
};
