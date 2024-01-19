import mongoose, {Document} from 'mongoose'

const enum productType  {
  fashion = "fashion",
  electronics = "electronics"
}

export interface IProduct extends Document {
  name: string,
  description: string,
  price: string,
  baseQuantity: string,
  quantity?: string,
  coverImage: string,
  otherImages?: string[],
  type: string,
  createdAt?: NativeDate,
  updatedAt?: NativeDate
}