import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    pin: {
      type: String,
      required: [true, 'PIN is required'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    nid: {
      type: String,
      required: [true, 'NID is required'],
      unique: true,
    },
    balance: {
      type: Number,
      default: 40, // Users get 40 Taka as a bonus
      min: [0, 'Balance cannot be negative'],
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
      required: [true, 'User role is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  { timestamps: true },
);

// Create Model
export const UserModel = mongoose.model<IUser>('User', UserSchema);
