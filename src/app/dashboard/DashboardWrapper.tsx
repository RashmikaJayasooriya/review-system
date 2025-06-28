import DashboardClient from './DashboardClient';
import { getDashboardData } from './actions';

export default async function DashboardWrapper() {
    const data = await getDashboardData();
    const dto = {
        ...data,
        topServices: data.topServices.map(s => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
        })),
        recentResponses: data.recentResponses.map(r => ({
            ...r,
            submittedAt: r.submittedAt.toISOString(),
        })),
    };

    return <DashboardClient data={dto} />;
}