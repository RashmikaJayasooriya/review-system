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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 lg:py-12">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                            {form.title}
                        </h1>
                        {form.description && (
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                {form.description}
                            </p>
                        )}
                    </div>
                    <ReviewFormViewer form={form}/>
                </div>
            </div>
        </div>
    )
}