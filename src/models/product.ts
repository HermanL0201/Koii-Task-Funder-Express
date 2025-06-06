import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price cannot be negative'] 
  },
  brand: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v: string) {
        return v === undefined || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL'
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Add a virtual property for price formatting
ProductSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

export const Product = mongoose.model<ProductDocument>('Product', ProductSchema);