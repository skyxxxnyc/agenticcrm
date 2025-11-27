
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { ICPProfile, PackageTier } from '../types';
import { ArrowRight, Check, Zap, Target, LayoutDashboard, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { gmailService } from '../services/gmail';

export const OnboardingWizard: React.FC = () => {
  const { completeOnboarding, addICPProfile, isGmailConnected, setGmailConnected } = useStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State for ICP
  const [icpName, setIcpName] = useState('Local Businesses');
  const [icpGeo, setIcpGeo] = useState('New York, NY');
  const [icpCategory, setIcpCategory] = useState('Plumber');

  const handleConnectGoogle = async () => {
    setIsLoading(true);
    try {
        const success = await gmailService.connect();
        if (success) {
            setGmailConnected(true);
        }
    } catch (e) {
        console.error("Connection failed");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateICP = () => {
    const newProfile: ICPProfile = {
      id: `icp-${Date.now()}`,
      name: icpName,
      geography: icpGeo,
      categories: [icpCategory],
      targetPackage: PackageTier.STANDARD,
      active: true,
      lastRun: undefined
    };
    addICPProfile(newProfile);
    setStep(4);
  };

  const StepIndicator = () => (
    <div className="flex gap-2 mb-8 justify-center">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={cn(
          "h-2 rounded-full transition-all duration-300",
          i === step ? "w-8 bg-primary" : "w-2 bg-gray-300 dark:bg-gray-700",
          i < step ? "bg-primary/50" : ""
        )} />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/90 backdrop-blur-md p-4">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-black dark:border-white animate-in fade-in zoom-in duration-300">
        <CardContent className="p-8">
          <StepIndicator />

          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black uppercase">Agentic CRM</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Welcome to your AI-powered Chief of Staff. <br/>
                We'll help you find leads, automate follow-ups, and close deals while you sleep.
              </p>
              <Button size="lg" className="w-full" onClick={() => setStep(2)}>
                Let's Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: INTEGRATION */}
          {step === 2 && (
            <div className="space-y-6">
               <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Connect Your World</h2>
                <p className="text-gray-500">Give your agents access to your email and calendar to automate tasks.</p>
              </div>

              <div className="space-y-4">
                <div className={cn(
                  "p-4 border-2 rounded-lg flex items-center justify-between transition-all",
                  isGmailConnected 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex flex-col text-left">
                       <span className="font-bold">Google Workspace</span>
                       <span className="text-xs text-gray-500">Gmail & Calendar</span>
                    </div>
                  </div>
                  {isGmailConnected ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Button size="sm" onClick={handleConnectGoogle} disabled={isLoading}>
                      {isLoading ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full" 
                onClick={() => setStep(3)}
                disabled={!isGmailConnected}
              >
                Next Step
              </Button>
            </div>
          )}

          {/* STEP 3: FIRST AGENT */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Deploy SDR Agent</h2>
                <p className="text-gray-500">Tell your AI scout who to find on Google Maps.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Target Audience Name</label>
                  <input 
                    className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                    value={icpName}
                    onChange={(e) => setIcpName(e.target.value)}
                    placeholder="e.g. Downtown Cafes"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Business Category</label>
                    <input 
                      className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                      value={icpCategory}
                      onChange={(e) => setIcpCategory(e.target.value)}
                      placeholder="e.g. Coffee Shop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Location</label>
                    <input 
                      className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                      value={icpGeo}
                      onChange={(e) => setIcpGeo(e.target.value)}
                      placeholder="e.g. Austin, TX"
                    />
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCreateICP}>
                <Target className="w-4 h-4 mr-2" /> Activate Agent
              </Button>
            </div>
          )}

          {/* STEP 4: DAILY BRIEF TUTORIAL */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-accent-success text-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black">All Systems Go</h2>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left text-sm space-y-2 border border-gray-200 dark:border-gray-700">
                <p className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" /> 
                  Your Daily Brief is ready.
                </p>
                <p className="text-gray-600 dark:text-gray-400 pl-4">
                  It prioritizes your day: follow-ups, new leads, and urgent tasks. 
                  Check it every morning to stay on top of revenue.
                </p>
              </div>

              <Button size="lg" className="w-full" onClick={completeOnboarding}>
                Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
