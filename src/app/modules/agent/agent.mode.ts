import mongoose, { Schema } from 'mongoose';
import { IAgent, IRechargeRequest } from './agent.interface';

// Agent Schema
const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    pin: {
      type: String,
      required: [true, 'PIN is required'],
    },
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

const RechargeRequestSchema = new Schema<IRechargeRequest>(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1, // Ensure positive amount
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
  },
);

const RechargeRequestModel = mongoose.model<IRechargeRequest>(
  'RechargeRequest',
  RechargeRequestSchema,
);

export default RechargeRequestModel;
