/**
 * Demo Request Model
 * Matches the form data from demo-request component
 */
export interface DemoRequest {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companySize: string;
  shippingRegions: string[];
  currentTools: string[];
  challenge: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * Demo Request Response
 */
export interface DemoRequestResponse {
  id: string;
  requestDate: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed';
  scheduledDate?: string;
}

/**
 * Newsletter Subscription Model
 */
export interface NewsletterSubscription {
  email: string;
  source?: string;
}

/**
 * Error Response Model
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: any;
}
