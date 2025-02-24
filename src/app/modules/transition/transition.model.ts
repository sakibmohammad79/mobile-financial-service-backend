import mongoose, { Schema } from 'mongoose';
import { Transaction } from '../../interface';

const TransactionSchema = new Schema<Transaction>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 50 },
    type: {
      type: String,
      enum: ['sendmoney', 'cashin', 'cashout'],
      required: true,
    },
    fee: { type: Number, default: 5 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const TransactionModel = mongoose.model<Transaction>(
  'Transaction',
  TransactionSchema,
);
