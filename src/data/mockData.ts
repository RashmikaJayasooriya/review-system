import { Service, ReviewForm, FormResponse, Question } from '../../../../OneDrive/Desktop/newOne/project/src/types';

export const mockUser = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@company.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  role: 'Service Manager'
};

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Custom web development services including React, Node.js, and full-stack solutions',
    createdAt: new Date('2024-01-15'),
    formsCount: 3,
    responsesCount: 45
  },
  {
    id: '2',
    name: 'Digital Marketing',
    description: 'Comprehensive digital marketing services including SEO, social media, and content marketing',
    createdAt: new Date('2024-02-01'),
    formsCount: 2,
    responsesCount: 28
  },
  {
    id: '3',
    name: 'Consulting Services',
    description: 'Business consulting and strategy development services',
    createdAt: new Date('2024-02-10'),
    formsCount: 1,
    responsesCount: 12
  }
];

const defaultQuestions: Question[] = [
  {
    id: 'default_name',
    type: 'text',
    title: 'Full Name',
    required: true,
    order: 1
  },
  {
    id: 'default_email',
    type: 'email',
    title: 'Email Address',
    required: true,
    order: 2
  }
];

const sampleCustomQuestions: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    title: 'How would you rate our service overall?',
    required: true,
    options: ['Excellent', 'Good', 'Average', 'Poor'],
    order: 3
  },
  {
    id: 'q2',
    type: 'textarea',
    title: 'Please provide any additional feedback',
    required: false,
    order: 4
  }
];

export const mockForms: ReviewForm[] = [
  {
    id: '1',
    serviceId: '1',
    title: 'Post-Project Feedback',
    description: 'Help us improve our web development services',
    questions: [...defaultQuestions, ...sampleCustomQuestions],
    shareableLink: 'https://forms.company.com/feedback/web-dev-1',
    createdAt: new Date('2024-01-20'),
    isActive: true,
    responsesCount: 23
  },
  {
    id: '2',
    serviceId: '1',
    title: 'Client Satisfaction Survey',
    description: 'Quick survey about your experience',
    questions: [...defaultQuestions, sampleCustomQuestions[0]],
    shareableLink: 'https://forms.company.com/survey/web-dev-2',
    createdAt: new Date('2024-02-05'),
    isActive: true,
    responsesCount: 15
  },
  {
    id: '3',
    serviceId: '2',
    title: 'Marketing Campaign Review',
    description: 'Feedback on our digital marketing campaigns',
    questions: [
      ...defaultQuestions,
      {
        id: 'q4',
        type: 'mcq',
        title: 'How effective was our marketing campaign?',
        required: true,
        options: ['Very Effective', 'Effective', 'Somewhat Effective', 'Not Effective'],
        order: 3
      },
      {
        id: 'q5',
        type: 'textarea',
        title: 'What improvements would you suggest?',
        required: false,
        order: 4
      }
    ],
    shareableLink: 'https://forms.company.com/marketing/campaign-1',
    createdAt: new Date('2024-02-12'),
    isActive: true,
    responsesCount: 18
  }
];

export const mockResponses: FormResponse[] = [
  {
    id: '1',
    formId: '1',
    responses: {
      'default_name': 'Sarah Johnson',
      'default_email': 'sarah.johnson@email.com',
      'q1': 'Excellent',
      'q2': 'Great work on the project. Very professional team.'
    },
    submittedAt: new Date('2024-02-20'),
    rating: 5
  },
  {
    id: '2',
    formId: '1',
    responses: {
      'default_name': 'Mike Davis',
      'default_email': 'mike.davis@email.com',
      'q1': 'Good',
      'q2': 'Delivered on time and met all requirements.'
    },
    submittedAt: new Date('2024-02-22'),
    rating: 4
  }
];