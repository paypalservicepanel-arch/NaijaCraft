export type UserRole = "customer" | "artisan" | "admin" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinDate: string;
  status: "active" | "suspended";
}

export interface Artisan {
  id: string;
  userId: string;
  name: string;
  category: string;
  city: string;
  state: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  rateUnit: "hr" | "session" | "event" | "day";
  rating: number;
  reviewCount: number;
  availability: "available" | "busy" | "away";
  avatar: string;
  portfolioImages: string[];
  joinDate: string;
  totalEarnings: number;
  completedJobs: number;
}

export interface Review {
  id: string;
  artisanId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  jobTitle: string;
}

export interface JobRequest {
  id: string;
  customerId: string;
  customerName: string;
  artisanId: string;
  artisanName: string;
  title: string;
  description: string;
  budget: number;
  proposedDate: string;
  status: "pending" | "accepted" | "declined" | "completed" | "paid";
  createdAt: string;
  reviewLeft?: boolean;
}

export interface Transaction {
  id: string;
  jobId: string;
  jobTitle: string;
  customerId: string;
  customerName: string;
  artisanId: string;
  artisanName: string;
  amount: number;
  commission: number;
  payout: number;
  date: string;
  status: "pending" | "completed" | "refunded";
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface JobListing {
  id: string;
  artisanId: string;
  artisanName: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  location: string;
  postedAt: string;
  status: "open" | "closed";
}
