
import { create } from 'zustand';
import { Customer, Deal, ICPProfile, SDRBatch, SDRLead, Task, ChatMessage, EmailTemplate, Activity } from '../types';
import { MOCK_CUSTOMERS, MOCK_DEALS, MOCK_ICP_PROFILES, MOCK_SDR_BATCHES, MOCK_SDR_LEADS, MOCK_TASKS, MOCK_TEMPLATES, MOCK_ACTIVITIES } from '../services/mockData';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  isGmailConnected: boolean;
  setGmailConnected: (status: boolean) => void;

  // Data
  customers: Customer[];
  activities: Activity[];
  deals: Deal[];
  tasks: Task[];
  icpProfiles: ICPProfile[];
  sdrBatches: SDRBatch[];
  sdrLeads: SDRLead[];
  emailTemplates: EmailTemplate[];
  
  // Chat
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Actions
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addICPProfile: (profile: ICPProfile) => void;
  updateICPProfile: (id: string, updates: Partial<ICPProfile>) => void;
  
  // Customer Actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Activity Actions
  addActivity: (activity: Activity) => void;
  
  // SDR Actions
  addSDRBatch: (batch: SDRBatch) => void;
  addSDRLeads: (leads: SDRLead[]) => void;
  approveSDRLead: (id: string) => void;
  rejectSDRLead: (id: string) => void;

  // Template Actions
  addEmailTemplate: (template: EmailTemplate) => void;
  updateEmailTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteEmailTemplate: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  hasOnboarded: false, 
  completeOnboarding: () => set({ hasOnboarded: true }),
  resetOnboarding: () => set({ hasOnboarded: false }),

  isGmailConnected: false,
  setGmailConnected: (status) => set({ isGmailConnected: status }),

  customers: MOCK_CUSTOMERS,
  activities: MOCK_ACTIVITIES,
  deals: MOCK_DEALS,
  tasks: MOCK_TASKS,
  icpProfiles: MOCK_ICP_PROFILES,
  sdrBatches: MOCK_SDR_BATCHES,
  sdrLeads: MOCK_SDR_LEADS,
  emailTemplates: MOCK_TEMPLATES,
  
  chatHistory: [
    {
      id: 'welcome',
      role: 'model',
      content: 'Hello! I am your Agentic CRM assistant. How can I help you drive revenue today?',
      timestamp: Date.now()
    }
  ],
  addChatMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
  clearChat: () => set({ chatHistory: [] }),

  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
  updateDeal: (id, updates) => set((state) => ({
    deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
  })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  addICPProfile: (profile) => set((state) => ({ icpProfiles: [...state.icpProfiles, profile] })),
  updateICPProfile: (id, updates) => set((state) => ({
    icpProfiles: state.icpProfiles.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCustomer: (id) => set((state) => ({ customers: state.customers.filter(c => c.id !== id) })),

  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),

  addSDRBatch: (batch) => set((state) => ({ sdrBatches: [batch, ...state.sdrBatches] })),
  addSDRLeads: (leads) => set((state) => ({ sdrLeads: [...state.sdrLeads, ...leads] })),

  approveSDRLead: (id) => set((state) => {
    const lead = state.sdrLeads.find(l => l.id === id);
    if (lead && lead.status !== 'APPROVED') {
       // Auto-create customer from lead
       const newCustomer: Customer = {
         id: `cust-${Date.now()}`,
         companyName: lead.companyName,
         category: lead.category,
         rating: lead.rating,
         reviewCount: lead.reviews,
         address: lead.address,
         website: lead.website,
         phone: lead.phone,
         tags: ['sdr_sourced', `tier_${lead.tier.toLowerCase()}`],
         digitalGapScore: 50, // Default
         icpFitScore: lead.matchScore,
         painPoints: lead.talkingPoints,
         salesOpportunities: [],
         status: 'LEAD',
         createdAt: new Date().toISOString()
       };

       const activity: Activity = {
           id: `act-${Date.now()}`,
           customerId: newCustomer.id,
           type: 'SDR_FIND',
           title: 'Lead Approved',
           content: `SDR Agent sourced this lead. Match score: ${lead.matchScore}.`,
           timestamp: new Date().toISOString()
       };

       return {
         sdrLeads: state.sdrLeads.map(l => l.id === id ? { ...l, status: 'APPROVED', customerId: newCustomer.id } : l),
         customers: [...state.customers, newCustomer],
         activities: [activity, ...state.activities]
       };
    }
    return {
      sdrLeads: state.sdrLeads.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l)
    };
  }),
  rejectSDRLead: (id) => set((state) => ({
    sdrLeads: state.sdrLeads.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l)
  })),

  addEmailTemplate: (template) => set((state) => ({ emailTemplates: [...state.emailTemplates, template] })),
  updateEmailTemplate: (id, updates) => set((state) => ({
    emailTemplates: state.emailTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteEmailTemplate: (id) => set((state) => ({
    emailTemplates: state.emailTemplates.filter(t => t.id !== id)
  })),
}));
