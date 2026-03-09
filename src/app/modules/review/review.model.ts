import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    productID: { type: Schema.Types.ObjectId, ref: "Product" },
    userID: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Review = model<IReview>('Review', reviewSchema);