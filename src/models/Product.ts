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
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  imageUrls: [String],
  averageRating: { type: Number, default: 0 }
});

// Create text index for more efficient text search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text', 
  category: 'text' 
}, {
  weights: {
    name: 5,
    description: 3,
    brand: 2,
    category: 1
  }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);