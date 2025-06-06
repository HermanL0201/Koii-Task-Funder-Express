import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  ingredients?: string[];
  imageUrls?: string[];
  averageRating?: number;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  imageUrls: [String],
  averageRating: { type: Number, default: 0 }
});

// Create text index for more efficient text search
ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);