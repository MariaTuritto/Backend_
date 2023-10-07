import mongoose from "mongoose";

const collection = 'Carts';

const productSubSchema = new mongoose.Schema({

  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Products'
  },
  quantity: {
    type: Number,
    default: 1, 
  },
},{_id:false});

const schema = new mongoose.Schema({
    products:  [productSubSchema],
    default: []
  }, { timestamps: true });

// schema.pre(['find','findOne'],function(){
//   this.populate('products.product');
// })

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;