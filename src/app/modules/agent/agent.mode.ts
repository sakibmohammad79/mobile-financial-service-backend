import mongoose, { Schema } from 'mongoose';
import { IAgent } from './agent.interface';

// Agent Schema
const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    pin: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    nid: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ['agent'], default: 'agent' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    totalIncome: { type: Number, default: 0 },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  { timestamps: true },
);

// Create Agent Model
export const AgentModel = mongoose.model<IAgent>('Agent', AgentSchema);
