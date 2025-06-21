
import ServicesList from './ServicesList';
import {getServices} from "@/app/dashboard/services/actions";

type ServiceDTO = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    responsesCount: number;
    formsCount: number;
};

export default async function ServicesListWrapper() {
    const raw = await getServices();

    const services: ServiceDTO[] = raw.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? "",
        createdAt: s.createdAt.toISOString(),
        responsesCount: s.responsesCount,
        formsCount: s.formsCount,
    }));

    return <ServicesList initialServices={services} />;
}
