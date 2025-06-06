import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  imageUrl?: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  imageUrl: { type: String }
}, {
  timestamps: true
});

export const Product = mongoose.model<ProductDocument>('Product', ProductSchema);