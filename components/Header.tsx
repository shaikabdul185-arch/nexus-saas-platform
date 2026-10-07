import React from 'react';
import { Menu, Bell, ChevronDown, Search } from 'lucide-react';
import { Tenant } from '../types';

interface HeaderProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onTenantChange: (tenant: Tenant) => void;
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ tenants, currentTenant, onTenantChange, onMobileMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-md text-slate-600"
        >
          <Menu size={24} />
        </button>
        
        {/* Tenant Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
          >
            <img 
              src={currentTenant.logoUrl} 
              alt={currentTenant.name} 
              className="w-8 h-8 rounded bg-slate-100 object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">{currentTenant.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{currentTenant.plan} Plan</p>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Tenant
                </div>
                {tenants.map(tenant => (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      onTenantChange(tenant);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                      tenant.id === currentTenant.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <img src={tenant.logoUrl} className="w-8 h-8 rounded bg-slate-100" alt="" />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${tenant.id === currentTenant.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {tenant.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tenant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tenant.status}
                      </span>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                  <button className="w-full text-center py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium">
                    + Add New Organization
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm px-2 text-slate-700 w-48"
          />
        </div>
        
        <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
};
