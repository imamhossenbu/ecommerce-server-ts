import { Request, Response } from 'express';
import { ProductService } from './product.service';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { thumbnail, images, regularPrice, salePrice, stock, isFeatured, isBestseller, isNew, lowdown, ...rest } = req.body;

    if (!thumbnail) return res.status(400).json({ success: false, message: "Main thumbnail image is required!" });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "At least one gallery image is required!" });
    }

    const productData = {
      ...rest,
      regularPrice: Number(regularPrice),
      salePrice: Number(salePrice),
      thumbnail,
      images,
      stock: Number(stock) || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isBestseller: isBestseller === 'true' || isBestseller === true,
      isNew: isNew === 'true' || isNew === true,
      lowdown: Array.isArray(lowdown) ? lowdown : [lowdown]
    };

    const product = await ProductService.createProductInDB(productData);
    res.status(201).json({ success: true, message: "Product created successfully!", data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getProductDetailsFromDB(req.params.id as string);
    if (!result) return res.status(404).json({ success: false, message: "Product not found!" });

    res.status(200).json({
      success: true,
      data: { ...result.product.toObject(), totalReviews: result.totalReviews, avgRating: result.avgRating }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { products, totalProducts, page, limit } = await ProductService.getAllProductsFromDB(req.query);
    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.deleteProductFromDB(req.params.id as string);
    if (!result) return res.status(404).json({ success: false, message: "Product not found!" });
    res.status(200).json({ success: true, message: "Product deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestsellers = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getBestsellersFromDB();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getNewArrivalsFromDB();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    let updateData = { ...req.body };
    const files = req.files as any;
    if (files) {
      if (files.thumbnail) updateData.thumbnail = files.thumbnail[0].path;
      if (files.images) updateData.images = files.images.map((file: any) => file.path);
    }

    const updatedProduct = await ProductService.updateProductInDB(req.params.id as string, updateData);
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};