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
  },
  // expireAt: {
  //   type: Date,
  //   default: Date.now,
  //   index: { expires: '5s' } 
  // }
}, {timestamps: true})

// cartSchema.index({createdAt: 1}, {expireAfterSeconds: 60}) // Clear document after 10 seconds


const Cart = mongoose.model('cart', cartSchema)

export default Cart