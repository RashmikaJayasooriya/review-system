// "use client";
// import { Modal, Input, Button } from 'antd';
// import { createForm } from '@/app/dashboard/forms/actions';
// import React, {useActionState, useEffect} from 'react';
//
// interface Props {
//     open: boolean;
//     serviceId: string;
//     onClose: () => void;
// }
//
// interface State {
//     success?: boolean;
//     error?: string;
// }
//
// export default function CreateFormModal({ open, serviceId, onClose }: Props) {
//     const [state, formAction, isPending] = useActionState<State, FormData>(createForm, { success: false });
//
//     useEffect(() => {
//         if (state.success) {
//             console.log('Form created successfully');
//             onClose();
//         }
//     }, [state, onClose]);
//
//     return (
//         <Modal title="Create Review Form" open={open} onCancel={onClose} footer={null} destroyOnHidden>
//             <form action={formAction} className="mt-4 space-y-4">
//                 <input type="hidden" name="serviceId" value={serviceId} />
//
//                 <div>
//                     <label htmlFor="name" className="flex items-center gap-x-2">
//                         <span className="text-red-500 text-xl h-6">*</span> Title
//                     </label>
//                     <Input id="title" name="title" placeholder="Title" size="large" required />
//                 </div>
//
//                 <div>
//                     <label htmlFor="description">Description (Optional)</label>
//                     <Input.TextArea id="description" name="description" placeholder="Form Description" rows={4} showCount maxLength={300} />
//                 </div>
//
//                 <div className="flex justify-end gap-2 pt-2">
//                     <Button onClick={onClose}>Cancel</Button>
//                     <Button type="primary" htmlType="submit" disabled={isPending} loading={isPending}>
//                         {isPending ? 'Creating…' : 'Create Form'}
//                     </Button>
//                 </div>
//             </form>
//         </Modal>
//     );
// }



"use client";

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Space,
    Select,
    Card,
    Switch,
    Tag,
    Divider,
} from 'antd';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Trash2, Eye, Lock } from 'lucide-react';
import { Question } from '@/types';
import {createForm} from "@/app/dashboard/forms/actions";

interface Props {
    open: boolean;
    serviceId: string;
    onClose: () => void;
}
interface State {
    success?: boolean;
    error?: string;
}


// Default questions always included
const DEFAULT_QUESTIONS: Question[] = [
    {
        id: 'default_name',
        type: 'text',
        title: 'Full Name',
        required: true,
        order: 1,
    },
    {
        id: 'default_email',
        type: 'email',
        title: 'Email Address',
        required: true,
        order: 2,
    },
];

interface SortableQuestionProps {
    question: Question;
    onUpdate: (questionId: string, updates: Partial<Question>) => void;
    onDelete: (questionId: string) => void;
    isDefault?: boolean;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
                                                               question,
                                                               onUpdate,
                                                               onDelete,
                                                               isDefault = false,
                                                           }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: question.id, disabled: isDefault });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                size="small"
                className={`mb-3 border ${isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                title={
                    <div className="flex items-center gap-2">
                        {!isDefault && (
                            <div {...listeners} className="cursor-grab hover:cursor-grabbing">
                                <GripVertical size={16} className="text-gray-400" />
                            </div>
                        )}
                        {isDefault && <Lock size={16} className="text-blue-500" />}
                        <Tag color={isDefault ? 'blue' : 'default'}>
                            {question.type.toUpperCase()}
                        </Tag>
                        {question.required && <Tag color="red">Required</Tag>}
                        {isDefault && <Tag color="blue">Default</Tag>}
                    </div>
                }
                extra={
                    !isDefault && (
                        <Button
                            type="text"
                            size="small"
                            icon={<Trash2 size={14} />}
                            onClick={() => onDelete(question.id)}
                            danger
                        />
                    )
                }
            >
                <div className="space-y-3">
                    <Input
                        placeholder="Question title"
                        value={question.title}
                        onChange={(e) => onUpdate(question.id, { title: e.target.value })}
                        disabled={isDefault}
                    />

                    <div className="flex items-center gap-4">
                        <Select
                            value={question.type}
                            onChange={(type) => onUpdate(question.id, { type })}
                            className="w-32"
                            size="small"
                            disabled={isDefault}
                        >
                            <Select.Option value="text">Text</Select.Option>
                            <Select.Option value="textarea">Long Text</Select.Option>
                            <Select.Option value="mcq">Multiple Choice</Select.Option>
                            <Select.Option value="email">Email</Select.Option>
                        </Select>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Required:</span>
                            <Switch
                                size="small"
                                checked={question.required}
                                onChange={(required) => onUpdate(question.id, { required })}
                                disabled={isDefault}
                            />
                        </div>
                    </div>

                    {question.type === 'mcq' && (
                        <div>
                            <div className="text-sm text-gray-600 mb-2">Options:</div>
                            <Space direction="vertical" className="w-full">
                                {question.options?.map((option, index) => (
                                    <Input
                                        key={index}
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        size="small"
                                        onChange={(e) => {
                                            const newOptions = [...(question.options || [])];
                                            newOptions[index] = e.target.value;
                                            onUpdate(question.id, { options: newOptions });
                                        }}
                                        suffix={
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<Trash2 size={12} />}
                                                onClick={() => {
                                                    const newOptions = question.options?.filter((_, i) => i !== index);
                                                    onUpdate(question.id, { options: newOptions || [] });
                                                }}
                                            />
                                        }
                                    />
                                ))}
                                <Button
                                    type="dashed"
                                    size="small"
                                    icon={<Plus size={14} />}
                                    onClick={() => {
                                        const newOptions = [...(question.options || []), ''];
                                        onUpdate(question.id, { options: newOptions });
                                    }}
                                    block
                                >
                                    Add Option
                                </Button>
                            </Space>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default function CreateFormModal({ open, serviceId, onClose }: Props) {
    const [state, formAction, isPending] = useActionState<State, FormData>(createForm, { success: false });
    const [formData] = Form.useForm();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<{ title?: string; description?: string }>({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (open) {
            formData.resetFields();
            setQuestions([...DEFAULT_QUESTIONS]);
        }
    }, [open, formData]);

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state, onClose]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `q_${Date.now()}`,
            type: 'text',
            title: '',
            required: false,
            order: questions.length + 1,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (questionId: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => (q.id === questionId ? { ...q, ...updates } : q)));
    };

    const deleteQuestion = (questionId: string) => {
        if (questionId.startsWith('default_')) return;
        setQuestions(questions.filter(q => q.id !== questionId));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setQuestions(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over?.id);

                const activeItem = items[oldIndex];
                const overItem = items[newIndex];
                if (activeItem.id.startsWith('default_') || overItem.id.startsWith('default_')) {
                    return items;
                }
                if (oldIndex < 2 || newIndex < 2) {
                    return items;
                }
                const newItems = arrayMove(items, oldIndex, newIndex);
                return newItems.map((item, index) => ({ ...item, order: index + 1 }));
            });
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await formData.validateFields();
            const customQuestions = questions.filter(q => !q.id.startsWith('default_'));
            if (customQuestions.length === 0) {
                throw new Error('Please add at least one custom question in addition to the default name and email fields');
            }
            const invalidQuestions = questions.filter(q => !q.title.trim());
            if (invalidQuestions.length > 0) {
                throw new Error('Please provide titles for all questions');
            }
            const payloadQuestions = questions.map((q, index) => ({ ...q, order: index + 1 }));
            const fd = new FormData();
            fd.append('serviceId', serviceId);
            fd.append('title', values.title);
            if (values.description) fd.append('description', values.description);
            fd.append('questions', JSON.stringify(payloadQuestions));
            startTransition(()=>{
                formAction(fd);
            })
            // await formAction(fd);
        } catch (err) {
            console.error('Form validation failed:', err);
        }
    };

    const defaultQs = questions.filter(q => q.id.startsWith('default_'));
    const customQs = questions.filter(q => !q.id.startsWith('default_'));

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center justify-between">
                        <span>Create Review Form</span>
                        <Button
                            icon={<Eye size={16} />}
                            onClick={() => {
                                setPreviewData(formData.getFieldsValue());
                                setShowPreview(true);
                            }}
                            disabled={questions.length <= 2}
                            style={{ marginRight: '40px' }}
                        >
                            Preview
                        </Button>
                    </div>
                }
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isPending} onClick={handleSubmit}>
                        Create Form
                    </Button>,
                ]}
                width={800}
                style={{ top: 20 }}
            >
                <div className="max-h-[70vh] overflow-y-auto">
                    <Form form={formData} layout="vertical" className="mb-6">
                        <Form.Item
                            name="title"
                            label="Form Title"
                            rules={[{ required: true, message: 'Please enter a form title' }]}
                        >
                            <Input placeholder="Enter form title..." size="large" />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea placeholder="Enter form description..." rows={3} showCount maxLength={300} />
                        </Form.Item>
                    </Form>
                    <Divider>Questions</Divider>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">Form Questions ({questions.length})</h4>
                            <Button type="dashed" icon={<Plus size={16} />} onClick={addQuestion}>
                                Add Question
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Default Questions (Required)</div>
                            {defaultQs.map(question => (
                                <SortableQuestion
                                    key={question.id}
                                    question={question}
                                    onUpdate={updateQuestion}
                                    onDelete={deleteQuestion}
                                    isDefault
                                />
                            ))}
                        </div>

                        {customQs.length > 0 && (
                            <div className="space-y-3">
                                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Custom Questions</div>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={customQs.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                        {customQs.map(question => (
                                            <SortableQuestion key={question.id} question={question} onUpdate={updateQuestion} onDelete={deleteQuestion} />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </div>
                        )}

                        {customQs.length === 0 && (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="mb-2">Add custom questions to your form</p>
                                <p className="text-sm text-gray-400 mb-4">Name and email are included by default</p>
                                <Button type="primary" icon={<Plus size={16} />} onClick={addQuestion}>
                                    Add Your First Custom Question
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal
                title="Form Preview"
                open={showPreview}
                onCancel={() => setShowPreview(false)}
                footer={[
                    <Button key="close" onClick={() => setShowPreview(false)}>
                        Close
                    </Button>,
                ]}
                width={600}
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{previewData.title || 'Untitled Form'}</h2>
                        {previewData.description && <p className="text-gray-600">{previewData.description}</p>}
                    </div>

                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`p-4 border rounded-lg ${question.id.startsWith('default_') ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}. {question.title || 'Untitled Question'}
                  </span>
                                    {question.required && <span className="text-red-500">*</span>}
                                    {question.id.startsWith('default_') && <Tag color="blue">Default</Tag>}
                                </div>
                                {question.type === 'text' && <Input placeholder="Your answer..." disabled />}
                                {question.type === 'email' && <Input type="email" placeholder="your.email@example.com" disabled />}
                                {question.type === 'textarea' && <Input.TextArea placeholder="Your answer..." rows={3} disabled />}
                                {question.type === 'mcq' && (
                                    <div className="space-y-2">
                                        {question.options?.map((option, optIndex) => (
                                            <div key={optIndex} className="flex items-center gap-2">
                                                <input type="radio" disabled />
                                                <span className="text-sm text-gray-700">{option || `Option ${optIndex + 1}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );

}