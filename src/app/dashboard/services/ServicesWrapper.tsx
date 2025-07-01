
import ServicesList from './ServicesList';
import {getServices} from "@/app/dashboard/services/actions";

type ServiceDTO = {
    userId: string;
    id: string;
    name: string;
    description: string;
    googleReviewLink?: string;
    createdAt: string;
    responsesCount: number;
    formsCount: number;
};

export default async function ServicesListWrapper() {
    const raw = await getServices();

    const services: ServiceDTO[] = raw.map((s) => ({
        userId: s.userId,
        id: s.id,
        name: s.name,
        description: s.description ?? "",
        googleReviewLink: s.googleReviewLink,
        createdAt: s.createdAt.toISOString(),
        responsesCount: s.responsesCount,
        formsCount: s.formsCount,
    }));

    return <ServicesList initialServices={services} />;
}
