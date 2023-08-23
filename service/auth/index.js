const UserModel = require("../../models/Users");

exports.getAllBlogs = async () => {
  return await UserModel.find();
};

exports.createUsers = async (user) => {
  return await UserModel.create(user);
};

exports.getUserbyName = async (name) => {
  return await UserModel.findOne(name);
};