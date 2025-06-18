'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, Switch, Space, Card, message } from 'antd';
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
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Form as FormType, Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const { Option } = Select;

interface FormBuilderProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<FormType>) => void;
  form?: FormType | null;
  loading?: boolean;
}

interface SortableQuestionProps {
  question: Question;
  index: number;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
  question,
  index,
  updateQuestion,
  deleteQuestion
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        size="small"
        className="mb-4"
        title={
          <div className="flex items-center gap-2">
            <div {...listeners} className="cursor-move">
              <DragOutlined className="text-gray-400" />
            </div>
            <QuestionCircleOutlined />
            <span>Question {index + 1}</span>
          </div>
        }
        extra={
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteQuestion(question.id)}
          />
        }
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block text-sm font-medium mb-1">Question Type</label>
            <Select
              value={question.type}
              onChange={(value) => updateQuestion(question.id, { type: value })}
              className="w-full"
            >
              <Option value="text">Text Response</Option>
              <Option value="mcq">Multiple Choice</Option>
              <Option value="rating">Rating (1-5)</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <TextArea
              value={question.question}
              onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
              placeholder="Enter your question"
              rows={2}
            />
          </div>

          {question.type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium mb-1">Options (one per line)</label>
              <TextArea
                value={question.options?.join('\n') || ''}
                onChange={(e) => updateQuestion(question.id, { 
                  options: e.target.value.split('\n').filter(opt => opt.trim()) 
                })}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              checked={question.required}
              onChange={(checked) => updateQuestion(question.id, { required: checked })}
            />
            <span className="text-sm">Required question</span>
          </div>
        </Space>
      </Card>
    </div>
  );
};

const FormBuilder: React.FC<FormBuilderProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  loading = false
}) => {
  const [formInstance] = Form.useForm();
  const [questions, setQuestions] = useState<Question[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (visible) {
      if (form) {
        formInstance.setFieldsValue({
          title: form.title,
          description: form.description
        });
        setQuestions(form.questions || []);
      } else {
        formInstance.resetFields();
        setQuestions([]);
      }
    }
  }, [visible, form, formInstance]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      question: '',
      required: false,
      order: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order numbers
        return newItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await formInstance.validateFields();
      
      if (questions.length === 0) {
        message.error('Please add at least one question');
        return;
      }

      const hasEmptyQuestions = questions.some(q => !q.question.trim());
      if (hasEmptyQuestions) {
        message.error('Please fill in all question fields');
        return;
      }

      onSubmit({
        ...values,
        questions: questions.map((q, index) => ({ ...q, order: index + 1 }))
      });
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  return (
    <Modal
      title={form ? 'Edit Review Form' : 'Create New Review Form'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <div className="max-h-96 overflow-y-auto">
        <Form
          form={formInstance}
          layout="vertical"
          className="mb-6"
        >
          <Form.Item
            name="title"
            label="Form Title"
            rules={[
              { required: true, message: 'Please enter form title' },
              { min: 2, message: 'Form title must be at least 2 characters' }
            ]}
          >
            <Input
              placeholder="Enter form title"
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
              placeholder="Enter form description"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Questions</h4>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((question, index) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  index={index}
                  updateQuestion={updateQuestion}
                  deleteQuestion={deleteQuestion}
                />
              ))}
            </SortableContext>
          </DndContext>

          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <QuestionCircleOutlined className="text-4xl mb-2" />
              <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FormBuilder;