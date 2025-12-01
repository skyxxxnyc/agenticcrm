
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

export interface Activity {
  id: string;
  customerId?: string;
  dealId?: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE' | 'SYSTEM' | 'SDR_FIND';
  title: string;
  content: string;
  timestamp: string; // ISO Date
}

export interface Customer {
  id: string;
  // Identity
  companyName: string;
  contactFirstName?: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  
  // Metadata
  category: string;
  status: 'LEAD' | 'PROSPECT' | 'CUSTOMER' | 'CHURNED';
  tags: string[];
  
  // Metrics
  rating?: number;
  reviewCount?: number;
  digitalGapScore: number;
  icpFitScore: number;
  
  // AI Intel
  painPoints?: string[];
  salesOpportunities?: string[];
  qualificationSummary?: string;
  
  createdAt: string;
}

export interface Deal {
  id: string;
  customerId: string; // Linked to Customer
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
  customerId?: string;
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
  customerId?: string; // Links to created Customer on approval
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