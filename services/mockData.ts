
import { Customer, Deal, DealStage, ICPProfile, PackageTier, Priority, SDRBatch, SDRLead, Task, EmailTemplate, Activity } from '../types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    companyName: 'Apex Plumbing',
    contactFirstName: 'Joe',
    contactLastName: 'Plumber',
    email: 'joe@apexplumbingnyc.com',
    phone: '(212) 555-0123',
    website: 'apexplumbingnyc.com',
    category: 'Plumber',
    rating: 4.2,
    reviewCount: 28,
    status: 'PROSPECT',
    tags: ['local_service', 'outdated_site'],
    digitalGapScore: 65,
    icpFitScore: 80,
    painPoints: ['No online booking', 'Bad mobile view'],
    salesOpportunities: ['Web redesign', 'Booking automation'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    companyName: 'Elite Chiropractic',
    contactFirstName: 'Sarah',
    contactLastName: 'Smith',
    email: 'dr.sarah@elitechiro.com',
    website: 'elitechiro.com',
    category: 'Chiropractor',
    rating: 4.8,
    reviewCount: 150,
    status: 'CUSTOMER',
    tags: ['high_volume', 'good_reputation'],
    digitalGapScore: 30,
    icpFitScore: 90,
    painPoints: ['Manual review requests'],
    salesOpportunities: ['Review automation', 'Email marketing'],
    createdAt: new Date().toISOString()
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    customerId: 'c1',
    type: 'EMAIL',
    title: 'Outreach Email Sent',
    content: 'Sent initial audit proposal regarding website mobile responsiveness.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'a2',
    customerId: 'c1',
    type: 'SDR_FIND',
    title: 'Discovered by SDR Agent',
    content: 'Identified via Google Maps in "NYC Plumbers" batch. High digital gap detected.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    customerId: 'c1',
    name: 'Apex Web Redesign',
    value: 5000,
    stage: DealStage.CONTACTED,
    priority: Priority.HIGH,
    packageFit: PackageTier.STANDARD,
    mqlScore: 75,
    lastTouchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    nextAction: 'Follow up email',
    nextActionDate: new Date().toISOString()
  },
  {
    id: 'd2',
    customerId: 'c2',
    name: 'Elite Review Automation',
    value: 12000,
    stage: DealStage.QUALIFIED,
    priority: Priority.MEDIUM,
    packageFit: PackageTier.PREMIUM,
    mqlScore: 90,
    lastTouchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    nextAction: 'Schedule demo',
    nextActionDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    dealId: 'd1',
    customerId: 'c1',
    title: 'Draft follow-up for Apex',
    dueDate: new Date().toISOString(),
    priority: Priority.HIGH,
    status: 'PENDING',
    agentGenerated: true
  }
];

export const MOCK_ICP_PROFILES: ICPProfile[] = [
  {
    id: 'icp1',
    name: 'NYC Plumbers',
    geography: 'New York, NY',
    categories: ['Plumber', 'HVAC'],
    targetPackage: PackageTier.STANDARD,
    active: true,
    lastRun: new Date().toISOString()
  }
];

export const MOCK_SDR_BATCHES: SDRBatch[] = [
  {
    id: 'b1',
    icpProfileId: 'icp1',
    name: 'Weekly Run - Oct 24',
    status: 'PENDING_REVIEW',
    runDate: new Date().toISOString(),
    totalCandidates: 54,
    approvedLeads: 0,
    rejectedLeads: 0
  }
];

export const MOCK_SDR_LEADS: SDRLead[] = [
  {
    id: 'l1',
    batchId: 'b1',
    companyName: 'Brooklyn Pipes',
    category: 'Plumber',
    rating: 3.5,
    reviews: 12,
    status: 'CANDIDATE',
    tier: 'A',
    matchScore: 88,
    qualificationSummary: 'Strong fit. Website is broken. 12 reviews indicate established business but poor digital mgmt.',
    talkingPoints: ['Mention broken mobile menu', 'Ask about missed calls']
  },
  {
    id: 'l2',
    batchId: 'b1',
    companyName: 'Mario Bros Plumbing',
    category: 'Plumber',
    rating: 4.9,
    reviews: 200,
    status: 'CANDIDATE',
    tier: 'C',
    matchScore: 45,
    qualificationSummary: 'Already dominant. Likely has agency.',
    talkingPoints: []
  }
];

export const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl1',
    name: 'Cold Outreach - Website Gap',
    subject: 'Question about {{company_name}} website',
    body: "Hi {{first_name}},\n\nI noticed your website hasn't been updated in a while and might be missing out on mobile traffic. We help local businesses like yours modernize their digital presence.\n\nAre you open to a 5-min audit?",
    category: 'Outreach',
    tags: ['cold', 'website'],
    lastUsed: new Date().toISOString()
  },
  {
    id: 'tpl2',
    name: 'Follow-up - No Response',
    subject: 'Touching base',
    body: "Hi {{first_name}},\n\nJust floating this to the top of your inbox. Did you have a chance to look at the proposal?\n\nBest,\n[Your Name]",
    category: 'Follow-up',
    tags: ['nudge'],
    lastUsed: new Date(Date.now() - 86400000).toISOString()
  }
];
