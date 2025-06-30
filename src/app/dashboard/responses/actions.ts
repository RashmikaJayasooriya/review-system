"use server";
import connectToDatabase from '@/lib/db';
import ReviewModel from '@/models/Review';
import ReviewFormModel from '@/models/ReviewForm';
import ServiceModel from '@/models/Service';
import { ReviewWithForm } from '@/types';
import mongoose from 'mongoose';
import { auth } from '@/auth';

export async function getReviews(): Promise<ReviewWithForm[]> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    // find forms created by the user
    const forms = await ReviewFormModel.find({ userId }).lean<{ _id: mongoose.Types.ObjectId }[]>();

    await connectToDatabase();
    const reviews = await ReviewModel.find({ formId: { $in: forms.map(f => f._id) } })
        .sort({ createdAt: -1 })
        .populate({
            path: 'formId',
            model: ReviewFormModel,
            select: 'title serviceId',
            populate: { path: 'serviceId', model: ServiceModel, select: 'name' },
        })
        .lean<{
            _id: mongoose.Types.ObjectId;
            formId: {
                _id: mongoose.Types.ObjectId;
                title: string;
                serviceId: { _id: mongoose.Types.ObjectId; name: string };
            };
            review: string;
            name: string;
            email: string;
            createdAt: Date;
        }[]>();

    return reviews.map((r) => ({
        id: r._id.toString(),
        formId: r.formId._id.toString(),
        formTitle: r.formId.title,
        serviceName: r.formId.serviceId.name,
        review: r.review,
        name: r.name,
        email: r.email,
        createdAt: r.createdAt,
    }));
}