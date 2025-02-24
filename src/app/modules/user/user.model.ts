import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';

// User Schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    pin: { type: String, required: true }, // Hashed PIN
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    nid: { type: String, required: true, unique: true },
    balance: { type: Number, default: 40 }, // Users get 40 Taka as a bonus
    role: { type: String, enum: ['user'], default: 'user' },
    isActive: { type: Boolean, default: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction', // Referencing Transaction collection
      },
    ],
  },
  { timestamps: true },
);

// Create Model
export const UserModel = mongoose.model<IUser>('User', UserSchema);
