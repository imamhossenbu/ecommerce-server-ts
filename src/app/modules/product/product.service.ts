import { Product } from './product.model';
import { Review } from '../review/review.model';
import { IProduct } from './product.interface';

const createProductInDB = async (productData: Partial<IProduct>) => {
  return await Product.create(productData);
};

const getProductDetailsFromDB = async (id: string) => {
  const product = await Product.findById(id).populate("categoryID", "name");
  if (!product) return null;

  const reviews = await Review.find({ productID: id });
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  return {
    product,
    totalReviews,
    avgRating: Number(avgRating)
  };
};

const getAllProductsFromDB = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const keyword = query.search ? { name: { $regex: query.search, $options: "i" } } : {};
  const category = query.category ? { categoryID: query.category } : {};

  let sortBy: any = { createdAt: -1 };
  if (query.sort) {
    if (query.sort === 'price') sortBy = { salePrice: 1 };
    else if (query.sort === '-price') sortBy = { salePrice: -1 };
    else if (query.sort === 'name') sortBy = { name: 1 };
    else if (query.sort === '-name') sortBy = { name: -1 };
  }

  const filter = { ...keyword, ...category };
  const totalProducts = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("categoryID", "name")
    .limit(limit)
    .skip(skip)
    .sort(sortBy);

  return { products, totalProducts, page, limit };
};

const deleteProductFromDB = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

const getBestsellersFromDB = async () => {
  return await Product.find({ isBestseller: true })
    .populate("categoryID", "name")
    .limit(4)
    .sort({ createdAt: -1 });
};

const getNewArrivalsFromDB = async () => {
  return await Product.find()
    .populate("categoryID", "name")
    .sort({ createdAt: -1 })
    .limit(4);
};

const updateProductInDB = async (id: string, updateData: any) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const ProductService = {
  createProductInDB,
  getProductDetailsFromDB,
  getAllProductsFromDB,
  deleteProductFromDB,
  getBestsellersFromDB,
  getNewArrivalsFromDB,
  updateProductInDB
};