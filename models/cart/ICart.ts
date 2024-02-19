import {Document} from 'mongoose';

export interface ICart extends Document {
  productId: string,
  price: number,
  quantity: string,
  userId: string,
  createdAt?: NativeDate,
  updatedAt?: NativeDate
}