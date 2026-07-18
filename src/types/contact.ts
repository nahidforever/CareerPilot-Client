export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
  };
}