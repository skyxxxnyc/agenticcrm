
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Factory, Kanban, Briefcase, Settings, MessageSquare, Menu, X, Sun, Moon, FileText, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { CommandCenter } from '../pages/CommandCenter';
import { OnboardingWizard } from './OnboardingWizard';
import { Button } from './ui/Button';
import { gmailService } from '../services/gmail';

export const Layout: React.FC = () => {
  const { theme, toggleTheme, hasOnboarded, isGmailConnected } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [checkingEmails, setCheckingEmails] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Daily Brief', path: '/' },
    { icon: Users, label: 'ICP Profiles', path: '/icp' },
    { icon: Factory, label: 'SDR Batches', path: '/sdr' },
    { icon: Kanban, label: 'Pipeline', path: '/pipeline' },
    { icon: Briefcase, label: 'Companies', path: '/companies' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.label : 'Agentic CRM';
  };

  // Simulate periodic email checking if connected
  useEffect(() => {
    if (!isGmailConnected) return;

    const interval = setInterval(async () => {
        setCheckingEmails(true);
        await gmailService.checkEmails();
        setCheckingEmails(false);
    }, 30000); // Check every 30s for demo

    return () => clearInterval(interval);
  }, [isGmailConnected]);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100">
      
      {!hasOnboarded && <OnboardingWizard />}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none",
        "bg-surface-light dark:bg-surface-dark border-r-2 border-black dark:border-white flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b-2 border-black dark:border-white">
          <h1 className="text-2xl font-black tracking-tighter uppercase">Agentic<span className="text-primary">CRM</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 font-bold transition-all border-2 border-transparent",
                isActive 
                  ? "bg-primary text-white border-black shadow-neo dark:border-white dark:shadow-neo-dark" 
                  : "hover:bg-gray-100 dark:hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {checkingEmails && (
            <div className="px-6 py-2 text-xs text-gray-500 animate-pulse flex items-center gap-2">
                <Loader className="w-3 h-3 animate-spin" />
                Checking inbox...
            </div>
        )}

        <div className="p-4 border-t-2 border-black dark:border-white">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b-2 border-black dark:border-white bg-surface-light dark:bg-surface-dark shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden sm:block">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setChatOpen(!chatOpen)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Command Center</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
           <Outlet />
        </div>

        {/* Chat Overlay */}
        <div className={cn(
          "fixed right-0 top-16 bottom-0 w-full sm:w-[400px] z-30 transform transition-transform duration-300 ease-in-out border-l-2 border-black dark:border-white bg-surface-light dark:bg-surface-dark shadow-[-4px_0px_0px_0px_rgba(0,0,0,0.2)]",
          chatOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <CommandCenter onClose={() => setChatOpen(false)} />
        </div>

      </main>
    </div>
  );
};
