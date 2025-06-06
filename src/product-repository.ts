import { Product } from './types/product';

export class ProductRepository {
  private products: Product[] = [];

  /**
   * Add a product to the repository
   * @param product Product to be added
   * @returns The added product
   */
  addProduct(product: Product): Product {
    if (!product.id) {
      throw new Error('Product must have an ID');
    }
    
    const existingProductIndex = this.products.findIndex(p => p.id === product.id);
    
    if (existingProductIndex !== -1) {
      throw new Error(`Product with ID ${product.id} already exists`);
    }

    this.products.push(product);
    return product;
  }

  /**
   * Get a product by its ID
   * @param id Product ID
   * @returns Product or undefined if not found
   */
  getProductById(id: string): Product | undefined {
    if (!id) {
      throw new Error('Product ID is required');
    }

    return this.products.find(product => product.id === id);
  }

  /**
   * Get all products
   * @returns Array of products
   */
  getAllProducts(): Product[] {
    return [...this.products];
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param updatedProduct Updated product details
   * @returns Updated product
   */
  updateProduct(id: string, updatedProduct: Partial<Product>): Product {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    this.products[index] = { ...this.products[index], ...updatedProduct };
    return this.products[index];
  }

  /**
   * Delete a product by its ID
   * @param id Product ID
   * @returns Deleted product
   */
  deleteProduct(id: string): Product {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const deletedProduct = this.products.splice(index, 1)[0];
    return deletedProduct;
  }

  /**
   * Search products by name or partial name
   * @param query Search query
   * @returns Matching products
   */
  searchProducts(query: string): Product[] {
    if (!query) {
      return this.getAllProducts();
    }

    return this.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}