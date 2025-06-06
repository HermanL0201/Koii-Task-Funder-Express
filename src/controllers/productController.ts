import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';

interface SearchQuery {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { 
      search = '', 
      brand, 
      category, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10 
    } = req.query as unknown as SearchQuery;

    // Build query object
    const query: any = {};

    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * pageSize;

    // If using text search, add text score for sorting
    const searchOptions: any = search ? { score: { $meta: 'textScore' } } : {};

    // Execute query
    const totalProducts = await Product.countDocuments(query);
    const products = await Product
      .find(query, searchOptions)
      .select(searchOptions ? { score: { $meta: 'textScore' }, ...searchOptions } : {})
      .sort(search ? { score: { $meta: 'textScore' } } : {})
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ 
      message: 'Error searching products', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};