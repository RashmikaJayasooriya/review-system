
import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    formId: mongoose.Types.ObjectId;
    review: string;
    /** Full name of the customer submitting the review */
    name: string;
    /** Email address of the customer submitting the review */
    email: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    formId: { type: Schema.Types.ObjectId, ref: 'ReviewForm', required: true },
    review: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
