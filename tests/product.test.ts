import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import ProductModel from '../src/models/Product';
import { ProductCategory } from '../src/types/product';

describe('Product Model', () => {
  const validProductData = {
    name: 'Glow Moisturizer',
    brand: 'Sephora Collection',
    category: ProductCategory.SKINCARE,
    description: 'Hydrating daily moisturizer',
    price: { original: 35.00, current: 29.99, discountPercentage: 14 },
    ingredients: ['Hyaluronic Acid', 'Vitamin E'],
    imageUrls: ['https://example.com/image1.jpg'],
    inStock: true
  };

  it('should create a new product successfully', async () => {
    const product = new ProductModel(validProductData);
    const savedProduct = await product.save();

    expect(savedProduct.name).toBe(validProductData.name);
    expect(savedProduct.brand).toBe(validProductData.brand);
    expect(savedProduct.category).toBe(validProductData.category);
  });

  it('should validate required fields', async () => {
    const productWithMissingFields = new ProductModel({});

    await expect(productWithMissingFields.validate()).rejects.toThrow();
  });

  it('should handle reviews and calculate average rating', async () => {
    const productWithReviews = new ProductModel({
      ...validProductData,
      reviews: [
        { userId: 'user1', rating: 4, comment: 'Great product' },
        { userId: 'user2', rating: 5, comment: 'Love it!' }
      ]
    });

    const savedProduct = await productWithReviews.save();

    expect(savedProduct.reviews).toHaveLength(2);
    expect(savedProduct.averageRating).toBe(4.5);
  });

  it('should prevent invalid category', async () => {
    const invalidProduct = new ProductModel({
      ...validProductData,
      category: 'INVALID_CATEGORY'
    });

    await expect(invalidProduct.validate()).rejects.toThrow();
  });
});