import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AiAnalystView } from './components/AiAnalystView';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { AuthView } from './components/AuthView';
import { Tenant, ViewState, DashboardData } from './types';

// --- MOCK DATA FACTORY ---
// In a real app, this would come from an API/Database
const generateMockData = (tenantId: string): DashboardData => {
  const isEnterprise = tenantId === 't3';
  return {
    tenantId,
    totalRevenue: isEnterprise ? 1250000 : 45000,
    activeUsers: isEnterprise ? 5400 : 120,
    mrr: isEnterprise ? 110000 : 3800,
    churnRate: isEnterprise ? 1.2 : 5.4,
    recentActivity: [
      { id: '1', action: 'User Subscription Upgraded', user: 'Alice Freeman', timestamp: '2 mins ago' },
      { id: '2', action: 'New Seat Added', user: 'Bob Smith', timestamp: '1 hour ago' },
      { id: '3', action: 'Invoice Generated #4402', user: 'System', timestamp: '3 hours ago' },
    ],
    history: [
      { month: 'Jan', revenue: isEnterprise ? 90000 : 2000, users: isEnterprise ? 4000 : 50, churnRate: 2.1 },
      { month: 'Feb', revenue: isEnterprise ? 95000 : 2400, users: isEnterprise ? 4200 : 65, churnRate: 2.0 },
      { month: 'Mar', revenue: isEnterprise ? 98000 : 3100, users: isEnterprise ? 4500 : 80, churnRate: 1.8 },
      { month: 'Apr', revenue: isEnterprise ? 105000 : 3800, users: isEnterprise ? 4800 : 100, churnRate: 1.5 },
      { month: 'May', revenue: isEnterprise ? 110000 : 4200, users: isEnterprise ? 5100 : 110, churnRate: 1.4 },
      { month: 'Jun', revenue: isEnterprise ? 125000 : 4500, users: isEnterprise ? 5400 : 120, churnRate: 1.2 },
    ]
  };
};

const INITIAL_TENANTS: Tenant[] = [
  { id: 't1', name: 'Acme Corp', plan: 'Growth', status: 'Active', logoUrl: 'https://picsum.photos/100/100?random=1' },
  { id: 't2', name: 'Stark Ind', plan: 'Startup', status: 'Active', logoUrl: 'https://picsum.photos/100/100?random=2' },
  { id: 't3', name: 'Wayne Ent', plan: 'Enterprise', status: 'Active', logoUrl: 'https://picsum.photos/100/100?random=3' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string>(INITIAL_TENANTS[0].id);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];
  const currentData = generateMockData(currentTenant.id);

  const handleTenantUpdate = (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView data={currentData} />;
      case 'ai-analyst':
        return <AiAnalystView data={currentData} />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return (
          <SettingsView 
            tenant={currentTenant} 
            onUpdate={handleTenantUpdate} 
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          tenants={tenants}
          currentTenant={currentTenant} 
          onTenantChange={(t) => setCurrentTenantId(t.id)}
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;