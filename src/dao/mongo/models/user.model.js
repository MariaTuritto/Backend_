import mongoose from "mongoose";

const collection = 'Users';

const schema = new mongoose.Schema({
        firstName:String,
        lastName:String,
        email:String,
        password:String,
        role:
        {
            type:String,
            enum:['user', 'admin'],
            default: 'user'
        },
        cart: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Carts'
        }


})

const userModel = mongoose.model(collection,schema);
export default userModel;