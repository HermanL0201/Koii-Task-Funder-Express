import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Product } from '../src/models/Product';
import { searchProducts } from '../src/controllers/productController';

let mongoServer: MongoMemoryServer;

// Mock Express request and response
const mockRequest = (query: any) => ({
  query
});

const mockResponse = () => {
  const res: any = {
    statusCode: 200,
    body: null
  };
  res.status = (status: number) => {
    res.statusCode = status;
    return res;
  };
  res.json = (data: any) => {
    res.body = data;
    return res;
  };
  return res;
};

describe('Product Search', () => {
  beforeAll(async () => {
    // Create an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Seed test data
    await Product.deleteMany({});
    await Product.create([
      {
        name: 'Glowing Skin Serum',
        brand: 'Beauty Brand',
        category: 'Skincare',
        price: 45.99,
        description: 'A hydrating serum for glowing skin'
      },
      {
        name: 'Matte Lipstick',
        brand: 'Makeup Co',
        category: 'Makeup',
        price: 25.50,
        description: 'Long-lasting matte lipstick'
      },
      {
        name: 'Daily Moisturizer',
        brand: 'Beauty Brand',
        category: 'Skincare',
        price: 35.00,
        description: 'Lightweight daily moisturizer'
      }
    ]);
  }, 10000); // Increase timeout

  afterAll(async () => {
    // Disconnect from the in-memory database
    await mongoose.disconnect();
    await mongoServer.stop();
  }, 10000); // Increase timeout

  it('should return paginated products with default parameters', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await searchProducts(req as any, res as any);

    expect(res.body).toBeDefined();
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(3);
    expect(res.body.totalProducts).toBe(3);
    expect(res.body.currentPage).toBe(1);
  });

  it('should filter products by brand', async () => {
    const req = mockRequest({ brand: 'Beauty Brand' });
    const res = mockResponse();

    await searchProducts(req as any, res as any);

    expect(res.body).toBeDefined();
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(2);
    expect(res.body.products.every((p: any) => p.brand === 'Beauty Brand')).toBe(true);
  });

  it('should filter products by category', async () => {
    const req = mockRequest({ category: 'Skincare' });
    const res = mockResponse();

    await searchProducts(req as any, res as any);

    expect(res.body).toBeDefined();
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(2);
    expect(res.body.products.every((p: any) => p.category === 'Skincare')).toBe(true);
  });

  it('should filter products by price range', async () => {
    const req = mockRequest({ minPrice: 30, maxPrice: 50 });
    const res = mockResponse();

    await searchProducts(req as any, res as any);

    expect(res.body).toBeDefined();
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(2);
    expect(res.body.products.every((p: any) => p.price >= 30 && p.price <= 50)).toBe(true);
  });

  it('should search products by text', async () => {
    const req = mockRequest({ search: 'moisturizer' });
    const res = mockResponse();

    await searchProducts(req as any, res as any);

    expect(res.body).toBeDefined();
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].name).toBe('Daily Moisturizer');
  });
});