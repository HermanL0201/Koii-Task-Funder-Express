import express, { Request, Response } from 'express';
import { Product } from '../models/product';
import mongoose from 'mongoose';

const router = express.Router();

// GET product by ID
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        message: 'Invalid product ID format' 
      });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    // Handle product not found
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }

    // Return product details
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// POST create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, price, brand, category, inStock, imageUrl } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !brand || !category) {
      return res.status(400).json({
        message: 'Missing required product fields'
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      brand,
      category,
      inStock: inStock !== undefined ? inStock : true,
      imageUrl
    });

    // Save product to database
    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;