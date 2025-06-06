import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/product';
import { 
  ProductNotFoundError, 
  ProductValidationError, 
  ProductDatabaseError 
} from '../types/errors';
import { 
  ProductCreateRequest, 
  validateProduct 
} from '../types/product';

const router = express.Router();

// Error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => 
    Promise.resolve(fn(req, res, next)).catch(next);

// GET product by ID
router.get('/:productId', asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ProductValidationError('Invalid product ID format');
  }

  // Find product by ID
  const product = await Product.findById(productId);

  // Handle product not found
  if (!product) {
    throw new ProductNotFoundError(`Product with ID ${productId} not found`);
  }

  res.status(200).json(product);
}));

// POST create new product
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const productData: ProductCreateRequest = req.body;

  // Validate product data
  if (!validateProduct(productData)) {
    throw new ProductValidationError('Invalid product data provided');
  }

  try {
    // Create and save new product
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    // Handle database-related errors
    throw new ProductDatabaseError('Failed to create product');
  }
}));

// Global error handler middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ProductNotFoundError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  if (err instanceof ProductValidationError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Default to 500 for unhandled errors
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred'
  });
});

export default router;