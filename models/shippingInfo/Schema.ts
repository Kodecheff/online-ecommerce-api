import mongoose from "mongoose";

const { Schema } = mongoose

const shippingSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  subAddress: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  // default: {
  //   type: Boolean,
  //   required: true
  // },
}, {timestamps: true})

const Shipping = mongoose.model('shippingInfo', shippingSchema)

export default Shipping