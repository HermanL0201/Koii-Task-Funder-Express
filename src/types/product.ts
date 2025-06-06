import { Document } from 'mongoose';

export enum ProductCategory {
  SKINCARE = 'skincare',
  MAKEUP = 'makeup',
  HAIRCARE = 'haircare',
  FRAGRANCE = 'fragrance',
  BODYCARE = 'bodycare',
  TOOLS_AND_BRUSHES = 'tools_and_brushes'
}

export interface ProductPrice {
  original: number;
  current?: number;
  discountPercentage?: number;
}

export interface ProductReview {
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface Product extends Document {
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: ProductPrice;
  ingredients?: string[];
  sizes?: string[];
  colors?: string[];
  imageUrls: string[];
  inStock: boolean;
  volume?: string;
  reviews?: ProductReview[];
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}