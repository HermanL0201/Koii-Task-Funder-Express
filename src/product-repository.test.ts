import { describe, it, expect, beforeEach } from 'vitest';
import { ProductRepository } from './product-repository';
import { Product } from './types/product';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  const sampleProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    price: 19.99,
    category: 'Test Category',
    brand: 'Test Brand',
    inStock: true
  };

  beforeEach(() => {
    repository = new ProductRepository();
  });

  it('should add a product', () => {
    const addedProduct = repository.addProduct(sampleProduct);
    expect(addedProduct).toEqual(sampleProduct);
  });

  it('should throw error when adding product without ID', () => {
    const invalidProduct = { ...sampleProduct, id: '' };
    expect(() => repository.addProduct(invalidProduct)).toThrowError('Product must have an ID');
  });

  it('should throw error when adding duplicate product', () => {
    repository.addProduct(sampleProduct);
    expect(() => repository.addProduct(sampleProduct)).toThrowError(`Product with ID ${sampleProduct.id} already exists`);
  });

  it('should get product by ID', () => {
    repository.addProduct(sampleProduct);
    const retrievedProduct = repository.getProductById('1');
    expect(retrievedProduct).toEqual(sampleProduct);
  });

  it('should return undefined for non-existent product', () => {
    const retrievedProduct = repository.getProductById('999');
    expect(retrievedProduct).toBeUndefined();
  });

  it('should throw error when getting product with empty ID', () => {
    expect(() => repository.getProductById('')).toThrowError('Product ID is required');
  });

  it('should get all products', () => {
    repository.addProduct(sampleProduct);
    const allProducts = repository.getAllProducts();
    expect(allProducts).toHaveLength(1);
    expect(allProducts[0]).toEqual(sampleProduct);
  });

  it('should update a product', () => {
    repository.addProduct(sampleProduct);
    const updatedProduct = repository.updateProduct('1', { name: 'Updated Product' });
    expect(updatedProduct.name).toBe('Updated Product');
  });

  it('should throw error when updating non-existent product', () => {
    expect(() => repository.updateProduct('999', {})).toThrowError('Product with ID 999 not found');
  });

  it('should delete a product', () => {
    repository.addProduct(sampleProduct);
    const deletedProduct = repository.deleteProduct('1');
    expect(deletedProduct).toEqual(sampleProduct);
    expect(repository.getAllProducts()).toHaveLength(0);
  });

  it('should throw error when deleting non-existent product', () => {
    expect(() => repository.deleteProduct('999')).toThrowError('Product with ID 999 not found');
  });

  it('should search products by name', () => {
    repository.addProduct(sampleProduct);
    const searchResults = repository.searchProducts('test');
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0]).toEqual(sampleProduct);
  });

  it('should return all products when search query is empty', () => {
    repository.addProduct(sampleProduct);
    const searchResults = repository.searchProducts('');
    expect(searchResults).toHaveLength(1);
  });
});