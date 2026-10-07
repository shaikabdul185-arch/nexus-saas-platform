export interface Tenant {
  id: string;
  name: string;
  plan: 'Startup' | 'Growth' | 'Enterprise';
  status: 'Active' | 'Suspended';
  logoUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatarUrl: string;
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  users: number;
  churnRate: number;
}

export interface DashboardData {
  tenantId: string;
  totalRevenue: number;
  activeUsers: number;
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
  recentActivity: ActivityLog[];
  history: MonthlyMetric[];
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export type ViewState = 'dashboard' | 'users' | 'settings' | 'ai-analyst';

export interface AiInsightResponse {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  recommendations: string[];
}