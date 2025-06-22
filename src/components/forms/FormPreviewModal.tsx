"use client";
import { Modal, Input, Tag } from 'antd';
import { ReviewForm } from '@/types';

interface Props {
    form: ReviewForm | null;
    open: boolean;
    onClose: () => void;
}

export default function FormPreviewModal({ form, open, onClose }: Props) {
    if (!form) return null;
    return (
        <Modal title={form.title} open={open} onCancel={onClose} footer={null} width={600}>
            <div className="space-y-6">
                {form.description && <p className="text-gray-600">{form.description}</p>}
                <div className="space-y-4">
                    {form.questions.map((q, idx) => (
                        <div
                            key={q.id}
                            className={`p-4 border rounded-lg ${q.id.startsWith('default_') ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {idx + 1}. {q.title}
                </span>
                                {q.required && <span className="text-red-500">*</span>}
                                {q.id.startsWith('default_') && <Tag color="blue">Default</Tag>}
                            </div>
                            {q.type === 'text' && <Input disabled placeholder="Your answer..." />}
                            {q.type === 'email' && <Input disabled type="email" placeholder="your.email@example.com" />}
                            {q.type === 'textarea' && <Input.TextArea disabled rows={3} placeholder="Your answer..." />}
                            {q.type === 'mcq' && (
                                <div className="space-y-2">
                                    {q.options?.map((o, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input type="radio" disabled />
                                            <span className="text-sm text-gray-700">{o}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}