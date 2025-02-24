import mongoose, { Schema } from 'mongoose';
import { IAdmin } from './admin.interface';

// Admin Schema
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    pin: { type: String, required: true }, // Hashed PIN
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    nid: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    totalSystemBalance: { type: Number, required: true, default: 0 },
    totalIncome: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

// Create Admin Model
export const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);
