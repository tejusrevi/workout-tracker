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
  errorMessage = [];
  if (validUsername(username) & validEmail(email) & validPassword(password)) {
    return { valid: true };
  } else {
    return { valid: false, errorMessage: errorMessage };
  }
};

validUsername = (username) => {
  if (username == "" || username == undefined) {
    errorMessage.push("Please enter an username");
    return false;
  }
  return true;
};

validEmail = (email) => {
  if (email == "" || email == undefined) {
    errorMessage.push("Please enter an email address");
    return false;
  }
  if (!emailValidator.validate(email)) {
    errorMessage.push("Invalid email address");
    return false;
  }
  return true;
};

validPassword = (password) => {
  if (password == "" || password == undefined) {
    errorMessage.push("Please enter a password");
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
  errorMessage = [];
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
  if (isNaN(age)) {
    errorMessage.push("Age must be a valid number");
    return false;
  }
  return true;

};

validGender = (gender) => {
  if (gender != "male" && gender != "female" && gender != "other") {
    errorMessage.push("Illegal value for gender");
    return false;
  }
  return true;

};

validHeight = (height) => {
  if (isNaN(height)) {
    errorMessage.push("Height must be a valid number");
    return false;
  }
  return true;
};

validWeight = (weight) => {
  if (isNaN(weight)) {
    errorMessage.push("Weight must be a valid number");
    return false;
  }
  return true;
};

validGoalWeight = (goalWeight) => {
  if (isNaN(goalWeight)) {
    errorMessage.push("Goal Weight must be a valid number");
    return false;
  }
  return true;
};
