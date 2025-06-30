import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    id: string;
    type: 'text' | 'mcq' | 'textarea' | 'email';
    title: string;
    required: boolean;
    options?: string[];
    order: number;
}

export interface IReviewForm extends Document {
    userId: string;
    serviceId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    questions: IQuestion[];
    shareableLink: string;
    createdAt: Date;
    isActive: boolean;
    responsesCount: number;
}

const QuestionSchema = new Schema<IQuestion>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [String],
    order: Number,
});

const ReviewFormSchema = new Schema<IReviewForm>({
    userId: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    title: { type: String, required: true },
    description: String,
    questions: [QuestionSchema],
    shareableLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    responsesCount: { type: Number, default: 0 },
});

export default mongoose.models.ReviewForm || mongoose.model<IReviewForm>('ReviewForm', ReviewFormSchema);