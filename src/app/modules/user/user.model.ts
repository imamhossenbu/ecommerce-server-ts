import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: { type: String, enum: ["user", "admin"], default: "user" },

  profileImage: { type: String, default: "" },

  phone: { type: String, default: "" },

  address: { type: String, default: "" },

  city: { type: String, default: "" },

  state: { type: String, default: "" },

  zipCode: { type: String, default: "" },

  country: { type: String, default: "Bangladesh" },

  status: { type: String, enum: ["active", "inactive"], default: "active" },

  resetPasswordToken: String,

  resetPasswordExpires: { type: Number }

}, { timestamps: true });

export const User = model<IUser>("User", userSchema);
