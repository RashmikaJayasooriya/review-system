import {Suspense} from "react";
import ServicesWrapper from "@/app/dashboard/services/ServicesWrapper";
import ServicesSkeleton from "@/components/services/ServicesSkeleton";

export default function Page() {
    return (
        <Suspense fallback={<ServicesSkeleton />}>
            <ServicesWrapper />
        </Suspense>
    );
}