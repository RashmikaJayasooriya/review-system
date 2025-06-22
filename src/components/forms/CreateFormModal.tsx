"use client";
import { Modal, Input, Button } from 'antd';
import { createForm } from '@/app/dashboard/forms/actions';
import React, {useActionState, useEffect} from 'react';

interface Props {
    open: boolean;
    serviceId: string;
    onClose: () => void;
}

interface State {
    success?: boolean;
    error?: string;
}

export default function CreateFormModal({ open, serviceId, onClose }: Props) {
    const [state, formAction, isPending] = useActionState<State, FormData>(createForm, { success: false });

    useEffect(() => {
        if (state.success) {
            console.log('Form created successfully');
            onClose();
        }
    }, [state, onClose]);

    return (
        <Modal title="Create Review Form" open={open} onCancel={onClose} footer={null} destroyOnHidden>
            <form action={formAction} className="mt-4 space-y-4">
                <input type="hidden" name="serviceId" value={serviceId} />

                <div>
                    <label htmlFor="name" className="flex items-center gap-x-2">
                        <span className="text-red-500 text-xl h-6">*</span> Title
                    </label>
                    <Input id="title" name="title" placeholder="Title" size="large" required />
                </div>

                <div>
                    <label htmlFor="description">Description (Optional)</label>
                    <Input.TextArea id="description" name="description" placeholder="Form Description" rows={4} showCount maxLength={300} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" disabled={isPending} loading={isPending}>
                        {isPending ? 'Creating…' : 'Create Form'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}