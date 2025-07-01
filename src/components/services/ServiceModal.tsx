'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Service } from '@/types';

const { TextArea } = Input;

interface ServiceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Service>) => void;
  service?: Service | null;
  loading?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  service,
  loading = false
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (service) {
        form.setFieldsValue({
          name: service.name,
          description: service.description,
          googleReviewLink: service.googleReviewLink
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, service, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      message.error('Please fill in all required fields');
    }
  };

  return (
    <Modal
      title={service ? 'Edit Service' : 'Create New Service'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Service Name"
          rules={[
            { required: true, message: 'Please enter service name' },
            { min: 2, message: 'Service name must be at least 2 characters' }
          ]}
        >
          <Input
            placeholder="Enter service name"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description (Optional)"
          rules={[
            { max: 500, message: 'Description cannot exceed 500 characters' }
          ]}
        >
          <TextArea
            placeholder="Enter service description"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item name="googleReviewLink" label="Google Review Link">
          <Input placeholder="https://g.page/your-business" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceModal;