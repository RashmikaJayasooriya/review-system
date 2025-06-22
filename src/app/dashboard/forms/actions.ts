"use server";
import connectToDatabase from '@/lib/db';
import ReviewFormModel from '@/models/ReviewForm';
import { revalidatePath } from 'next/cache';
import { ReviewForm } from '@/types';
import mongoose from 'mongoose';

export async function getForms(): Promise<ReviewForm[]> {
    await connectToDatabase();
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const forms = await ReviewFormModel.find()
        .sort({ createdAt: -1 })
        .lean<{
            _id: mongoose.Types.ObjectId;
            serviceId: mongoose.Types.ObjectId;
            title: string;
            description?: string;
            questions: any[];
            shareableLink: string;
            createdAt: Date;
            isActive: boolean;
            responsesCount: number;
        }[]>();


    return forms.map((f) => ({
        id: f._id.toString(),
        serviceId: f.serviceId.toString(),
        title: f.title,
        description: f.description ?? '',
        questions: f.questions.map(q => {
            const { _id, ...rest } = q;
            return { ...rest, id: rest.id ?? String(_id) };
        }),
        shareableLink: f.shareableLink,
        createdAt: f.createdAt,
        isActive: f.isActive,
        responsesCount: f.responsesCount,
    }));
}

interface CreateFormState {
    success?: boolean;
    error?: string;
}

export async function createForm(
    _prevState: CreateFormState,
    formData: FormData
): Promise<CreateFormState> {
    console.log('Creating form with data:', Object.fromEntries(formData.entries()));
    const title = formData.get('title');
    const description = formData.get('description');
    const serviceId = formData.get('serviceId');
    const questionsData = formData.get('questions');

    if (!title || typeof title !== 'string' || !serviceId || typeof serviceId !== 'string') {
        console.error('Invalid form data:', { title, description, serviceId });
        return { error: 'Invalid data' };
    }

    let questions: any[] = [];
    if (typeof questionsData === 'string' && questionsData.trim().length > 0) {
        try {
            questions = JSON.parse(questionsData);
        } catch (err) {
            console.error('Failed to parse questions', err);
            return { error: 'Invalid questions data' };
        }
    }

    await connectToDatabase();
    await ReviewFormModel.create({
        title,
        description,
        serviceId,
        // questions: [],
        questions,
        shareableLink: `https://forms.company.com/${Date.now()}`,
        isActive: true,
    });
    revalidatePath('/dashboard/forms');
    console.log('Form created successfully');
    return { success: true };
}