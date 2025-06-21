"use client";

export default function ServicesSkeleton() {
    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
                <div
                    key={idx}
                    className="rounded-lg border border-gray-200 shadow-sm p-4 animate-pulse bg-white"
                >
                    <div className="h-40 bg-blue-200 rounded mb-4" />
                    <div className="h-4 bg-blue-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-blue-200 rounded w-1/2 mb-4" />
                    <div className="flex space-x-2">
                        <div className="h-8 w-20 bg-blue-200 rounded" />
                        <div className="h-8 w-20 bg-blue-200 rounded" />
                    </div>
                </div>
            ))}
        </div>

    );
}