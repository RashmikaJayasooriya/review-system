// "use client";
//
// import React, { useState } from 'react';
// import { Button, Row, Col, Empty, Input, Select, Tag, message } from 'antd';
// import { Plus, Search, Filter } from 'lucide-react';
// import FormCard from '@/components/forms/FormCard';
// import FormBuilder from '@/components/forms/FormBuilder';
// import { mockForms, mockServices } from '@/data/mockData';
// import { ReviewForm } from '@/types';
// import {useSearchParams} from "next/navigation";
//
// const Forms: React.FC = () => {
//     const searchParams = useSearchParams();
//     const preselectedServiceId = searchParams.get('serviceId');
//
//     const [forms, setForms] = useState<ReviewForm[]>(mockForms);
//     const [filteredForms, setFilteredForms] = useState<ReviewForm[]>(mockForms);
//     const [showFormBuilder, setShowFormBuilder] = useState(false);
//     const [editingForm, setEditingForm] = useState<ReviewForm | undefined>();
//     const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || 'all');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState<string>('all');
//
//     React.useEffect(() => {
//         let filtered = forms;
//
//         // Filter by service
//         if (selectedServiceId !== 'all') {
//             filtered = filtered.filter(form => form.serviceId === selectedServiceId);
//         }
//
//         // Filter by search term
//         if (searchTerm) {
//             filtered = filtered.filter(form =>
//                 form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 (form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
//             );
//         }
//
//         // Filter by status
//         if (filterStatus !== 'all') {
//             filtered = filtered.filter(form =>
//                 filterStatus === 'active' ? form.isActive : !form.isActive
//             );
//         }
//
//         setFilteredForms(filtered);
//     }, [forms, selectedServiceId, searchTerm, filterStatus]);
//
//     const handleCreateForm = () => {
//         if (selectedServiceId === 'all') {
//             message.warning('Please select a service first');
//             return;
//         }
//         setEditingForm(undefined);
//         setShowFormBuilder(true);
//     };
//
//     const handleEditForm = (form: ReviewForm) => {
//         setEditingForm(form);
//         setShowFormBuilder(true);
//     };
//
//     const handleDeleteForm = (formId: string) => {
//         setForms(forms.filter(f => f.id !== formId));
//         message.success('Form deleted successfully');
//     };
//
//     const handleViewResponses = (formId: string) => {
//         // Navigate to responses page with form filter
//         console.log('View responses for form:', formId);
//     };
//
//     const handleToggleStatus = (formId: string, isActive: boolean) => {
//         setForms(forms.map(f =>
//             f.id === formId ? { ...f, isActive } : f
//         ));
//         message.success(`Form ${isActive ? 'activated' : 'deactivated'} successfully`);
//     };
//
//     const handleFormSubmit = (values: Partial<ReviewForm>) => {
//         if (editingForm) {
//             // Update existing form
//             setForms(forms.map(f =>
//                 f.id === editingForm.id
//                     ? { ...f, ...values }
//                     : f
//             ));
//             message.success('Form updated successfully');
//         } else {
//             // Create new form
//             const newForm: ReviewForm = {
//                 id: Date.now().toString(),
//                 serviceId: selectedServiceId,
//                 title: values.title!,
//                 description: values.description,
//                 questions: values.questions || [],
//                 shareableLink: values.shareableLink!,
//                 createdAt: new Date(),
//                 isActive: true,
//                 responsesCount: 0,
//             };
//             setForms([...forms, newForm]);
//             message.success('Form created successfully');
//         }
//         setShowFormBuilder(false);
//     };
//
//     const getServiceName = (serviceId: string) => {
//         const service = mockServices.find(s => s.id === serviceId);
//         return service?.name || 'Unknown Service';
//     };
//
//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Review Forms</h1>
//                     <p className="text-gray-600 mt-1">
//                         Create and manage feedback forms for your services
//                     </p>
//                 </div>
//                 <Button
//                     type="primary"
//                     icon={<Plus size={16} />}
//                     onClick={handleCreateForm}
//                     size="large"
//                     disabled={selectedServiceId === 'all'}
//                 >
//                     Create Form
//                 </Button>
//             </div>
//
//             {/* Filters */}
//             <div className="flex flex-col lg:flex-row gap-4">
//                 <Input
//                     placeholder="Search forms..."
//                     prefix={<Search size={16} className="text-gray-400" />}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="lg:w-80"
//                     size="large"
//                 />
//
//                 <Select
//                     value={selectedServiceId}
//                     onChange={setSelectedServiceId}
//                     className="lg:w-64"
//                     size="large"
//                     placeholder="Select Service"
//                 >
//                     <Select.Option value="all">All Services</Select.Option>
//                     {mockServices.map(service => (
//                         <Select.Option key={service.id} value={service.id}>
//                             {service.name}
//                         </Select.Option>
//                     ))}
//                 </Select>
//
//                 <Select
//                     value={filterStatus}
//                     onChange={setFilterStatus}
//                     className="lg:w-48"
//                     size="large"
//                     prefix={<Filter size={16} />}
//                 >
//                     <Select.Option value="all">All Status</Select.Option>
//                     <Select.Option value="active">Active</Select.Option>
//                     <Select.Option value="inactive">Inactive</Select.Option>
//                 </Select>
//             </div>
//
//             {/* Active Filters */}
//             {(selectedServiceId !== 'all' || filterStatus !== 'all') && (
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-600">Active filters:</span>
//                     {selectedServiceId !== 'all' && (
//                         <Tag
//                             closable
//                             onClose={() => setSelectedServiceId('all')}
//                             color="blue"
//                         >
//                             Service: {getServiceName(selectedServiceId)}
//                         </Tag>
//                     )}
//                     {filterStatus !== 'all' && (
//                         <Tag
//                             closable
//                             onClose={() => setFilterStatus('all')}
//                             color="green"
//                         >
//                             Status: {filterStatus}
//                         </Tag>
//                     )}
//                 </div>
//             )}
//
//             {/* Forms Grid */}
//             {filteredForms.length > 0 ? (
//                 <Row gutter={[24, 24]}>
//                     {filteredForms.map((form) => (
//                         <Col key={form.id} xs={24} sm={12} lg={8} xl={6}>
//                             <div className="space-y-2">
//                                 <Tag color="blue">
//                                     {getServiceName(form.serviceId)}
//                                 </Tag>
//                                 <FormCard
//                                     form={form}
//                                     onEdit={handleEditForm}
//                                     onDelete={handleDeleteForm}
//                                     onViewResponses={handleViewResponses}
//                                     onToggleStatus={handleToggleStatus}
//                                 />
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>
//             ) : (
//                 <div className="text-center py-12">
//                     <Empty
//                         description={
//                             searchTerm
//                                 ? `No forms found matching "${searchTerm}"`
//                                 : selectedServiceId === 'all'
//                                     ? "Select a service to view its forms"
//                                     : "No forms created for this service yet"
//                         }
//                     >
//                         {selectedServiceId !== 'all' && !searchTerm && (
//                             <Button
//                                 type="primary"
//                                 icon={<Plus size={16} />}
//                                 onClick={handleCreateForm}
//                                 size="large"
//                             >
//                                 Create Your First Form
//                             </Button>
//                         )}
//                     </Empty>
//                 </div>
//             )}
//
//             {/* Form Builder Modal */}
//             <FormBuilder
//                 visible={showFormBuilder}
//                 onCancel={() => setShowFormBuilder(false)}
//                 onSubmit={handleFormSubmit}
//                 form={editingForm}
//                 serviceId={selectedServiceId}
//             />
//         </div>
//     );
// };
//
// export default Forms;

import { Suspense } from 'react';
import { SearchFilterProvider } from './SearchFilterContext';
import FormsHeader from './FormsHeader';
import FormsSkeleton from '@/components/forms/FormsSkeleton';
import FormsWrapper from './FormsWrapper';
import {getServices} from "@/app/dashboard/services/actions";

export default async function FormsPage() {
    const raw = await getServices();
    const services = raw.map((s) => ({ id: s.id, name: s.name }));

    return (
        <SearchFilterProvider>
            <FormsHeader services={services}/>
            <Suspense fallback={<FormsSkeleton />}>
                <FormsWrapper />
            </Suspense>
        </SearchFilterProvider>
    );
}