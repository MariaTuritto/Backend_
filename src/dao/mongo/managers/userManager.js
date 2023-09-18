import userModel from "../models/users.js";

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
}