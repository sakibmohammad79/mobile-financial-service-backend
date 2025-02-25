import mongoose, { Schema } from 'mongoose';
import { Transaction } from '../../interface';

const TransactionSchema = new Schema<Transaction>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: 'senderType',
      required: true,
    },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Change ref to 'User'
    senderType: { type: String, enum: ['admin', 'user'], required: false }, // Make senderType optional
    amount: { type: Number, required: true, min: 50 },
    type: {
      type: String,
      enum: ['sendmoney', 'cashin', 'cashout', 'recharge'],
      required: true,
    },
    fee: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const TransactionModel = mongoose.model<Transaction>(
  'Transaction',
  TransactionSchema,
);
