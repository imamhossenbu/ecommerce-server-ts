import { Types } from 'mongoose';

export interface IOrderItem {
  productID: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  transactionId: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

