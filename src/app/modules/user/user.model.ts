import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImage: { type: String, default: "" },
  resetPasswordToken: String,
  resetPasswordExpires: {type: Number},
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);