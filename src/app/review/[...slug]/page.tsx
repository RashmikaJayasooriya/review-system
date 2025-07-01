import {notFound} from 'next/navigation';
import {getFormByLink} from '@/app/dashboard/forms/actions';
import ReviewFormViewer from '@/components/customer/ReviewFormViewer';

interface Params {
    slug: string[] | string;
}

export default async function ReviewFormPage({ params }: { params: Params }) {
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const link = `http://localhost:3000/${slug}`;
    const form = await getFormByLink(link);
    if (!form || !form.isActive) {
        notFound();
    }
    return (
        <div className="w-full mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
            {form.description && <p className="text-gray-600 mb-6">{form.description}</p>}
            <div className="">
                <ReviewFormViewer form={form}/>
            </div>
        </div>
    )
}