
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Plus, MapPin, Globe, Phone, Mail, Clock, MessageSquare, Briefcase, Star, User } from 'lucide-react';
import { Customer, Activity } from '../types';
import { formatDate, cn } from '../lib/utils';

export const Customers: React.FC = () => {
  const { customers, activities, addCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // New Customer State
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerActivities = activities
    .filter(a => a.customerId === selectedCustomerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleCreate = () => {
      const nc: Customer = {
          id: `cust-${Date.now()}`,
          companyName: newCustomerName,
          email: newCustomerEmail,
          category: 'Uncategorized',
          tags: [],
          status: 'LEAD',
          digitalGapScore: 0,
          icpFitScore: 0,
          createdAt: new Date().toISOString()
      };
      addCustomer(nc);
      setIsCreating(false);
      setNewCustomerName('');
      setNewCustomerEmail('');
      setSelectedCustomerId(nc.id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* List Column */}
      <div className={cn("flex flex-col gap-4 transition-all duration-300", selectedCustomer ? "w-full lg:w-1/3 hidden lg:flex" : "w-full")}>
        <div className="flex justify-between items-center shrink-0">
           <h1 className="text-3xl font-black">Customers</h1>
           <Button size="sm" onClick={() => setIsCreating(true)}><Plus className="w-4 h-4" /></Button>
        </div>

        {isCreating && (
            <Card className="animate-in fade-in slide-in-from-top-4">
                <CardContent className="p-4 space-y-3">
                    <input 
                        className="w-full p-2 border border-black dark:border-white bg-transparent"
                        placeholder="Company Name"
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                    />
                    <input 
                        className="w-full p-2 border border-black dark:border-white bg-transparent"
                        placeholder="Email (Optional)"
                        value={newCustomerEmail}
                        onChange={e => setNewCustomerEmail(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleCreate} disabled={!newCustomerName}>Save</Button>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="relative shrink-0">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent"
             placeholder="Search customers..."
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredCustomers.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-all hover:translate-x-1",
                      selectedCustomerId === c.id 
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800 shadow-neo-sm dark:shadow-neo-sm-dark" 
                        : "border-transparent bg-white dark:bg-surface-dark hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold">{c.companyName}</h3>
                        <Badge variant={c.status === 'CUSTOMER' ? 'success' : 'outline'} className="text-[10px]">{c.status}</Badge>
                    </div>
                    {c.contactFirstName && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" /> {c.contactFirstName} {c.contactLastName}
                        </div>
                    )}
                    <div className="mt-2 flex gap-2">
                        {c.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-500">{t}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Detail Column */}
      {selectedCustomer ? (
          <div className="flex-1 bg-surface-light dark:bg-surface-dark border-2 border-black dark:border-white shadow-neo dark:shadow-neo-dark flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b-2 border-black dark:border-white bg-gray-50 dark:bg-gray-800 shrink-0">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Button size="sm" variant="ghost" className="lg:hidden mb-2 pl-0" onClick={() => setSelectedCustomerId(null)}>← Back</Button>
                        <h2 className="text-3xl font-black">{selectedCustomer.companyName}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {selectedCustomer.category}</span>
                            {selectedCustomer.rating && (
                                <span className="flex items-center gap-1 text-yellow-600 font-bold"><Star className="w-3 h-3 fill-current" /> {selectedCustomer.rating}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Edit</Button>
                        <Button>New Activity</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        {selectedCustomer.website && (
                             <a href={`https://${selectedCustomer.website}`} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                                 <Globe className="w-4 h-4" /> {selectedCustomer.website}
                             </a>
                        )}
                        {selectedCustomer.address && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4" /> {selectedCustomer.address}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        {selectedCustomer.email && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" /> {selectedCustomer.email}
                            </div>
                        )}
                         {selectedCustomer.phone && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4" /> {selectedCustomer.phone}
                            </div>
                        )}
                    </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Activity Timeline
                </h3>
                
                <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                    {customerActivities.map(act => (
                        <div key={act.id} className="relative">
                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-black dark:border-white bg-white dark:bg-gray-800 z-10" />
                            <div className="mb-1 text-xs text-gray-400 font-mono">{formatDate(act.timestamp)}</div>
                            <div className="p-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-2 mb-2 font-bold">
                                    <Badge variant="outline" className="text-[10px]">{act.type}</Badge>
                                    {act.title}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {act.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {customerActivities.length === 0 && (
                        <div className="text-sm text-gray-500 italic">No activity recorded yet.</div>
                    )}
                </div>
             </div>
          </div>
      ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              Select a customer to view details
          </div>
      )}
    </div>
  );
};
