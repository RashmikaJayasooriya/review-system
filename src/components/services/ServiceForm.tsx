import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Service } from '@/types';

interface ServiceFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Service>) => void;
  service?: Service;
  loading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  service,
  loading = false,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (service) {
        form.setFieldsValue({
          name: service.name,
          description: service.description,
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
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title={service ? 'Edit Service' : 'Create New Service'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {service ? 'Update Service' : 'Create Service'}
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
      >
        <Form.Item
          name="name"
          label="Service Name"
          rules={[
            { required: true, message: 'Please enter a service name' },
            { min: 2, message: 'Service name must be at least 2 characters' },
          ]}
        >
          <Input
            placeholder="Enter service name..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: 'Description cannot exceed 500 characters' },
          ]}
        >
          <Input.TextArea
            placeholder="Enter service description..."
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceForm;