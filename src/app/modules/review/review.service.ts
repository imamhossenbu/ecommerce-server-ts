import { Review } from './review.model';
import { Product } from '../product/product.model';
import { IReview } from './review.interface';

const addReviewInDB = async (payload: Partial<IReview>) => {
  const newReview = await Review.create(payload);

  const allReviews = await Review.find({ productID: payload.productID });
  const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
  const avgRating = Number((totalRating / allReviews.length).toFixed(1));

  await Product.findByIdAndUpdate(payload.productID, {
    avgRating: avgRating,
    totalReviews: allReviews.length
  });

  return newReview;
};

const getProductReviewsFromDB = async (productId: string) => {
  return await Review.find({ productID: productId })
    .populate('userID', 'name profileImage')
    .sort({ createdAt: -1 });
};

const getHomeReviewsFromDB = async () => {
  return await Review.find()
    .populate({
      path: 'userID',
      select: 'name profileImage',
      model: 'User'
    })
    .populate('productID', 'name')
    .sort({ createdAt: -1 })
    .limit(4);
};

export const ReviewService = {
  addReviewInDB,
  getProductReviewsFromDB,
  getHomeReviewsFromDB
};