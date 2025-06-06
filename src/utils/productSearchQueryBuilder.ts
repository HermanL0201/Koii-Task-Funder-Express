import { FilterQuery } from 'mongoose';

/**
 * Interface for Product Search Parameters
 */
export interface ProductSearchParams {
  name?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Build a flexible MongoDB query for product search
 * @param params Search parameters
 * @returns MongoDB filter query
 */
export function buildProductSearchQuery(params: ProductSearchParams): FilterQuery<any> {
  const query: FilterQuery<any> = {};

  // Name search with case-insensitive partial match
  if (params.name) {
    query.name = { $regex: params.name, $options: 'i' };
  }

  // Exact match for brand
  if (params.brand) {
    query.brand = params.brand;
  }

  // Exact match for category
  if (params.category) {
    query.category = params.category;
  }

  // Price range filtering
  if (params.minPrice !== undefined && params.maxPrice !== undefined) {
    query.price = { 
      $gte: params.minPrice, 
      $lte: params.maxPrice 
    };
  } else if (params.minPrice !== undefined) {
    query.price = { $gte: params.minPrice };
  } else if (params.maxPrice !== undefined) {
    query.price = { $lte: params.maxPrice };
  }

  // In stock filtering
  if (params.inStock !== undefined) {
    query.inStock = params.inStock;
  }

  return query;
}