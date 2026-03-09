export interface IUser {
  name: string;
  email: string;
  password?: string; 
  status: 'active' | 'inactive';
  role: 'user' | 'admin';
  profileImage?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}