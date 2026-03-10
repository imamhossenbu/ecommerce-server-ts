import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

const createUserInDB = async (userData: Partial<IUser>) => {
  return await User.create(userData);
};

const findUserByResetToken = async (hashedToken: string) => {
  return await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, 
  });
};


const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const AuthService = {
  findUserByEmail,
  createUserInDB,
  findUserByResetToken,
  findUserById
};