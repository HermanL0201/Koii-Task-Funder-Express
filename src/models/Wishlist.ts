import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  addedAt: Date;
}

const WishlistItemSchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique constraint for user and product combination
WishlistItemSchema.index({ user: 1, product: 1 }, { unique: true });

export const WishlistItem = mongoose.model<IWishlistItem>('WishlistItem', WishlistItemSchema);