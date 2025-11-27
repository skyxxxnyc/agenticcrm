
export enum PackageTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ANY = 'ANY'
}

export enum DealStage {
  LEAD = 'LEAD',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Company {
  id: string;
  name: string;
  category: string;
  websiteUrl?: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  painPoints?: string[];
  salesOpportunities?: string[];
  digitalGapScore: number;
  icpFitScore: number;
}

export interface Contact {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  status: 'LEAD' | 'ACTIVE' | 'DORMANT' | 'LOST';
}

export interface Deal {
  id: string;
  companyId: string;
  contactId?: string;
  name: string;
  value: number;
  stage: DealStage;
  nextAction?: string;
  nextActionDate?: string; // ISO Date
  lastTouchDate?: string; // ISO Date
  priority: Priority;
  packageFit: PackageTier;
  mqlScore: number;
}

export interface Task {
  id: string;
  dealId?: string;
  title: string;
  dueDate: string;
  priority: Priority;
  status: 'PENDING' | 'DONE';
  agentGenerated: boolean;
}

export interface ICPProfile {
  id: string;
  name: string;
  geography: string;
  categories: string[];
  targetPackage: PackageTier;
  active: boolean;
  lastRun?: string;
}

export interface SDRBatch {
  id: string;
  icpProfileId: string;
  name: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'DISCARDED';
  runDate: string;
  totalCandidates: number;
  approvedLeads: number;
  rejectedLeads: number;
}

export interface SDRLead {
  id: string;
  batchId: string;
  companyName: string;
  category: string;
  rating: number;
  reviews: number;
  address?: string;
  website?: string;
  phone?: string;
  googleMapsUrl?: string;
  status: 'CANDIDATE' | 'APPROVED' | 'REJECTED';
  tier: 'A' | 'B' | 'C';
  matchScore: number;
  qualificationSummary: string;
  talkingPoints: string[];
  companyId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isFunctionResponse?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  tags: string[];
  lastUsed?: string;
}
