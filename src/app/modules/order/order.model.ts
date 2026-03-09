import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    customerInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    items: [{
      productID: { type: Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String 
    }],
    totalAmount: Number,
    shippingFee: Number,
    transactionId: String, 
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled'], 
      default: 'Pending' 
    },
    orderStatus: { 
      type: String, 
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
      default: 'Processing' 
    }
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);