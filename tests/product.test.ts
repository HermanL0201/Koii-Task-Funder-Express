import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Product } from '../src/models/product';
import productRouter from '../src/routes/product';
import express from 'express';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());
app.use('/products', productRouter);

describe('Product Details API', () => {
  let mongoServer: MongoMemoryServer;
  let productId: string;

  beforeAll(async () => {
    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create and connect to MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a test product
    const testProduct = new Product({
      name: 'Test Lipstick',
      description: 'A beautiful red lipstick',
      price: 25.99,
      brand: 'Test Brand',
      category: 'Makeup',
      inStock: true
    });

    const savedProduct = await testProduct.save();
    productId = savedProduct._id.toString();
  });

  afterAll(async () => {
    // Remove test product and close connection
    await Product.findByIdAndDelete(productId);
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should retrieve product details successfully', async () => {
    const response = await request(app).get(`/products/${productId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Lipstick');
    expect(response.body).toHaveProperty('price', 25.99);
  });

  it('should return 404 for non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/products/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Product not found');
  });

  it('should return 400 for invalid product ID', async () => {
    const response = await request(app).get('/products/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid product ID format');
  });
});