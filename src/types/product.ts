/**
 * Represents the core product interface
 * Defines the structure and required fields for a product
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  inStock?: boolean;
  imageUrl?: string;
}

/**
 * Represents a product creation request
 * Allows for optional fields during product creation
 */
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  inStock?: boolean;
  imageUrl?: string;
}

/**
 * Represents a product update request
 * Allows partial updates to product fields
 */
export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
  imageUrl?: string;
}

/**
 * Validation function for product creation
 * @param product Product to validate
 * @returns Boolean indicating if the product is valid
 */
export function validateProduct(product: ProductCreateRequest): boolean {
  // Check required fields
  if (!product.name || !product.description || 
      product.price === undefined || !product.category) {
    return false;
  }

  // Price validation
  if (product.price < 0) {
    return false;
  }

  // Optional URL validation if imageUrl is provided
  if (product.imageUrl && 
      !/^https?:\/\/.+/.test(product.imageUrl)) {
    return false;
  }

  return true;
}