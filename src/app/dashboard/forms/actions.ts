"use server";
import connectToDatabase from '@/lib/db';
import ReviewFormModel from '@/models/ReviewForm';
import { revalidatePath } from 'next/cache';
import {Question, ReviewForm} from '@/types';
import mongoose from 'mongoose';
import { auth } from '@/auth';

export async function getForms(): Promise<ReviewForm[]> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    await connectToDatabase();
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const forms = await ReviewFormModel.find({ userId })
        .sort({ createdAt: -1 })
        .lean<{
            _id: mongoose.Types.ObjectId;
            userId: string;
            serviceId: mongoose.Types.ObjectId;
            title: string;
            description?: string;
            questions: ({ _id?: mongoose.Types.ObjectId } & Question)[];
            shareableLink: string;
            createdAt: Date;
            isActive: boolean;
            responsesCount: number;
        }[]>();


    return forms.map((f) => ({
        userId: f.userId,
        id: f._id.toString(),
        serviceId: f.serviceId.toString(),
        title: f.title,
        description: f.description ?? '',
        questions: f.questions.map((q) => {
            const { _id, ...rest } = q as { _id?: mongoose.Types.ObjectId } & Question;
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

    let questions: unknown[] = [];
    if (typeof questionsData === 'string' && questionsData.trim().length > 0) {
        try {
            questions = JSON.parse(questionsData);
        } catch (err) {
            console.error('Failed to parse questions', err);
            return { error: 'Invalid questions data' };
        }
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: 'Unauthorized' };

    await connectToDatabase();
    await ReviewFormModel.create({
        userId,
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

interface UpdateFormState {
    success?: boolean;
    error?: string;
}

export async function updateForm(
    _prevState: UpdateFormState,
    formData: FormData
): Promise<UpdateFormState> {
    const formId = formData.get('formId');
    const title = formData.get('title');
    const description = formData.get('description');
    const questionsData = formData.get('questions');

    if (!formId || typeof formId !== 'string') {
        return { error: 'Invalid form id' };
    }
    if (!title || typeof title !== 'string') {
        return { error: 'Title is required' };
    }

    let questions: unknown[] = [];
    if (typeof questionsData === 'string' && questionsData.trim().length > 0) {
        try {
            questions = JSON.parse(questionsData);
        } catch (err) {
            console.error('Failed to parse questions', err);
            return { error: 'Invalid questions data' };
        }
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: 'Unauthorized' };

    await connectToDatabase();
    await ReviewFormModel.findOneAndUpdate({ _id: formId, userId }, {
        title,
        description,
        questions,
    });
    revalidatePath('/dashboard/forms');
    return { success: true };
}

export async function toggleFormStatus(formId: string, isActive: boolean) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: 'Unauthorized' };

    await connectToDatabase();
    await ReviewFormModel.findOneAndUpdate({ _id: formId, userId }, { isActive });
    revalidatePath('/dashboard/forms');
    return { success: true };
}

export async function deleteForm(formId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: 'Unauthorized' };

    await connectToDatabase();
    await ReviewFormModel.findOneAndDelete({ _id: formId, userId });
    revalidatePath('/dashboard/forms');
    return { success: true };
}

export async function getFormByLink(link: string): Promise<ReviewForm | null> {
    await connectToDatabase();
    const f = await ReviewFormModel.findOne({ shareableLink: link })
        .lean<{
            _id: mongoose.Types.ObjectId;
            serviceId: mongoose.Types.ObjectId;
            title: string;
            description?: string;
            questions: Question[];
            shareableLink: string;
            createdAt: Date;
            isActive: boolean;
            responsesCount: number;
        } | null>();
    if (!f) return null;
    return {
        id: f._id.toString(),
        serviceId: f.serviceId.toString(),
        title: f.title,
        description: f.description ?? '',
        questions: f.questions.map((q) => {
            const { _id, ...rest } = q as unknown as { _id?: string } & Question;
            return { ...rest, id: rest.id ?? String(_id) };
        }),
        shareableLink: f.shareableLink,
        createdAt: f.createdAt,
        isActive: f.isActive,
        responsesCount: f.responsesCount,
    };
}