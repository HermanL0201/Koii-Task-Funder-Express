import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  brand: string;
  price: number;
  description: string;
  imageUrl: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

export const Product = mongoose.model<ProductDocument>('Product', ProductSchema);