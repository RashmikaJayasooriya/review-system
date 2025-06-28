import ResponsesList from './ResponsesList';
import { getReviews } from './actions';

export default async function ResponsesWrapper() {
    const reviews = await getReviews();
    const data = reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
    }));
    return <ResponsesList initialReviews={data} />;
}