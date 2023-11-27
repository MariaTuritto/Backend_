import userModel from "../models/user.model.js";

export default class userDao {
  getUser = (params) => {
    return userModel.find(params).lean();
  };

  getUserBy = (uid) => {
    return userModel.findOne(uid).lean();
  };

  createUser = (user) => {
    const result = userModel.create(user);
    return result.toObject();
  };

  updateUser = (uid, user) => {
    return userModel.updateOne({ _id: uid }, { $set: user });
  };

  deleteUser = (uid) => {
    return userModel.deleteOne({ _id: uid }, { $set: { activate: false } });
  };
}
