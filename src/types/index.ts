export interface Service {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: 'mcq' | 'text' | 'rating';
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface Form {
  id: string;
  serviceId: string;
  title: string;
  description?: string;
  questions: Question[];
  shareableLink: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Response {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: Date;
  customerEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}