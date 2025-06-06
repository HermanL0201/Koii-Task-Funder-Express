import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the Review interface for TypeScript type checking
export interface IReview extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Review Schema
const ReviewSchema: Schema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for a review'],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required for a review'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  reviewText: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review text cannot exceed 1000 characters'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Compound index to prevent duplicate reviews by same user for same product
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Validate review text is not empty when provided
ReviewSchema.path('reviewText').validate(function(value) {
  if (this.rating && value && value.trim().length === 0) {
    throw new Error('Review text cannot be empty');
  }
  return true;
});

// Create and export the Review model
export const Review = mongoose.model<IReview>('Review', ReviewSchema);