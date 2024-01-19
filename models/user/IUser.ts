import mongoose, {Document} from "mongoose";

export interface IUser extends Document {
  firstName: string,
  lastName: string,
  avatar: string,
  email: string,
  password: string,
  isAdmin: boolean,
  createdAt?: NativeDate,
  updatedAt?: NativeDate
}