import { Request, Response } from 'express';
import { CategoryService } from './category.service';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a category image" });
    }

    const result = await CategoryService.createCategoryInDB({
      name,
      image: req.file.path,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategoriesFromDB(req.query);

    res.status(200).json({
      success: true,
      count: result.categories.length,
      totalCategories: result.totalCategories,
      totalPages: Math.ceil(result.totalCategories / result.limit),
      currentPage: result.page,
      data: result.categories,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const isExist = await CategoryService.getCategoryById(id as string);
    if (!isExist) {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }

    const updateData: any = { name };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const result = await CategoryService.updateCategoryInDB(id as string, updateData);

    res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const isExist = await CategoryService.getCategoryById(id as string);
    if (!isExist) {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }

    await CategoryService.deleteCategoryFromDB(id as string);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};