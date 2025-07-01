"use client";

import React, {useActionState, useEffect} from "react";
import { Modal, Input, Button } from "antd";
import { createService } from "@/app/dashboard/services/actions";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormState {
    success?: boolean;
    error?: string;
}

export default function CreateServiceModal({ open, onClose, onSuccess }: Props) {
    // ➊ Grab isPending (3rd return value)
    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        createService,
        { success: false }
    );

    useEffect(() => {
        if (state.success) {
            console.log("Service created successfully");
            onSuccess();
        }
    }, [state, onSuccess]);

    return (
        <Modal
            title="Create New Service"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <form action={formAction} className="mt-4 space-y-4">
                <div>
                    <label htmlFor="name" className="flex items-center gap-x-2">
                        <span className="text-red-500 text-xl h-6">*</span> Service Name
                    </label>
                    <Input id="name" name="name" placeholder="Service Name" size="large" required />
                </div>

                <div>
                    <label htmlFor="description">Description (Optional)</label>
                    <Input.TextArea
                        id="description"
                        name="description"
                        placeholder="Service Description"
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </div>

                <div>
                    <label htmlFor="googleReviewLink">Google Review Link (Optional)</label>
                    <Input
                        id="googleReviewLink"
                        name="googleReviewLink"
                        placeholder="https://g.page/your-business"
                        size="large"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={onClose}>Cancel</Button>

                    {/* ➋ Use the isPending flag */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isPending}
                        loading={isPending}
                    >
                        {isPending ? "Creating…" : "Create Service"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
