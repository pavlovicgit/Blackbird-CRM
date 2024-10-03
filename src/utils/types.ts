export interface Client {
  id: number;
  clientName: string;
  status: string;
  email: string;
  phoneNumber: string;
}

export interface Project {
  id: number;
  clientId: number;
  clientName: string;
  projectName: string;
  startDate: string;
  status: string;
}

export interface Comment {
  id: number;
  clientId: number; 
  projectId: number; 
  commentText: string;
  clientName: string; 
  projectName: string; 
  createdDate: string;
}

export interface Transaction {
  id: number;
  clientId: number;
  projectId: number;
  amount: number;
  clientName: string;
  projectName: string;
  transactionStatus: string;  // Keep this as string
  dueAmount: number;
  dueDate: string;
  currency: string;
}

export interface ClientDetails {
  id: number;
  name: string;
  status: string;
  email: string;
  phoneNumber: string;
  projects: {
    startDate: string;
    status: string;
  }[];
  comments: {
    commentText: string;
  }[];
  transactions: {
    amount: number;
  }[];
}