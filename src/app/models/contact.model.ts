export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  timestamp: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
