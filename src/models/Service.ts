import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
