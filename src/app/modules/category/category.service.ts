import { Category } from './category.model';
import { Product } from '../product/product.model';
import { ICategory } from './category.interface';

const createCategoryInDB = async (payload: ICategory) => {
  return await Category.create(payload);
};

const getAllCategoriesFromDB = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const keyword = query.search
    ? { name: { $regex: query.search, $options: "i" } }
    : {};

  const totalCategories = await Category.countDocuments({ ...keyword });
  const categories = await Category.find({ ...keyword })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  return {
    categories,
    totalCategories,
    page,
    limit,
  };
};

const updateCategoryInDB = async (id: string, updateData: Partial<ICategory>) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteCategoryFromDB = async (id: string) => {
  const productCount = await Product.countDocuments({ categoryID: id });
  
  if (productCount > 0) {
    throw new Error("Cannot delete category with active products");
  }

  return await Category.findByIdAndDelete(id);
};

const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getCategoryById,
};