
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Check, Clock, Edit2, AlertTriangle, PlayCircle, Save, FileText, ChevronDown, Send as SendIcon, Loader, Sparkles } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { Priority, EmailTemplate } from '../types';
import { gmailService } from '../services/gmail';
import { generateOutreachEmail } from '../services/geminiService';

export const DailyBrief: React.FC = () => {
  const { deals, tasks, sdrBatches, emailTemplates, companies, contacts, addEmailTemplate, isGmailConnected } = useStore();
  
  // State for template dropdowns per deal
  const [openTemplateDropdown, setOpenTemplateDropdown] = useState<string | null>(null);
  const [sendingState, setSendingState] = useState<{[key: string]: boolean}>({});
  
  // State for AI drafts
  const [generatedDrafts, setGeneratedDrafts] = useState<{[key: string]: string}>({});
  const [isGenerating, setIsGenerating] = useState<{[key: string]: boolean}>({});

  // Filter for demo logic
  const priorityFollowUps = deals.filter(d => d.priority === Priority.HIGH && d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST');
  const atRiskDeals = deals.filter(d => {
    if (!d.lastTouchDate) return false;
    const daysSinceTouch = (new Date().getTime() - new Date(d.lastTouchDate).getTime()) / (1000 * 3600 * 24);
    return daysSinceTouch > 10;
  });

  const handleGenerateDraft = async (deal: any) => {
      setIsGenerating(prev => ({ ...prev, [deal.id]: true }));
      
      const contact = contacts.find(c => c.id === deal.contactId);
      const company = companies.find(c => c.id === deal.companyId);
      
      const contactName = contact ? `${contact.firstName} ${contact.lastName}` : "Prospective Client";
      const companyName = company ? company.name : "their company";

      const draft = await generateOutreachEmail(deal, contactName, companyName, company);
      setGeneratedDrafts(prev => ({ ...prev, [deal.id]: draft }));
      setIsGenerating(prev => ({ ...prev, [deal.id]: false }));
  };

  const handleSaveAsTemplate = (dealName: string, content: string) => {
    const name = prompt("Enter a name for this template:", `Follow up for ${dealName}`);
    if (name) {
      addEmailTemplate({
        id: `tpl-${Date.now()}`,
        name,
        subject: "Follow up", // In a real app we'd parse this or ask for it
        body: content,
        category: 'Follow-up',
        tags: ['generated'],
        lastUsed: new Date().toISOString()
      });
      alert('Template saved!');
    }
  };

  const handleApplyTemplate = (dealId: string, template: EmailTemplate) => {
     setGeneratedDrafts(prev => ({ ...prev, [dealId]: template.body }));
     setOpenTemplateDropdown(null);
  };

  const handleApproveAndSend = async (dealId: string, contactEmail: string | undefined) => {
    if (!isGmailConnected) {
        alert("Please connect Gmail in Settings or Onboarding first.");
        return;
    }
    // For demo, we might use a mock email if contact doesn't have one, but we prefer real data structure
    const targetEmail = contactEmail || "demo@example.com";

    setSendingState(prev => ({ ...prev, [dealId]: true }));
    try {
        await gmailService.sendEmail(targetEmail, "Follow Up", generatedDrafts[dealId] || "Draft");
        alert("Email sent successfully!");
        // Here we would typically move deal stage or update lastTouchDate
    } catch (e) {
        alert("Failed to send email.");
    } finally {
        setSendingState(prev => ({ ...prev, [dealId]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-1">Good morning, Agent</h1>
          <p className="text-gray-500 dark:text-gray-400 font-mono">Here is your mission briefing for today.</p>
        </div>
        <Button variant="outline" className="hidden sm:flex">
          <PlayCircle className="w-4 h-4 mr-2" />
          Run Analysis
        </Button>
      </div>

      {/* Priority Follow Ups */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/>
          Priority Follow-Ups
        </h2>
        <div className="grid gap-4">
          {priorityFollowUps.length === 0 ? (
            <Card className="bg-gray-50 dark:bg-gray-900 border-dashed">
              <CardContent className="py-6 text-center text-gray-500">No priority follow-ups pending.</CardContent>
            </Card>
          ) : (
            priorityFollowUps.map(deal => {
              const draftContent = generatedDrafts[deal.id] || "";
              const isSending = sendingState[deal.id];
              const generating = isGenerating[deal.id];
              const contact = contacts.find(c => c.id === deal.contactId);

              return (
                <Card key={deal.id} className="border-l-8 border-l-red-500">
                  <CardContent className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{deal.name}</h3>
                        <Badge variant="danger">HIGH PRIORITY</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Last interaction: {formatDate(deal.lastTouchDate || '')} • Stage: {deal.stage}
                      </p>
                      
                      {/* Draft Area */}
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 mb-3 relative group min-h-[100px] flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                             <Sparkles className="w-3 h-3 text-purple-500" /> AI Draft Suggestion
                          </span>
                          <div className="flex gap-1">
                             {/* Load Template Dropdown */}
                             <div className="relative">
                               <button 
                                 className="text-xs flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                                 onClick={() => setOpenTemplateDropdown(openTemplateDropdown === deal.id ? null : deal.id)}
                               >
                                 <FileText className="w-3 h-3" /> Load Template <ChevronDown className="w-3 h-3" />
                               </button>
                               
                               {openTemplateDropdown === deal.id && (
                                 <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border-2 border-black dark:border-white shadow-neo z-10 rounded overflow-hidden">
                                   {emailTemplates.length > 0 ? emailTemplates.map(tpl => (
                                     <button 
                                       key={tpl.id}
                                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
                                       onClick={() => handleApplyTemplate(deal.id, tpl)}
                                     >
                                       {tpl.name}
                                     </button>
                                   )) : (
                                     <div className="p-2 text-xs text-gray-400">No templates found</div>
                                   )}
                                 </div>
                               )}
                             </div>

                             <div className="w-px h-3 bg-gray-300 mx-1 self-center" />
                             
                             <button 
                               className="text-xs flex items-center gap-1 text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                               onClick={() => handleSaveAsTemplate(deal.name, draftContent)}
                               disabled={!draftContent}
                             >
                               <Save className="w-3 h-3" /> Save as Template
                             </button>
                          </div>
                        </div>
                        
                        {generating ? (
                            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 gap-2">
                                <Loader className="w-4 h-4 animate-spin" /> Writing draft...
                            </div>
                        ) : draftContent ? (
                            <p className="text-sm italic font-mono whitespace-pre-wrap">{draftContent}</p>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <Button size="sm" variant="secondary" onClick={() => handleGenerateDraft(deal)}>
                                    <Sparkles className="w-3 h-3 mr-2 text-purple-500" /> Generate with AI
                                </Button>
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="w-full sm:w-auto"
                        onClick={() => handleApproveAndSend(deal.id, contact?.email)}
                        disabled={isSending || !draftContent}
                      >
                        {isSending ? 'Sending...' : (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Approve & Send
                            </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full sm:w-auto">
                        <Clock className="w-4 h-4 mr-2" /> Snooze
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* At Risk Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           <AlertTriangle className="w-5 h-5 text-yellow-500" />
           At Risk Deals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {atRiskDeals.map(deal => (
            <Card key={deal.id} className="bg-yellow-50 dark:bg-yellow-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{deal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">No contact for 10+ days. Value: ${deal.value}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generate Re-engagement Email
                </Button>
              </CardContent>
            </Card>
          ))}
          {atRiskDeals.length === 0 && (
             <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
               Pipeline looks healthy. Good job.
             </div>
          )}
        </div>
      </section>

      {/* Recent Batches */}
      <section>
        <h2 className="text-xl font-bold mb-4">SDR Activity</h2>
        <div className="grid gap-4">
           {sdrBatches.map(batch => (
             <Card key={batch.id}>
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="font-bold">{batch.name}</h3>
                   <p className="text-sm text-gray-500">Run: {formatDate(batch.runDate)}</p>
                 </div>
                 <div className="text-right">
                   <div className="text-2xl font-black">{batch.totalCandidates}</div>
                   <div className="text-xs uppercase font-bold tracking-wider">Candidates</div>
                 </div>
                 <Button variant="secondary" size="sm" onClick={() => window.location.hash = '#/sdr'}>
                   Review Leads
                 </Button>
               </div>
             </Card>
           ))}
        </div>
      </section>
    </div>
  );
};
