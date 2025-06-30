export interface Service {
  userId: string;
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  formsCount: number;
  responsesCount: number;
}

export interface Question {
  id: string;
  type: 'text' | 'mcq' | 'textarea' | 'email';
  title: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface ReviewForm {
  userId: string;
  id: string;
  serviceId: string;
  title: string;
  description?: string;
  questions: Question[];
  shareableLink: string;
  createdAt: Date;
  isActive: boolean;
  responsesCount: number;
}

export interface Review {
  id: string;
  formId: string;
  review: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ReviewWithForm extends Review {
  formTitle: string;
  serviceName: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  name: string;
  email: string;
  responses: string;
  submittedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}