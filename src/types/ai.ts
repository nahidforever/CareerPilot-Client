export type AIMessageRole = "user" | "assistant";

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
}

export interface AIConversationSummary {
  _id: string;
  title: string;
  messageCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIConversation {
  _id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIConversationsResponse {
  success: boolean;
  message: string;
  data: AIConversationSummary[];
}

export interface AIConversationResponse {
  success: boolean;
  message: string;
  data: AIConversation;
}

export interface AIStreamEvent {
  type: "conversation" | "delta" | "done" | "error";

  conversationId?: string;
  content?: string;
  suggestions?: string[];
  message?: string;
}
