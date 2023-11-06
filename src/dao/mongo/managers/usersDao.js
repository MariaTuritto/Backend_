 import userModel from "../models/user.model.js";

export default class userDao {

    getUser = (params) => {
        return userModel.find(params);
    }

    getUserBy = (uid) => {
        return userModel.findOne(uid).lean();

    }

    createUser = (user)=>{
        return userModel.create(user)
    }

    updateUser = (uid, user) =>{
        return userModel.updateOne({_id: uid}, {$set: user});
    }

    deleteUser = (uid) => {
        return userModel.deleteOne({_id:uid})
    }
}