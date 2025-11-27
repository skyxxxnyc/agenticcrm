
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Map, Target, Plus, Play, Loader } from 'lucide-react';
import { generateSDRLeads } from '../services/geminiService';
import { ICPProfile, SDRBatch, SDRLead } from '../types';

export const ICPProfiles: React.FC = () => {
  const { icpProfiles, addSDRBatch, addSDRLeads, updateICPProfile } = useStore();
  const [runningProfileId, setRunningProfileId] = useState<string | null>(null);

  const handleRunSDR = async (profile: ICPProfile) => {
    setRunningProfileId(profile.id);
    
    try {
      const result = await generateSDRLeads(profile);
      
      if (result && result.leads.length > 0) {
        const batchId = `batch-${Date.now()}`;
        
        const newBatch: SDRBatch = {
          id: batchId,
          icpProfileId: profile.id,
          name: `${profile.name} Run ${new Date().toLocaleDateString()}`,
          status: 'PENDING_REVIEW',
          runDate: new Date().toISOString(),
          totalCandidates: result.leads.length,
          approvedLeads: 0,
          rejectedLeads: 0
        };

        const newLeads: SDRLead[] = result.leads.map((l: any, idx: number) => ({
            id: `lead-${Date.now()}-${idx}`,
            batchId: batchId,
            companyName: l.companyName,
            category: l.category,
            rating: l.rating,
            reviews: l.reviews,
            address: l.address,
            website: l.website,
            phone: l.phone,
            googleMapsUrl: l.googleMapsUrl, // Passed from service if matched
            status: 'CANDIDATE',
            tier: l.tier || 'B',
            matchScore: l.matchScore || 70,
            qualificationSummary: l.qualificationSummary || 'AI Generated Lead',
            talkingPoints: l.talkingPoints || []
        }));

        addSDRBatch(newBatch);
        addSDRLeads(newLeads);
        updateICPProfile(profile.id, { lastRun: new Date().toISOString() });
        
        alert(`SDR Agent found ${result.leads.length} new leads using Google Maps data!`);
      } else {
        alert("SDR Agent couldn't find leads. Try broadening your geography or category.");
      }
    } catch (e) {
      console.error(e);
      alert("Error running SDR Agent.");
    } finally {
      setRunningProfileId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">Ideal Customer Profiles</h1>
          <p className="text-gray-500">Manage who the SDR Agent targets.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {icpProfiles.map(profile => (
          <Card key={profile.id} className="relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button size="sm" variant="secondary">Edit</Button>
            </div>
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-black dark:border-white">
                  <Target className="w-6 h-6" />
                </div>
                <Badge variant={profile.active ? 'success' : 'outline'}>
                  {profile.active ? 'Active' : 'Paused'}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{profile.name}</h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  {profile.geography}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map(cat => (
                    <span key={cat} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-300 dark:border-gray-700">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                 <div className="text-xs text-gray-400 font-mono">
                   Last run: {profile.lastRun ? new Date(profile.lastRun).toLocaleDateString() : 'Never'}
                 </div>
                 <Button 
                   size="sm" 
                   variant="outline" 
                   onClick={() => handleRunSDR(profile)}
                   disabled={runningProfileId === profile.id}
                 >
                   {runningProfileId === profile.id ? (
                     <><Loader className="w-3 h-3 animate-spin mr-2" /> Scouting...</>
                   ) : (
                     <><Play className="w-3 h-3 mr-2" /> Run Now</>
                   )}
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State / Add New Placeholder */}
        <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors min-h-[250px]">
           <Plus className="w-12 h-12 mb-4 opacity-50" />
           <span className="font-bold">Add New Profile</span>
        </button>
      </div>
    </div>
  );
};
