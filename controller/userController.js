const User = require('../model/user.js').User

module.exports.add = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  //let isValid = await v.validate_fields(name, email, tel, address);
  let isValid = true;
  if (isValid){
      let new_user = new User(username, email, password);
      let msg = await new_user.save();
      res.send(msg);                
  } else {
      console.log('The Contact was not inserted in the database since it is not valid.');
      res.send('Error. User not inserted in the database.');
  }
};

module.exports.validateUser = async (email, password) => {
  if (await User.getPasswordFor(email) == password) return true;
  return false;
}

module.exports.getUserDetails = async (email) => {
  return await User.getUserDetails(email)
}