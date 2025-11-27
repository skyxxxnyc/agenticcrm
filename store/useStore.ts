
import { create } from 'zustand';
import { Company, Contact, Deal, ICPProfile, SDRBatch, SDRLead, Task, ChatMessage, EmailTemplate } from '../types';
import { MOCK_COMPANIES, MOCK_CONTACTS, MOCK_DEALS, MOCK_ICP_PROFILES, MOCK_SDR_BATCHES, MOCK_SDR_LEADS, MOCK_TASKS, MOCK_TEMPLATES } from '../services/mockData';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  hasOnboarded: boolean;
  completeOnboarding: () => void;

  isGmailConnected: boolean;
  setGmailConnected: (status: boolean) => void;

  // Data
  companies: Company[];
  contacts: Contact[];
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
  addCompany: (company: Company) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addICPProfile: (profile: ICPProfile) => void;
  updateICPProfile: (id: string, updates: Partial<ICPProfile>) => void;
  
  // Contact Actions
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
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

  isGmailConnected: false,
  setGmailConnected: (status) => set({ isGmailConnected: status }),

  companies: MOCK_COMPANIES,
  contacts: MOCK_CONTACTS,
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
  addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  addICPProfile: (profile) => set((state) => ({ icpProfiles: [...state.icpProfiles, profile] })),
  updateICPProfile: (id, updates) => set((state) => ({
    icpProfiles: state.icpProfiles.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
  updateContact: (id, updates) => set((state) => ({
    contacts: state.contacts.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteContact: (id) => set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) })),

  addSDRBatch: (batch) => set((state) => ({ sdrBatches: [batch, ...state.sdrBatches] })),
  addSDRLeads: (leads) => set((state) => ({ sdrLeads: [...state.sdrLeads, ...leads] })),

  approveSDRLead: (id) => set((state) => {
    // When approving, we should ideally convert to Company/Contact, but for now just mark status
    const lead = state.sdrLeads.find(l => l.id === id);
    if (lead && lead.status !== 'APPROVED') {
       // Auto-create company from lead
       const newCompany: Company = {
         id: `comp-${Date.now()}`,
         name: lead.companyName,
         category: lead.category,
         rating: lead.rating,
         reviewCount: lead.reviews,
         address: lead.address,
         websiteUrl: lead.website,
         phone: lead.phone,
         tags: ['sdr_sourced', `tier_${lead.tier.toLowerCase()}`],
         digitalGapScore: 50, // Default
         icpFitScore: lead.matchScore,
         painPoints: lead.talkingPoints,
         salesOpportunities: []
       };
       return {
         sdrLeads: state.sdrLeads.map(l => l.id === id ? { ...l, status: 'APPROVED', companyId: newCompany.id } : l),
         companies: [...state.companies, newCompany]
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
