"use server";
import connectToDatabase from "@/lib/db";
import ServiceModel from "@/models/Service";
import ReviewFormModel from "@/models/ReviewForm";
import ReviewModel from "@/models/Review";

export interface DashboardService {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    formsCount: number;
    responsesCount: number;
    responseRate: number;
}

export interface RecentResponse {
    id: string;
    name: string;
    comment: string;
    submittedAt: Date;
}

export interface DashboardData {
    totalForms: number;
    totalResponses: number;
    topServices: DashboardService[];
    recentResponses: RecentResponse[];
}

export async function getDashboardData(): Promise<DashboardData> {
    await connectToDatabase();

    const [totalForms, totalResponses] = await Promise.all([
        ReviewFormModel.countDocuments(),
        ReviewModel.countDocuments(),
    ]);

    const services = await ServiceModel.find().lean<{
        _id: typeof ServiceModel.schema.types.ObjectId;
        name: string;
        description?: string;
        createdAt: Date;
    }[]>();

    const serviceData: DashboardService[] = [];
    for (const s of services) {
        const forms = await ReviewFormModel.find({ serviceId: s._id }, '_id').lean<{ _id: string }[]>();
        const formIds = forms.map(f => f._id);
        const [formsCount, responsesCount] = await Promise.all([
            ReviewFormModel.countDocuments({ serviceId: s._id }),
            formIds.length > 0 ? ReviewModel.countDocuments({ formId: { $in: formIds } }) : Promise.resolve(0),
        ]);
        serviceData.push({
            id: s._id.toString(),
            name: s.name,
            description: s.description,
            createdAt: s.createdAt,
            formsCount,
            responsesCount,
            responseRate: formsCount > 0 ? Math.round((responsesCount / formsCount) * 100) : 0,
        });
    }

    serviceData.sort((a, b) => b.responsesCount - a.responsesCount);

    const recentReviewsRaw = await ReviewModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean<{ _id: typeof ReviewModel.schema.types.ObjectId; name: string; review: string; createdAt: Date }[]>();

    const recentResponses: RecentResponse[] = recentReviewsRaw.map(r => ({
        id: r._id.toString(),
        name: r.name,
        comment: r.review,
        submittedAt: r.createdAt,
    }));

    return {
        totalForms,
        totalResponses,
        topServices: serviceData.slice(0, 3),
        recentResponses,
    };
}