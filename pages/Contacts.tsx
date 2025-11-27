
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Plus, Search, Building, User, Mail, Phone, Briefcase, X } from 'lucide-react';
import { Contact, Company } from '../types';

export const Contacts: React.FC = () => {
  const { contacts, companies, addContact, addCompany, deleteContact } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  // New Company Form State (Inline)
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCategory, setNewCompanyCategory] = useState('');

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompanyName = (id?: string) => {
    if (!id) return 'No Company';
    return companies.find(c => c.id === id)?.name || 'Unknown Company';
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setTitle('');
    setSelectedCompanyId('');
    setIsCreatingCompany(false);
    setNewCompanyName('');
    setNewCompanyCategory('');
    setIsCreating(false);
  };

  const handleSaveContact = () => {
    let companyIdToUse = selectedCompanyId;

    if (isCreatingCompany && newCompanyName) {
      const newCompany: Company = {
        id: `c-${Date.now()}`,
        name: newCompanyName,
        category: newCompanyCategory || 'Uncategorized',
        tags: [],
        digitalGapScore: 0,
        icpFitScore: 0
      };
      addCompany(newCompany);
      companyIdToUse = newCompany.id;
    }

    const newContact: Contact = {
      id: `ct-${Date.now()}`,
      companyId: companyIdToUse || undefined,
      firstName,
      lastName,
      email,
      phone,
      title,
      status: 'LEAD'
    };

    addContact(newContact);
    resetForm();
  };

  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">New Contact</h1>
          <Button variant="outline" onClick={resetForm}>Cancel</Button>
        </div>

        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">First Name</label>
                <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Last Name</label>
                <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone</label>
                <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-bold mb-1">Job Title</label>
               <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Marketing Manager"
                />
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold">Company Association</label>
                 {!isCreatingCompany && (
                   <button 
                     className="text-xs text-primary font-bold hover:underline"
                     onClick={() => { setIsCreatingCompany(true); setSelectedCompanyId(''); }}
                   >
                     + Create New Company
                   </button>
                 )}
                 {isCreatingCompany && (
                   <button 
                     className="text-xs text-red-500 font-bold hover:underline"
                     onClick={() => setIsCreatingCompany(false)}
                   >
                     Cancel
                   </button>
                 )}
              </div>

              {isCreatingCompany ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                     <input 
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                       value={newCompanyName}
                       onChange={(e) => setNewCompanyName(e.target.value)}
                       placeholder="Company Name"
                     />
                     <input 
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                       value={newCompanyCategory}
                       onChange={(e) => setNewCompanyCategory(e.target.value)}
                       placeholder="Category (e.g. Retail)"
                     />
                  </div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Will create and link this company automatically.
                  </p>
                </div>
              ) : (
                <select 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                  <option value="">-- Select Company --</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button onClick={handleSaveContact} disabled={!firstName || !lastName}>
                Save Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">Contacts</h1>
          <p className="text-gray-500">People driving your deals.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4" /> New Contact
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          className="w-full max-w-md pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:border-primary focus:outline-none transition-colors"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredContacts.map(contact => (
          <Card key={contact.id} className="group hover:border-primary transition-colors">
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 text-lg font-bold">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contact.firstName} {contact.lastName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {contact.title && (
                       <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {contact.title}</span>
                    )}
                    <span className="flex items-center gap-1 font-medium text-primary">
                       <Building className="w-3 h-3" /> {getCompanyName(contact.companyId)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full sm:w-auto items-center justify-between sm:justify-end text-sm">
                <div className="flex flex-col gap-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Mail className="w-3 h-3 text-gray-400" /> {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 justify-end">
                      <Phone className="w-3 h-3 text-gray-400" /> {contact.phone}
                    </div>
                  )}
                </div>
                <Badge variant={contact.status === 'ACTIVE' ? 'success' : 'outline'}>{contact.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            No contacts found.
          </div>
        )}
      </div>
    </div>
  );
};
