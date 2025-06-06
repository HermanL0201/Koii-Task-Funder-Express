import mongoose, { Document, Schema } from 'mongoose';

export interface IProductReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const productReviewSchema = new Schema<IProductReview>({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const ProductReview = mongoose.model<IProductReview>('ProductReview', productReviewSchema);

/**
 * Calculate the aggregate rating for a specific product
 * @param productId - The ID of the product to calculate rating for
 * @returns An object containing average rating and total review count
 */
export async function calculateAggregateRating(productId: mongoose.Types.ObjectId): Promise<{
  averageRating: number;
  totalReviews: number;
}> {
  // Validate input
  if (!productId) {
    throw new Error('Product ID is required');
  }

  // Aggregate rating calculation using MongoDB aggregation pipeline
  const aggregateResult = await ProductReview.aggregate([
    // Match reviews for the specific product
    { $match: { productId } },
    
    // Group by product and calculate statistics
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  // Handle cases with no reviews
  if (aggregateResult.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0
    };
  }

  // Extract and round the average rating to 2 decimal places
  const { averageRating, totalReviews } = aggregateResult[0];
  return {
    averageRating: Number(averageRating.toFixed(2)),
    totalReviews
  };
}