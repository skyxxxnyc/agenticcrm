
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { MapPin, Star, Globe, Phone, CheckCircle, XCircle, Briefcase, ArrowUpDown, ChevronUp, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { SDRLead } from '../types';

export const SDRBatches: React.FC = () => {
  const { sdrBatches, sdrLeads, approveSDRLead, rejectSDRLead } = useStore();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof SDRLead | 'rating'; direction: 'asc' | 'desc' }>({ 
    key: 'matchScore', 
    direction: 'desc' 
  });

  const filteredLeads = sdrLeads.filter(lead => {
    if (selectedBatchId !== 'all' && lead.batchId !== selectedBatchId) return false;
    return true;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === undefined || bValue === undefined) return 0;

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const selectedLead = sdrLeads.find(l => l.id === selectedLeadId);

  const handleSort = (key: keyof SDRLead | 'rating') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
           <h1 className="text-3xl font-black">SDR Prospects</h1>
           <p className="text-gray-500">Review and qualify leads found by the AI agent.</p>
        </div>
        <Button onClick={() => window.location.hash = '#/icp'}>New Prospecting Run</Button>
      </div>

      <div className="flex items-center gap-2 mb-4 shrink-0 overflow-x-auto pb-2 no-scrollbar">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-bold mr-2">Batch:</span>
        <button 
          onClick={() => setSelectedBatchId('all')}
          className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-full border border-black dark:border-white whitespace-nowrap transition-all",
            selectedBatchId === 'all' 
              ? "bg-black text-white dark:bg-white dark:text-black shadow-neo-sm dark:shadow-neo-sm-dark" 
              : "bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          All Batches
        </button>
        {sdrBatches.map(batch => (
          <button
            key={batch.id}
            onClick={() => setSelectedBatchId(batch.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-full border border-black dark:border-white whitespace-nowrap transition-all",
              selectedBatchId === batch.id 
                ? "bg-black text-white dark:bg-white dark:text-black shadow-neo-sm dark:shadow-neo-sm-dark" 
                : "bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {batch.name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          selectedLeadId ? "hidden lg:flex lg:w-1/2" : "w-full"
        )}>
           <div className="flex-1 overflow-auto border-2 border-black dark:border-white bg-surface-light dark:bg-surface-dark shadow-neo dark:shadow-neo-dark">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[30%] group" onClick={() => handleSort('companyName')}>
                    <div className="flex items-center">Company <SortIcon column="companyName" /></div>
                  </TableHead>
                  <TableHead className="w-[15%] group" onClick={() => handleSort('rating')}>
                    <div className="flex items-center">Rating <SortIcon column="rating" /></div>
                  </TableHead>
                  <TableHead className="w-[15%] group" onClick={() => handleSort('matchScore')}>
                    <div className="flex items-center">Score <SortIcon column="matchScore" /></div>
                  </TableHead>
                  <TableHead className="w-[15%] group" onClick={() => handleSort('tier')}>
                    <div className="flex items-center">Tier <SortIcon column="tier" /></div>
                  </TableHead>
                  <TableHead className="w-[15%] group" onClick={() => handleSort('status')}>
                     <div className="flex items-center">Status <SortIcon column="status" /></div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeads.length > 0 ? (
                  sortedLeads.map(lead => (
                    <TableRow 
                      key={lead.id} 
                      className={cn(
                        "cursor-pointer",
                        selectedLeadId === lead.id && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <TableCell>
                        <div className="font-bold">{lead.companyName}</div>
                        <div className="text-xs text-gray-500">{lead.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {lead.rating} <span className="text-gray-400">({lead.reviews})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "font-black font-mono",
                          lead.matchScore >= 80 ? "text-green-600" : lead.matchScore >= 50 ? "text-yellow-600" : "text-gray-400"
                        )}>
                          {lead.matchScore}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.tier === 'A' ? 'success' : lead.tier === 'B' ? 'warning' : 'default'}>
                          {lead.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <Badge variant={lead.status === 'APPROVED' ? 'success' : lead.status === 'REJECTED' ? 'danger' : 'outline'}>
                           {lead.status}
                         </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                     <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        No leads found matching your filters.
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
           </div>
           <div className="text-xs text-gray-500 mt-2 text-right">
              Showing {sortedLeads.length} leads
           </div>
        </div>

        {selectedLead && (
          <div className={cn(
             "w-full lg:w-1/2 flex flex-col bg-surface-light dark:bg-surface-dark border-2 border-black dark:border-white shadow-neo dark:shadow-neo-dark overflow-hidden absolute lg:static inset-0 lg:inset-auto z-20 h-full",
             !selectedLeadId && "hidden"
          )}>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b-2 border-black dark:border-white bg-gray-50 dark:bg-gray-800 shrink-0">
                <div className="flex justify-between items-start mb-4">
                   <button 
                     onClick={() => setSelectedLeadId(null)}
                     className="lg:hidden mb-2 text-gray-500 flex items-center gap-1 text-sm font-bold"
                   >
                     <X className="w-4 h-4" /> Close
                   </button>
                   <div className="w-full flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black leading-tight mb-1">{selectedLead.companyName}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="bg-white dark:bg-gray-700 px-2 py-0.5 border border-gray-200 dark:border-gray-600 rounded text-xs font-mono">{selectedLead.category}</span>
                          <span className="text-yellow-500 flex items-center text-xs font-bold">
                            <Star className="w-3 h-3 fill-current mr-0.5" /> {selectedLead.rating} ({selectedLead.reviews})
                          </span>
                          {selectedLead.phone && (
                            <span className="flex items-center gap-1 ml-2">
                                <Phone className="w-3 h-3" /> {selectedLead.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {selectedLead.status === 'APPROVED' ? (
                              <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => {
                                window.location.hash = '#/customers';
                              }}
                            >
                              <Briefcase className="w-4 h-4 mr-2" /> View Customer
                            </Button>
                        ) : (
                            <>
                                <Button 
                                size="sm" 
                                variant="primary" 
                                onClick={() => approveSDRLead(selectedLead.id)}
                                >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                </Button>
                                <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => rejectSDRLead(selectedLead.id)}
                                >
                                <XCircle className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    {selectedLead.googleMapsUrl && (
                      <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => window.open(selectedLead.googleMapsUrl, '_blank')} 
                          className="text-xs h-8 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                      >
                          <MapPin className="w-3.5 h-3.5 mr-2" /> Google Maps
                      </Button>
                    )}
                    {selectedLead.website && (
                      <Button size="sm" variant="outline" onClick={() => window.open(selectedLead.website?.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`, '_blank')} className="text-xs h-8">
                          <Globe className="w-3.5 h-3.5 mr-2" /> Visit Website
                      </Button>
                    )}
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <section>
                  <h3 className="font-bold text-lg mb-2">AI Analysis</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm leading-relaxed">
                    {selectedLead.qualificationSummary}
                  </div>
                </section>
                <section>
                   <h3 className="font-bold text-lg mb-2">Talking Points</h3>
                   <ul className="space-y-2">
                     {selectedLead.talkingPoints.map((tp, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-sm">
                         <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full mt-1.5 shrink-0" />
                         {tp}
                       </li>
                     ))}
                   </ul>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
