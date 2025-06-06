import mongoose from 'mongoose';
import { Product, ProductCategory } from '../types/product';

const ProductSchema = new mongoose.Schema<Product>({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  brand: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    enum: Object.values(ProductCategory), 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: {
    original: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    current: { 
      type: Number, 
      min: 0 
    },
    discountPercentage: { 
      type: Number, 
      min: 0, 
      max: 100 
    }
  },
  ingredients: [{ 
    type: String 
  }],
  sizes: [{ 
    type: String 
  }],
  colors: [{ 
    type: String 
  }],
  imageUrls: [{ 
    type: String, 
    required: true 
  }],
  inStock: { 
    type: Boolean, 
    default: true 
  },
  volume: { 
    type: String 
  },
  reviews: [{
    userId: { 
      type: String, 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  averageRating: { 
    type: Number, 
    min: 1, 
    max: 5 
  }
}, {
  timestamps: true,
  versionKey: false
});

// Optional: Middleware to calculate average rating before saving
ProductSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    this.averageRating = Number((
      this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length
    ).toFixed(1));
  }
  next();
});

export default mongoose.model<Product>('Product', ProductSchema);