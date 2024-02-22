import mongoose, {Model} from 'mongoose';

const { Schema } = mongoose

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {timestamps: true})

const Cart = mongoose.model('cart', cartSchema)

export default Cart