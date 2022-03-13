let passwordHash = require("password-hash");
const User = require("../model/user.js").User;
const validator = require("../utils/validate-fields.js");

module.exports.getUserByID = async (req, res) => {
  let userID = req.user.user._id;
  res.send(await User.getUserByID(userID));
}

module.exports.addLocal = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  let isFormValid = validator.validUserInfo(username, email, password);
  if (isFormValid.valid) {
    let hashedPassword = passwordHash.generate(password);
    let new_user = new User(true, username, email, hashedPassword);
    let userInserted = await new_user.save();
    if (userInserted) {
      msg = "User " + username + " was correctly inserted to the database.";
    } else {
      msg = "Email address already exists. Try logging in.";
    }
  } else {
    msg = isFormValid.errorMessage;
  }
  res.send(msg);
};

module.exports.deleteUser = async (req, res) => {
  let userID = req.user.user._id;
  let msg = await User.deleteUser(userID);
  req.logout();
  res.send(msg);
};

module.exports.updateUser = async (req, res) => {
  let userID = req.user.user._id;
  let newUsername = req.body.username;
  let newPassword = req.body.password;

  let msg;
  let hashedNewPassword;

  let isUserValid = validator.validUserInfo(
    newUsername,
    req.user.user.email,
    newPassword
  );

  if (isUserValid.valid) {
    if (newPassword != null) {
      if (req.user.user.isLocal) {
        hashedNewPassword = passwordHash.generate(newPassword);
      } else {
        res.send(
          "Your account uses Google login. You cannot change your password here."
        );
      }
    }
    msg = await User.updateUser(userID, newUsername, hashedNewPassword);
    req.logout();
    res.send(msg);
  } else {
    res.send(isUserValid.errorMessage);
  }
};

module.exports.updatePersonalInformation = async (req, res) => {
  let userID = req.user.user._id;
  let age = req.body.age;
  let gender = req.body.gender;
  let height = req.body.height;
  let weight = req.body.weight;
  let goalWeight = req.body.goalWeight;
  let isPersonalInfoValid = validator.validPersonalInfo(
    age,
    gender,
    height,
    weight,
    goalWeight
  );

  if (isPersonalInfoValid.valid) {
    res.send(
      await User.updatePersonalInfo(
        userID,
        age,
        gender,
        height,
        weight,
        goalWeight
      )
    );
  } else {
    res.send(isUserValid.errorMessage);
  }
};


