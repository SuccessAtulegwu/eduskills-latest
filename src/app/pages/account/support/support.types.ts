export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'course' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  description: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorRole: 'user' | 'support' | 'admin';
  createdAt: Date;
  attachments?: string[];
}

