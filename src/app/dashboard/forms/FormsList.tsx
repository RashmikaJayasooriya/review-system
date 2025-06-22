'use client';
import {Row, Col, Empty, Tag, message} from 'antd';
import { useSearchFilter } from './SearchFilterContext';
import FormCard from '@/components/forms/FormCard';
import { ReviewForm } from '@/types';
import {useMemo, useState} from 'react';
import FormPreviewModal from "@/components/forms/FormPreviewModal";
import EditFormModal from "@/components/forms/EditFormModal";
import {getForms, toggleFormStatus} from "@/app/dashboard/forms/actions";

interface DTO extends Omit<ReviewForm, 'createdAt'> {
    createdAt: string;
}

interface Props {
    initialForms: DTO[];
}

export default function FormsList({ initialForms }: Props) {
    const { searchTerm, serviceId, status } = useSearchFilter();
    const [forms, setForms] = useState<DTO[]>(initialForms);
    const [editingForm, setEditingForm] = useState<ReviewForm | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [previewForm, setPreviewForm] = useState<ReviewForm | null>(null);
    const [modalKey, setModalKey] = useState(0);

    // const forms = useMemo(() => {
    //     const withDate = initialForms.map(f => ({ ...f, createdAt: new Date(f.createdAt) }));
    const reloadForms = async () => {
        const latest = await getForms();
        console.log('Reloaded forms:', latest);
        const dto = latest.map(f => ({ ...f, createdAt: f.createdAt.toISOString() }));
        setForms(dto);
        console.log('Updated forms state:', dto);
        setModalKey(k => k + 1); // Force re-render of modals
    };

    const handleEdit = (form: ReviewForm) => {
        setEditingForm(form);
        setShowEdit(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete form?',
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okButtonProps: { danger: true },
            async onOk() {
                try {
                    await deleteForm(id);
                    await reloadForms();
                    message.success('Form deleted');
                } catch {
                    message.error('Failed to delete form');
                }
            },
        });
    };

    const handleToggle = async (id: string, active: boolean) => {
        try {
            await toggleFormStatus(id, active);
            await reloadForms();
            message.success(`Form ${active ? 'activated' : 'deactivated'}`);
        } catch {
            message.error('Failed to update status');
        }
    };

    const formsToDisplay = useMemo(() => {
        const withDate = forms.map(f => ({ ...f, createdAt: new Date(f.createdAt) }));
        let filtered = withDate;
        if (serviceId !== 'all') {
            filtered = filtered.filter(f => f.serviceId === serviceId);
        }
        if (searchTerm) {
            filtered = filtered.filter(f =>
                f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (f.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
            );
        }
        if (status !== 'all') {
            filtered = filtered.filter(f => (status === 'active' ? f.isActive : !f.isActive));
        }
        return filtered;
    // }, [initialForms, searchTerm, serviceId, status]);
    }, [forms, searchTerm, serviceId, status]);

    // if (forms.length === 0) {
    if (formsToDisplay.length === 0) {
        return (
            <Empty className="my-20" description={searchTerm ? `No forms found matching “${searchTerm}”` : 'No forms created yet'} />
        );
    }

    return (
        <>
        <Row gutter={[24, 24]}>
            {/*{forms.map(f => (*/}
            {formsToDisplay.map(f => (
                <Col key={f.id} xs={24} sm={12} lg={8} xl={6}>
                    <div className="space-y-2">
                        <Tag color="blue">Service {f.serviceId}</Tag>
                        {/*<FormCard form={{ ...f, createdAt: new Date(f.createdAt) }} onEdit={() => {}} onDelete={() => {}} onViewResponses={() => {}} onToggleStatus={() => {}} />*/}
                        <FormCard
                            form={{ ...f, createdAt: new Date(f.createdAt) }}
                            onEdit={handleEdit}
                            onPreview={(form) => setPreviewForm(form)}
                            onDelete={handleDelete}
                            onViewResponses={() => {}}
                            onToggleStatus={handleToggle}
                        />
                    </div>
                </Col>
            ))}
        </Row>
            <EditFormModal
                key={modalKey}
                open={showEdit}
                form={editingForm}
                onClose={() => {
                    setShowEdit(false);
                    reloadForms();
                }} />
            <FormPreviewModal open={!!previewForm} form={previewForm} onClose={() => setPreviewForm(null)} />
        </>
    );
}