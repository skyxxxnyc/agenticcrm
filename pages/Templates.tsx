
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Plus, Trash2, Edit2, Search, Copy, Tag } from 'lucide-react';
import { EmailTemplate } from '../types';

export const Templates: React.FC = () => {
  const { emailTemplates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');

  const filteredTemplates = emailTemplates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tpl: EmailTemplate) => {
    setCurrentId(tpl.id);
    setName(tpl.name);
    setSubject(tpl.subject);
    setBody(tpl.body);
    setCategory(tpl.category);
    setTags(tpl.tags.join(', '));
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentId(null);
    setName('');
    setSubject('');
    setBody('');
    setCategory('General');
    setTags('');
    setIsEditing(true);
  };

  const handleSave = () => {
    const templateData = {
      name,
      subject,
      body,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (currentId) {
      updateEmailTemplate(currentId, templateData);
    } else {
      addEmailTemplate({
        id: `tpl-${Date.now()}`,
        ...templateData
      });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteEmailTemplate(id);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{currentId ? 'Edit Template' : 'New Template'}</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="block text-sm font-bold mb-1">Template Name</label>
              <input 
                className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Follow-up #2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Tags (comma separated)</label>
                <input 
                  className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. urgent, cold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Subject Line</label>
              <input 
                className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Body Content</label>
              <textarea 
                className="w-full p-2 border-2 border-black dark:border-white rounded bg-transparent min-h-[200px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Hi {{first_name}}..."
              />
              <p className="text-xs text-gray-500 mt-1">Use {'{{variable}}'} for dynamic insertion.</p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave}>Save Template</Button>
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
          <h1 className="text-3xl font-black">Email Templates</h1>
          <p className="text-gray-500">Manage your reusable email content.</p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          className="w-full max-w-md pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:border-primary focus:outline-none transition-colors"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredTemplates.map(tpl => (
          <Card key={tpl.id} className="group">
            <CardContent className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{tpl.name}</h3>
                  <Badge variant="outline">{tpl.category}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject: {tpl.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{tpl.body}</p>
                <div className="flex gap-2 mt-2">
                   {tpl.tags.map(tag => (
                     <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 flex items-center gap-1">
                       <Tag className="w-3 h-3" /> {tag}
                     </span>
                   ))}
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(tpl.body)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(tpl)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(tpl.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            No templates found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};
