
import React from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const Settings: React.FC = () => {
  const { resetOnboarding } = useStore();

  const handleReset = () => {
    if (confirm("This will reopen the onboarding wizard. Are you sure?")) {
        resetOnboarding();
        window.location.href = '#/';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Application Preferences</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div>
                            <div className="font-bold">Reset Onboarding Flow</div>
                            <div className="text-sm text-gray-500">Restart the welcome wizard to re-configure agents or connections.</div>
                        </div>
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6 opacity-50 pointer-events-none">
                 <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Advanced Configuration
                 </h2>
                 <p className="text-sm text-gray-500 mb-4">Integrations and Agent Logic settings are managed by code in the MVP version.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};
