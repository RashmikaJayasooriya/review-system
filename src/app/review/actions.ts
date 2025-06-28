"use server";

import connectToDatabase from '@/lib/db';
import ReviewModel from '@/models/Review';

interface SaveReviewState {
    success?: boolean;
    error?: string;
}

export async function saveReview(
    _prevState: SaveReviewState,
    formData: FormData
): Promise<SaveReviewState> {
    const formId = formData.get('formId');
    const review = formData.get('review');
    const name = formData.get('name');
    const email = formData.get('email');

    console.log('Saving review with data:', {
        formId,
        review,
        name,
        email
    });

    if (
        !formId || typeof formId !== 'string' ||
        !review || typeof review !== 'string' || review.trim().length === 0 ||
        !name || typeof name !== 'string' || name.trim().length === 0 ||
        !email || typeof email !== 'string' || email.trim().length === 0
    ) {
        return { error: 'Invalid data' };
    }

    await connectToDatabase();
    console.log('Saving review to database------:', {
        formId,
        review,
        name,
        email
    });
    await ReviewModel.create({ formId, review, name, email });

    return { success: true };
}