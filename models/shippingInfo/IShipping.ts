import {Document} from 'mongoose';

export interface IShipping extends Document {
  firstName: string,
  lastName: string,
  phoneNumber: string,
  address: string,
  subAddress: string,
  state: string,
  city: string,
  userId: string,
  default?: boolean,
  createdAt?: NativeDate,
  updatedAt?: NativeDate
}