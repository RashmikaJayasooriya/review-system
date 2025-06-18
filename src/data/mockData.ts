import { Service, Form, Question, Response, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  role: 'Service Provider'
};

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Custom web development services for businesses',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Digital Marketing',
    description: 'Comprehensive digital marketing solutions',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Graphic Design',
    description: 'Professional graphic design and branding services',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'rating',
    question: 'How would you rate our overall service quality?',
    required: true,
    order: 1
  },
  {
    id: '2',
    type: 'mcq',
    question: 'How did you hear about our services?',
    options: ['Google Search', 'Social Media', 'Referral', 'Advertisement', 'Other'],
    required: true,
    order: 2
  },
  {
    id: '3',
    type: 'text',
    question: 'What aspects of our service did you like most?',
    required: false,
    order: 3
  },
  {
    id: '4',
    type: 'text',
    question: 'Any suggestions for improvement?',
    required: false,
    order: 4
  }
];

export const mockForms: Form[] = [
  {
    id: '1',
    serviceId: '1',
    title: 'Web Development Feedback Form',
    description: 'Help us improve our web development services',
    questions: mockQuestions,
    shareableLink: 'https://reviews.example.com/form/web-dev-feedback-2024',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    isActive: true
  },
  {
    id: '2',
    serviceId: '1',
    title: 'Project Completion Survey',
    description: 'Post-project completion feedback',
    questions: mockQuestions.slice(0, 2),
    shareableLink: 'https://reviews.example.com/form/project-completion-2024',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    isActive: true
  },
  {
    id: '3',
    serviceId: '2',
    title: 'Marketing Campaign Review',
    description: 'Feedback on our marketing campaign effectiveness',
    questions: mockQuestions.slice(1, 4),
    shareableLink: 'https://reviews.example.com/form/marketing-review-2024',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    isActive: false
  }
];

export const mockResponses: Response[] = [
  {
    id: '1',
    formId: '1',
    answers: {
      '1': 5,
      '2': 'Google Search',
      '3': 'Professional quality and timely delivery',
      '4': 'More frequent updates during development'
    },
    submittedAt: new Date('2024-01-17'),
    customerEmail: 'customer1@example.com'
  },
  {
    id: '2',
    formId: '1',
    answers: {
      '1': 4,
      '2': 'Referral',
      '3': 'Great communication and technical expertise',
      '4': 'Could improve initial consultation process'
    },
    submittedAt: new Date('2024-01-19'),
    customerEmail: 'customer2@example.com'
  }
];