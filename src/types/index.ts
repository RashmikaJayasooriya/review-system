export interface Service {
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

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, string>;
  submittedAt: Date;
  rating?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}