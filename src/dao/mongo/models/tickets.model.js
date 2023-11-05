import mongoose from "mongoose";    

const collection = "tickets";

const cartSubSchema = new mongoose.Schema({
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts",
    },
});

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
       
    },
    
    purchase_datetime : {
        type: Date,
        unique: true,
        required: true,
        default: Date.now()
    },
    purchaser: {
        type: String,
        required: true,
      },
    amount: {
        type: Number,
        required: true,
    },
    carts: {
        type:[cartSubSchema],
    }
    }, {timestamps: true});

schema.pre(["find", "findOne"], function() {
    this.populate("carts.cart")
}); 

const ticketModel = mongoose.model(collection,schema);

export default ticketModel;