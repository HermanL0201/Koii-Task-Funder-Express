import express from 'express';
import { searchProducts } from '../controllers/productController';

const router = express.Router();

// GET /api/products search endpoint
router.get('/', searchProducts);

export default router;