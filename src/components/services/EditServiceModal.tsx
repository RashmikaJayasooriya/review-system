import React, { startTransition, useActionState, useEffect } from 'react';
import { Service } from '@/types';
import ServiceForm from './ServiceForm';
import { updateService } from '@/app/dashboard/services/actions';

interface Props {
    open: boolean;
    service: Service | null;
    onClose: () => void;
}

interface State {
    success?: boolean;
    error?: string;
}

export default function EditServiceModal({ open, service, onClose }: Props) {
    const [state, formAction, isPending] = useActionState<State, FormData>(updateService, { success: false });

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state, onClose]);

    const handleSubmit = (values: Partial<Service>) => {
        if (!service) return;
        const fd = new FormData();
        fd.append('serviceId', service.id);
        if (values.name) fd.append('name', values.name);
        if (values.description) fd.append('description', values.description);
        startTransition(() => {
            formAction(fd);
        });
    };

    return (
        <ServiceForm
            visible={open}
            onCancel={onClose}
            onSubmit={handleSubmit}
            service={service ?? undefined}
            loading={isPending}
        />
    );
}