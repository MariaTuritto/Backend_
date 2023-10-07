 import userModel from "../models/user.model.js";

export default class UserManager {

    getUser = () => {
        return userModel.find().lean();
    }

    getUserBy = (params) => {
        return userModel.findOne(params).lean()

    }

    createUser = (user)=>{
        return userModel.create(user)
    }

    updateUser = (id, user) =>{
        return userModel.updateOne({_id: id}, user);
    }

    deleteUser = (id) => {
        return userModel.deleteOne({_id:id})
    }
}