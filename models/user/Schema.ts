import mongoose, { Model, Document } from "mongoose";
import { IUser } from "./IUser";

const { Schema } = mongoose;

let userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

let User = mongoose.model('user', userSchema)

export default User;
