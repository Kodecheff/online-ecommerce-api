import mongoose, {Model} from 'mongoose';

const { Schema } = mongoose

const cartSchema = new Schema({
  productId: {
    type: String,
    required:  true
  },
  userId: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {timestamps: true})

const Cart = mongoose.model('cart', cartSchema)

export default Cart