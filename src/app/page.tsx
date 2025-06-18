'use client';

import React, { useState } from 'react';
import { Button, Row, Col, Typography, Empty, message, Popconfirm } from 'antd';
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceModal from '@/components/services/ServiceModal';
import FormCard from '@/components/forms/FormCard';
import FormBuilder from '@/components/forms/FormBuilder';
import FormPreview from '@/components/forms/FormPreview';
import StatsCard from '@/components/dashboard/StatsCard';
import { mockServices, mockForms, mockResponses } from '@/data/mockData';
import { Service, Form } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [services, setServices] = useState<Service[]>(mockServices);
  const [forms, setForms] = useState<Form[]>(mockForms);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Modal states
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [formBuilderVisible, setFormBuilderVisible] = useState(false);
  const [formPreviewVisible, setFormPreviewVisible] = useState(false);
  
  // Edit states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [previewForm, setPreviewForm] = useState<Form | null>(null);

  // Service handlers
  const handleCreateService = () => {
    setEditingService(null);
    setServiceModalVisible(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceModalVisible(true);
  };

  const handleServiceSubmit = (values: Partial<Service>) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...s, ...values, updatedAt: new Date() }
          : s
      ));
      message.success('Service updated successfully');
    } else {
      // Create new service
      const newService: Service = {
        id: uuidv4(),
        name: values.name!,
        description: values.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setServices([...services, newService]);
      message.success('Service created successfully');
    }
    setServiceModalVisible(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    setForms(forms.filter(f => f.serviceId !== serviceId));
    message.success('Service deleted successfully');
  };

  const handleViewServiceForms = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveView('forms');
  };

  // Form handlers
  const handleCreateForm = () => {
    setEditingForm(null);
    setFormBuilderVisible(true);
  };

  const handleEditForm = (form: Form) => {
    setEditingForm(form);
    setFormBuilderVisible(true);
  };

  const handleFormSubmit = (values: Partial<Form>) => {
    if (editingForm) {
      // Update existing form
      setForms(forms.map(f => 
        f.id === editingForm.id 
          ? { ...f, ...values, updatedAt: new Date() }
          : f
      ));
      message.success('Form updated successfully');
    } else {
      // Create new form
      const newForm: Form = {
        id: uuidv4(),
        serviceId: selectedServiceId || services[0]?.id || '',
        title: values.title!,
        description: values.description,
        questions: values.questions || [],
        shareableLink: `https://reviews.example.com/form/${uuidv4()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      setForms([...forms, newForm]);
      message.success('Form created successfully');
    }
    setFormBuilderVisible(false);
    setEditingForm(null);
  };

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter(f => f.id !== formId));
    message.success('Form deleted successfully');
  };

  const handlePreviewForm = (form: Form) => {
    setPreviewForm(form);
    setFormPreviewVisible(true);
  };

  const handleToggleFormStatus = (formId: string, isActive: boolean) => {
    setForms(forms.map(f => 
      f.id === formId ? { ...f, isActive } : f
    ));
    message.success(`Form ${isActive ? 'activated' : 'deactivated'} successfully`);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    message.success('Link copied to clipboard');
  };

  const handleViewResponses = (formId: string) => {
    message.info('Response analytics feature coming soon!');
  };

  // Get filtered forms based on selected service
  const getFilteredForms = () => {
    if (selectedServiceId) {
      return forms.filter(f => f.serviceId === selectedServiceId);
    }
    return forms;
  };

  // Get form counts for services
  const getFormCount = (serviceId: string) => {
    return forms.filter(f => f.serviceId === serviceId).length;
  };

  // Get response counts for forms
  const getResponseCount = (formId: string) => {
    return mockResponses.filter(r => r.formId === formId).length;
  };

  // Render dashboard view
  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <Title level={2}>Dashboard Overview</Title>
        <p className="text-gray-600">Welcome back! Here's what's happening with your review system.</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Services"
            value={services.length}
            trend={{ value: 12, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Active Forms"
            value={forms.filter(f => f.isActive).length}
            trend={{ value: 8, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Responses"
            value={mockResponses.length}
            trend={{ value: 23, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Response Rate"
            value={78}
            suffix="%"
            trend={{ value: 5, isPositive: true }}
          />
        </Col>
      </Row>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Title level={3}>Recent Services</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateService}
          >
            Add Service
          </Button>
        </div>

        {services.length > 0 ? (
          <Row gutter={[16, 16]}>
            {services.slice(0, 6).map(service => (
              <Col key={service.id} xs={24} sm={12} lg={8}>
                <ServiceCard
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                  onViewForms={handleViewServiceForms}
                  formsCount={getFormCount(service.id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            image={<AppstoreOutlined className="text-6xl text-gray-300" />}
            description="No services created yet"
          >
            <Button type="primary" onClick={handleCreateService}>
              Create Your First Service
            </Button>
          </Empty>
        )}
      </div>
    </div>
  );

  // Render services view
  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title level={2}>Services</Title>
          <p className="text-gray-600">Manage your services and their review forms.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateService}
        >
          Add Service
        </Button>
      </div>

      {services.length > 0 ? (
        <Row gutter={[16, 16]}>
          {services.map(service => (
            <Col key={service.id} xs={24} sm={12} lg={8}>
              <ServiceCard
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onViewForms={handleViewServiceForms}
                formsCount={getFormCount(service.id)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={<AppstoreOutlined className="text-6xl text-gray-300" />}
          description="No services created yet"
        >
          <Button type="primary" onClick={handleCreateService}>
            Create Your First Service
          </Button>
        </Empty>
      )}
    </div>
  );

  // Render forms view
  const renderForms = () => {
    const filteredForms = getFilteredForms();
    const selectedService = selectedServiceId ? services.find(s => s.id === selectedServiceId) : null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2}>
              Review Forms
              {selectedService && (
                <span className="text-base font-normal text-gray-500 ml-2">
                  for {selectedService.name}
                </span>
              )}
            </Title>
            <p className="text-gray-600">Create and manage review questionnaire forms.</p>
          </div>
          <div className="space-x-2">
            {selectedServiceId && (
              <Button onClick={() => setSelectedServiceId(null)}>
                View All Forms
              </Button>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateForm}
            >
              Create Form
            </Button>
          </div>
        </div>

        {filteredForms.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredForms.map(form => (
              <Col key={form.id} xs={24} sm={12} lg={8}>
                <FormCard
                  form={form}
                  onEdit={handleEditForm}
                  onDelete={handleDeleteForm}
                  onPreview={handlePreviewForm}
                  onToggleStatus={handleToggleFormStatus}
                  onCopyLink={handleCopyLink}
                  onViewResponses={handleViewResponses}
                  responsesCount={getResponseCount(form.id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description={selectedService ? 
              `No forms created for ${selectedService.name} yet` : 
              "No forms created yet"
            }
          >
            <Button type="primary" onClick={handleCreateForm}>
              Create Your First Form
            </Button>
          </Empty>
        )}
      </div>
    );
  };

  // Render analytics view
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <Title level={2}>Analytics</Title>
        <p className="text-gray-600">Detailed analytics and insights coming soon!</p>
      </div>
      <Empty description="Analytics dashboard is under development" />
    </div>
  );

  // Main render function
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'services':
        return renderServices();
      case 'forms':
        return renderForms();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout
      activeKey={activeView}
      onMenuSelect={setActiveView}
    >
      {renderContent()}

      {/* Service Modal */}
      <ServiceModal
        visible={serviceModalVisible}
        onCancel={() => {
          setServiceModalVisible(false);
          setEditingService(null);
        }}
        onSubmit={handleServiceSubmit}
        service={editingService}
      />

      {/* Form Builder Modal */}
      <FormBuilder
        visible={formBuilderVisible}
        onCancel={() => {
          setFormBuilderVisible(false);
          setEditingForm(null);
        }}
        onSubmit={handleFormSubmit}
        form={editingForm}
      />

      {/* Form Preview Modal */}
      <FormPreview
        visible={formPreviewVisible}
        onCancel={() => {
          setFormPreviewVisible(false);
          setPreviewForm(null);
        }}
        form={previewForm}
      />
    </DashboardLayout>
  );
}