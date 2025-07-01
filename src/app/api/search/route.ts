import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ServiceModel from '@/models/Service';
import ReviewFormModel from '@/models/ReviewForm';
import { auth } from '@/auth';
import mongoose from "mongoose";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || !q) {
        return NextResponse.json([]);
    }

    await connectToDatabase();
    const regex = new RegExp(q, 'i');
    const [services, forms] = await Promise.all([
        ServiceModel.find({ userId, name: regex })
            .limit(5)
            .select('name')
            .lean<{ _id: mongoose.Types.ObjectId; name: string }[]>(),
        ReviewFormModel.find({ userId, title: regex })
            .limit(5)
            .select('title')
            .lean<{ _id: mongoose.Types.ObjectId; title: string }[]>(),
    ]);

    const suggestions = [
        ...services.map((s) => ({
            type: 'service',
            label: s.name,
            path: `/dashboard/services#${s._id.toString()}`,
        })),
        ...forms.map((f) => ({
            type: 'form',
            label: f.title,
            path: `/dashboard/forms#${f._id.toString()}`,
        })),
    ];

    return NextResponse.json(suggestions);
}