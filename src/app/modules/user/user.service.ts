import { User } from './user.model';
import { IUser } from './user.interface';

const getAllUsersFromDB = async (page: number, perPage: number, searchKey: string) => {
  let filter: any = {};
  if (searchKey) {
    filter.$or = [
      { name: { $regex: searchKey, $options: "i" } },
      { email: { $regex: searchKey, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return {
    users,
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
  };
};

const updateProfileInDB = async (id: string, updateData: Partial<IUser>) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  ).select("-password");
};

const findUserById = async (id: string) => {
  return await User.findById(id);
};

const deleteUserFromDB = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const UserService = {
  getAllUsersFromDB,
  updateProfileInDB,
  findUserById,
  deleteUserFromDB
};