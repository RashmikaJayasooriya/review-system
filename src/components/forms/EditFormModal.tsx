"use client";
import React, { startTransition, useActionState, useEffect } from 'react';
import { ReviewForm } from '@/types';
import FormBuilder from './FormBuilder';
import { updateForm } from '@/app/dashboard/forms/actions';

interface Props {
    open: boolean;
    form: ReviewForm | null;
    onClose: () => void;
}

interface State {
    success?: boolean;
    error?: string;
}

export default function EditFormModal({ open, form, onClose }: Props) {
    const [state, formAction, isPending] = useActionState<State, FormData>(updateForm, { success: false });

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state, onClose]);

    const handleSubmit = (values: Partial<ReviewForm>) => {
        if (!form) return;
        const fd = new FormData();
        fd.append('formId', form.id);
        fd.append('title', values.title || '');
        if (values.description) fd.append('description', values.description);
        fd.append('questions', JSON.stringify(values.questions));
        startTransition(() => {
            formAction(fd);
        });
    };

    return (
        <FormBuilder
            visible={open}
            onCancel={onClose}
            onSubmit={handleSubmit}
            form={form ?? undefined}
            serviceId={form?.serviceId || ''}
            loading={isPending}
        />
    );
}