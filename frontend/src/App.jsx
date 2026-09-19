import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './hooks/useDashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import RequestTester from './pages/RequestTester';
import RequestHistory from './pages/RequestHistory';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <div className="flex min-h-screen bg-dark-900">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Navbar />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:clientId" element={<ClientDetails />} />
                <Route path="/request-tester" element={<RequestTester />} />
                <Route path="/request-history" element={<RequestHistory />} />
              </Routes>
            </main>
          </div>
          <Toast />
        </div>
      </DashboardProvider>
    </BrowserRouter>
  );
}
