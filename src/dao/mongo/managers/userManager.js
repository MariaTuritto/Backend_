 import userModel from "../models/user.model.js";

export default class UserManager {

    getUser = (params) => {
        return userModel.find(params);
    }

    getUserBy = (params) => {
        return userModel.findOne(params).lean();

    }

    createUser = (user)=>{
        return userModel.create(user)
    }

    updateUser = (id, user) =>{
        return userModel.updateOne({_id: id}, {$set: user});
    }

    deleteUser = (id) => {
        return userModel.deleteOne({_id:id})
    }
}