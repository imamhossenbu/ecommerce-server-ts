import { Request, Response } from 'express';
import { ReviewService } from './review.service';

export const addReview = async (req: Request, res: Response) => {
  try {
    const { productID, userID, rating, comment } = req.body;

    const result = await ReviewService.addReviewInDB({
      productID,
      userID,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await ReviewService.getProductReviewsFromDB(productId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHomeReviews = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getHomeReviewsFromDB();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};