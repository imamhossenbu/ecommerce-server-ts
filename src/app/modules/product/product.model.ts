import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Full description is required"] 
    },
    straight_up: { 
      type: String, 
      default: "" 
    },
    lowdown: { 
      type: [String], 
      default: [] 
    },
    regularPrice: { 
      type: Number, 
      required: [true, "Regular price is required"] 
    },
    salePrice: { 
      type: Number, 
      required: [true, "Sale price is required"],
      validate: {
        validator: function (this:any,value: number) {
          return value <= this.regularPrice ;
        },
        message: "Sale price cannot be higher than regular price",
      },
    },
    thumbnail: { 
      type: String, 
      required: [true, "Main thumbnail image is required"] 
    },
    images: { 
      type: [String], 
      required: [true, "At least one gallery image is required"] 
    },
    categoryID: { 
      type: Schema.Types.ObjectId, 
      ref: "Category", 
      required: [true, "Product category is required"] 
    },
    stock: { 
      type: Number, 
      default: 0, 
      min: [0, "Stock cannot be negative"] 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    isBestseller: { 
      type: Boolean, 
      default: false 
    },
    isNew: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);