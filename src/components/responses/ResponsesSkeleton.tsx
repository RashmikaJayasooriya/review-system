"use client";
export default function ResponsesSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
            ))}
        </div>
    );
}