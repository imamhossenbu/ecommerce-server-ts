import { Request, Response } from 'express';
import { UploadService } from './upload.service';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const imageUrl = UploadService.processSingleFile(req.file);

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "No file selected!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      url: imageUrl,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error, please try again.",
      error: error.message,
    });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    const imageUrls = UploadService.processMultipleFiles(req.files as Express.Multer.File[]);

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files selected!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully!",
      urls: imageUrls,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Upload failed!",
      error: error.message,
    });
  }
};