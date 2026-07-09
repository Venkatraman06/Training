import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Megaphone, 
  DollarSign, Settings, Target, 
  Activity, ChevronDown, ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SubItem {
  name: string;
  path: string;
}

interface Module {
  name: string;
  icon: any;
  path: string;
  items: SubItem[];
}

const modules: Module[] = [
  {
    name: 'Lead Management',
    icon: Target,
    path: '/crm',
    items: [
      { name: 'Dashboard', path: '/crm/dashboard' },
      { name: 'Leads', path: '/crm' },
      { name: 'Follow-ups', path: '/crm/followups' },
      { name: 'Meetings', path: '/crm/meetings' },
      { name: 'Tasks', path: '/crm/tasks' },
      { name: 'Documents', path: '/crm/documents' },
    ]
  },
  {
    name: 'Marketing',
    icon: Megaphone,
    path: '/marketing',
    items: [
      { name: 'Dashboard', path: '/marketing/dashboard' },
      { name: 'Campaigns', path: '/marketing/campaigns' },
      { name: 'College Outreach', path: '/marketing/outreach' },
      { name: 'Social Media', path: '/marketing/social' },
      { name: 'Events', path: '/marketing/events' },
      { name: 'Content Calendar', path: '/marketing/calendar' },
      { name: 'Analytics', path: '/marketing/analytics' },
    ]
  },
  {
    name: 'Sales',
    icon: Briefcase,
    path: '/sales',
    items: [
      { name: 'Dashboard', path: '/sales/dashboard' },
      { name: 'Clients', path: '/clients' },
      { name: 'Opportunities', path: '/sales/opportunities' },
      { name: 'Quotations', path: '/sales/quotes' },
      { name: 'Proposals', path: '/sales' },
      { name: 'Meetings', path: '/meetings' },
      { name: 'Follow-ups', path: '/sales/followups' },
      { name: 'Documents', path: '/documents' },
    ]
  },
  {
    name: 'Operations',
    icon: Activity,
    path: '/planning',
    items: [
      { name: 'Dashboard', path: '/planning/dashboard' },
      { name: 'Training Management', path: '/planning' },
      { name: 'College Management', path: '/colleges' },
      { name: 'Student Management', path: '/students' },
      { name: 'Certification Students', path: '/certification-students' },
      { name: 'Calendar', path: '/calendar' },
      { name: 'Tasks', path: '/tasks' },
      { name: 'Documents', path: '/documents' },
      { name: 'Reports', path: '/reports' },
    ]
  },
  {
    name: 'Finance',
    icon: DollarSign,
    path: '/finance',
    items: [
      { name: 'Dashboard', path: '/finance/dashboard' },
      { name: 'Payments', path: '/finance/payments' },
      { name: 'Invoices', path: '/finance/invoices' },
      { name: 'Expenses', path: '/finance/expenses' },
      { name: 'Reports', path: '/reports' },
      { name: 'Documents', path: '/documents' },
    ]
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand modules based on active location
  useEffect(() => {
    const activeModule = modules.find(m => 
      location.pathname.startsWith(m.path) || 
      m.items.some(item => location.pathname === item.path)
    );
    if (activeModule) {
      setExpanded(prev => ({ ...prev, [activeModule.name]: true }));
    }
  }, [location.pathname]);

  const toggleExpand = (name: string) => {
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className={styles.sidebar} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>HT</div>
          <span className={styles.logoText}>Hackers InfoTech</span>
        </div>
      </div>
      
      {/* Navigation Modules list */}
      <nav className={styles.nav} style={{ flex: 1, overflowY: 'auto', padding: '10px 6px' }}>
        {/* Flat Dashboard link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${styles.navMenuItem} ${isActive ? styles.active : ''}`}
          style={{ marginBottom: '8px' }}
        >
          <LayoutDashboard className={styles.icon} size={16} />
          <span>Dashboard</span>
        </NavLink>

        {modules.map((mod) => {
          const ModuleIcon = mod.icon;
          const isExpanded = !!expanded[mod.name];
          const isModuleActive = location.pathname.startsWith(mod.path) || mod.items.some(item => location.pathname === item.path);

          return (
            <div key={mod.name} style={{ display: 'flex', flexDirection: 'column', marginBottom: '4px' }}>
              <div 
                onClick={() => toggleExpand(mod.name)}
                className={`${styles.navMenuItem}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  cursor: 'pointer',
                  background: isModuleActive ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                  fontWeight: isModuleActive ? '600' : '500'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ModuleIcon className={styles.icon} size={16} style={{ color: isModuleActive ? 'var(--color-secondary)' : 'var(--color-text-muted)' }} />
                  <span style={{ color: isModuleActive ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{mod.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} />
                ) : (
                  <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                )}
              </div>

              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '28px', marginTop: '2px', borderLeft: '1px solid var(--color-border)', marginLeft: '24px', gap: '2px' }}>
                  {mod.items.map((sub) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) => `${styles.level3Item} ${isSubActive || isActive ? styles.active : ''}`}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px', 
                          borderRadius: '6px', 
                          color: isSubActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                          background: isSubActive ? 'rgba(37,99,235,0.06)' : 'transparent',
                          fontWeight: isSubActive ? '600' : '400',
                          textDecoration: 'none'
                        }}
                      >
                        {sub.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Flat Settings link at the bottom */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)' }}>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${styles.navMenuItem} ${isActive ? styles.active : ''}`}
        >
          <Settings className={styles.icon} size={16} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
