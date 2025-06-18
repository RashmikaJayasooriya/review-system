'use client';

import React from 'react';
import { Modal, Form, Input, Radio, Rate, Button, Space, Typography } from 'antd';
import { Form as FormType, Question } from '@/types';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface FormPreviewProps {
  visible: boolean;
  onCancel: () => void;
  form: FormType | null;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  visible,
  onCancel,
  form
}) => {
  const [previewForm] = Form.useForm();

  if (!form) return null;

  const renderQuestion = (question: Question) => {
    const label = (
      <span>
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </span>
    );

    switch (question.type) {
      case 'text':
        return (
          <Form.Item
            key={question.id}
            name={question.id}
            label={label}
            rules={question.required ? [{ required: true, message: 'This field is required' }] : []}
          >
            <TextArea
              placeholder="Enter your response"
              rows={3}
            />
          </Form.Item>
        );

      case 'mcq':
        return (
          <Form.Item
            key={question.id}
            name={question.id}
            label={label}
            rules={question.required ? [{ required: true, message: 'Please select an option' }] : []}
          >
            <Radio.Group>
              <Space direction="vertical">
                {question.options?.map((option, index) => (
                  <Radio key={index} value={option}>
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        );

      case 'rating':
        return (
          <Form.Item
            key={question.id}
            name={question.id}
            label={label}
            rules={question.required ? [{ required: true, message: 'Please provide a rating' }] : []}
          >
            <Rate />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title="Form Preview"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close Preview
        </Button>
      ]}
      width={700}
    >
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Title level={3} className="mb-2">
            {form.title}
          </Title>
          
          {form.description && (
            <Paragraph className="text-gray-600 mb-6">
              {form.description}
            </Paragraph>
          )}

          <Form
            form={previewForm}
            layout="vertical"
            className="space-y-4"
          >
            {form.questions
              .sort((a, b) => a.order - b.order)
              .map(renderQuestion)}
            
            <div className="pt-4 border-t">
              <Button type="primary" size="large" disabled>
                Submit Feedback (Preview Mode)
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default FormPreview;