import mongoose, { Schema, Document, Types } from 'mongoose';
import { ProductDocument } from './Product';

export interface WishlistDocument extends Document {
  user: Types.ObjectId;
  products: Types.DocumentArray<ProductDocument>;
}

const WishlistSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
});

export const Wishlist = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);