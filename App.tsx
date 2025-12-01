
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DailyBrief } from './pages/DailyBrief';
import { Pipeline } from './pages/Pipeline';
import { SDRBatches } from './pages/SDRBatches';
import { ICPProfiles } from './pages/ICPProfiles';
import { Customers } from './pages/Customers';
import { Templates } from './pages/Templates';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';

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
          <Route path="customers" element={<Customers />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
