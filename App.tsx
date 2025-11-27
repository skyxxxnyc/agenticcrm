
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DailyBrief } from './pages/DailyBrief';
import { Pipeline } from './pages/Pipeline';
import { SDRBatches } from './pages/SDRBatches';
import { ICPProfiles } from './pages/ICPProfiles';
import { Companies } from './pages/Companies';
import { Templates } from './pages/Templates';
import { Contacts } from './pages/Contacts';
import { useStore } from './store/useStore';

const SettingsStub = () => <div className="p-8 text-center text-gray-500">Settings Module (Coming Soon)</div>;

const App: React.FC = () => {
  const { theme } = useStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DailyBrief />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="sdr" element={<SDRBatches />} />
          <Route path="icp" element={<ICPProfiles />} />
          <Route path="companies" element={<Companies />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<SettingsStub />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
