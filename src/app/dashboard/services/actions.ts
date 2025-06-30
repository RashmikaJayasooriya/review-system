"use server";
import connectToDatabase from '@/lib/db';
import ServiceModel from '@/models/Service';
import { revalidatePath } from 'next/cache';
import { Service } from '@/types';
import mongoose from "mongoose";
import { auth } from '@/auth';


export async function getServices(): Promise<Service[]> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    await connectToDatabase();
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const services = await ServiceModel.find({ userId })
        .sort({ createdAt: -1 })
        .lean<{
        _id: mongoose.Types.ObjectId;
            userId: string;
        name: string;
        description?: string;
        createdAt: Date;
    }[]>();
    return services.map((s) => ({
        userId: s.userId,
        id: s._id.toString(),
        name: s.name,
        description: s.description ?? '',
        createdAt: s.createdAt,
        formsCount: 0,
        responsesCount: 0,
    }));
}

interface CreateServiceState {
    success?: boolean;
    error?: string;
}

export async function createService(
    _prevState: CreateServiceState,
    formData: FormData
): Promise<CreateServiceState> {
    const name = formData.get('name');
    const description = formData.get('description');
    if (!name || typeof name !== 'string') {
        return { error: 'Name is required' };
    }
    const session = await auth();
    console.log("session:", session);
    const userId = session?.user?.id;
    if (!userId) return { error: 'Unauthorized' };

    await connectToDatabase();
    await ServiceModel.create({ name, description, userId });
    revalidatePath('/dashboard/services');
    return { success: true };
}