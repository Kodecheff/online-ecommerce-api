import {Document} from 'mongoose';

export interface ICart extends Document {
  userId: string,
  items: object[],
  totalPrice: number,
  createdAt?: NativeDate,
  updatedAt?: NativeDate
}