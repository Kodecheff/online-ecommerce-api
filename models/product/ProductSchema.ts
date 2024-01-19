import mongoose, { Model } from "mongoose";
import { IProduct } from "./IProduct";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  baseQuantity: {
    type: String,
    required: true
  },
  quantity: {
    type: String
  },
  coverImage: {
    type: String,
    required: true
  },
  otherImages: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {timestamps: true})

let Product = mongoose.model('product', ProductSchema)

export default Product