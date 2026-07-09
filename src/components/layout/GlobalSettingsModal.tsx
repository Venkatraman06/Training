import React, { useState } from 'react';
import { 
  User, Shield, Users, Database, Palette, 
  Settings, Bell, Moon, Sun, FileText, Plus, Trash, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface GlobalSettingsModalProps {
  onClose: () => void;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'employees' | 'users' | 'roles' | 'notifications' | 'theme' | 'backup' | 'audit'>('profile');

  // Tab State Management
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Company Profile
  const [companyName, setCompanyName] = useState('Hackers InfoTech');
  const [companyAddress, setCompanyAddress] = useState('123 Cyber Tower, Sector 62, Noida, UP, India');
  const [gstNumber, setGstNumber] = useState('09AAACH1234F1ZP');
  const [companyPhone, setCompanyPhone] = useState('+91 98765 43210');

  // Employee Directory Mock state
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Sarah CEO', role: 'CEO', salary: '₹2,50,000/mo', docCount: 4 },
    { id: 2, name: 'Amit Sharma', role: 'Sales Team', salary: '₹60,000/mo', docCount: 2 },
    { id: 3, name: 'Rohan Verma', role: 'Trainer', salary: '₹75,000/mo', docCount: 3 },
    { id: 4, name: 'Kavya Sen', role: 'Marketing Team', salary: '₹55,000/mo', docCount: 1 },
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Trainer');
  const [newEmpSalary, setNewEmpSalary] = useState('');

  // Notifications
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);

  // Audit Logs (Historical activities mock)
  const auditLogs = [
    { timestamp: '2026-07-08 20:15:30', user: 'Sarah CEO', action: 'Updated Lead: Stanford University status to Won' },
    { timestamp: '2026-07-08 19:40:12', user: 'Sarah CEO', action: 'Generated Quotation Q-1024 for Cambridge Institute' },
    { timestamp: '2026-07-08 18:22:05', user: 'Amit Sharma', action: 'Logged Call activity with Oxford College' },
    { timestamp: '2026-07-08 15:10:45', user: 'Sarah CEO', action: 'Created new College visit schedule to MIT Pune' },
    { timestamp: '2026-07-08 11:30:19', user: 'System', action: 'Automated DB backup completed' },
  ];

  const handleProfileSave = async () => {
    const success = await updateUser({
      first_name: firstName,
      last_name: lastName,
      email: email
    });
    if (success) {
      addToast('Profile updated successfully!', 'success');
    } else {
      addToast('Error saving profile.', 'error');
    }
  };

  const handleAddEmployee = () => {
    if (!newEmpName || !newEmpSalary) {
      addToast('Please enter all employee details', 'error');
      return;
    }
    const newEmp = {
      id: Date.now(),
      name: newEmpName,
      role: newEmpRole,
      salary: `₹${newEmpSalary}/mo`,
      docCount: 0
    };
    setEmployees([...employees, newEmp]);
    setNewEmpName('');
    setNewEmpSalary('');
    addToast('Employee added to roster successfully!', 'success');
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
    addToast('Employee removed', 'info');
  };

  const handleBackupExport = () => {
    addToast('Generating SQLite DB Backup...', 'info');
    setTimeout(() => {
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob(["mock-sqlite-db-binary-payload"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "hackers_infotech_db_backup.sqlite";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast('Database backup downloaded successfully!', 'success');
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      height: '80vh',
      width: '100%',
      backgroundColor: 'var(--color-surface)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Sidebar List */}
      <div style={{
        width: '260px',
        backgroundColor: 'var(--color-linen)',
        borderRight: '1px solid var(--color-border)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', paddingLeft: '8px' }}>
          <Settings size={20} style={{ color: 'var(--color-secondary)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-main)' }}>Global Settings</h2>
        </div>

        <button 
          onClick={() => setActiveTab('profile')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'profile' ? '600' : '500',
            background: activeTab === 'profile' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <User size={16} /> Profile Settings
        </button>

        <button 
          onClick={() => setActiveTab('company')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'company' ? '600' : '500',
            background: activeTab === 'company' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'company' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Palette size={16} /> Company Profile
        </button>

        <button 
          onClick={() => setActiveTab('employees')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'employees' ? '600' : '500',
            background: activeTab === 'employees' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'employees' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Users size={16} /> Employee Management
        </button>

        <button 
          onClick={() => setActiveTab('users')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'users' ? '600' : '500',
            background: activeTab === 'users' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'users' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Users size={16} /> User Management
        </button>

        <button 
          onClick={() => setActiveTab('roles')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'roles' ? '600' : '500',
            background: activeTab === 'roles' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'roles' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Shield size={16} /> Roles & Permissions
        </button>

        <button 
          onClick={() => setActiveTab('notifications')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'notifications' ? '600' : '500',
            background: activeTab === 'notifications' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'notifications' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Bell size={16} /> Notification Settings
        </button>

        <button 
          onClick={() => setActiveTab('theme')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'theme' ? '600' : '500',
            background: activeTab === 'theme' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'theme' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Sun size={16} /> Theme Settings
        </button>

        <button 
          onClick={() => setActiveTab('backup')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'backup' ? '600' : '500',
            background: activeTab === 'backup' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'backup' ? 'var(--color-white)' : 'var(--color-text-muted)'
          }}
        >
          <Database size={16} /> Backup & Restore
        </button>

        <button 
          onClick={() => setActiveTab('audit')} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: activeTab === 'audit' ? '600' : '500',
            background: activeTab === 'audit' ? 'var(--color-secondary)' : 'transparent',
            color: activeTab === 'audit' ? 'var(--color-white)' : 'var(--color-text-muted)',
            marginBottom: 'auto'
          }}
        >
          <FileText size={16} /> Audit Logs
        </button>

        {/* Close Button at bottom of sidebar */}
        <button 
          onClick={onClose} 
          style={{
            textAlign: 'left', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13.5px', fontWeight: '600',
            background: 'var(--color-linen)',
            color: 'var(--color-error)',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <X size={16} /> Close Settings
        </button>
      </div>

      {/* Pane Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Profile Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Role</label>
                <input type="text" value={user?.role || 'CEO'} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-linen)', color: 'var(--color-text-muted)' }} />
              </div>
            </div>
            <button onClick={handleProfileSave} style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Profile Changes
            </button>
          </div>
        )}

        {/* Company Profile */}
        {activeTab === 'company' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Company Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Brand Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Office Address</label>
                <input type="text" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>GSTIN / Tax Code</label>
                  <input type="text" value={gstNumber} onChange={e => setGstNumber(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Contact Phone</label>
                  <input type="text" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
              </div>
            </div>
            <button onClick={() => addToast('Company profile saved successfully!', 'success')} style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Company Info
            </button>
          </div>
        )}

        {/* Employee Management */}
        {activeTab === 'employees' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>Employee Management</h3>
            
            {/* Roster list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {employees.map(emp => (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-linen)', borderRadius: '8px' }}>
                  <div>
                    <h5 style={{ fontWeight: '600', fontSize: '14px' }}>{emp.name}</h5>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{emp.role} • Salary: {emp.salary}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button style={{ border: 'none', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                      {emp.docCount} Docs
                    </button>
                    <button onClick={() => handleDeleteEmployee(emp.id)} style={{ border: 'none', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}>
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add */}
            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Add Staff Member</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>Full Name</label>
                  <input type="text" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>Role</label>
                  <select value={newEmpRole} onChange={e => setNewEmpRole(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                    <option value="Trainer">Trainer</option>
                    <option value="Sales Team">Sales Team</option>
                    <option value="Marketing Team">Marketing Team</option>
                    <option value="Finance">Finance Officer</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>Salary (₹)</label>
                  <input type="number" value={newEmpSalary} onChange={e => setNewEmpSalary(e.target.value)} placeholder="50000" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
              </div>
              <button onClick={handleAddEmployee} style={{ marginTop: '12px', padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Plus size={14} /> Add Member
              </button>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>User Logins & Accounts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Sarah CEO (admin)</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>CEO Role • Last login: 10 mins ago</p>
                </div>
                <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'rgb(16,185,129)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Amit Sales (amit_sales)</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Sales Team Role • Last login: 2 hours ago</p>
                </div>
                <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'rgb(16,185,129)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Rohan Trainer (rohan_trainer)</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Trainer Role • Last login: 1 day ago</p>
                </div>
                <span style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'rgb(16,185,129)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>Active</span>
              </div>
            </div>
            <button onClick={() => addToast('User invitation link copied!', 'success')} style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Invite New User
            </button>
          </div>
        )}

        {/* Roles & Permissions */}
        {activeTab === 'roles' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>Roles & Access Control</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Configure screen permissions for each organizational user level.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h5 style={{ fontWeight: 'bold', marginBottom: '6px' }}>CEO / Admin</h5>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked disabled /> Full Admin Access (All Modules)</label>
              </div>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h5 style={{ fontWeight: 'bold', marginBottom: '6px' }}>Operations Manager</h5>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Lead Management</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Sales CRM</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Operations Module</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Finance Access</label>
                </div>
              </div>
              <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h5 style={{ fontWeight: 'bold', marginBottom: '6px' }}>Sales Team</h5>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Lead Management</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Sales CRM</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" /> Operations Module</label>
                </div>
              </div>
              <div>
                <h5 style={{ fontWeight: 'bold', marginBottom: '6px' }}>Trainer</h5>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Operations Module</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" /> Finance Access</label>
                </div>
              </div>
            </div>
            <button onClick={() => addToast('Permissions saved successfully!', 'success')} style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Access Rules
            </button>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Notification Triggers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Email Alerts</span>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Send follow-up and task reminders to inbox</p>
                </div>
                <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>WhatsApp Reminders</span>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Automate WhatsApp alerts for client confirmations</p>
                </div>
                <input type="checkbox" checked={notifyWhatsapp} onChange={e => setNotifyWhatsapp(e.target.checked)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>SMS Alerts</span>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Send direct text messages for payment dues</p>
                </div>
                <input type="checkbox" checked={notifySMS} onChange={e => setNotifySMS(e.target.checked)} />
              </div>
            </div>
            <button onClick={() => addToast('Notification rules saved', 'success')} style={{ marginTop: '1.5rem', padding: '10px 20px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Notification Preferences
            </button>
          </div>
        )}

        {/* Theme Toggler */}
        {activeTab === 'theme' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1.5rem', fontWeight: 'bold' }}>Theme Preferences</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Select your preferred interface style.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div 
                onClick={toggleTheme} 
                style={{ 
                  flex: 1, padding: '2rem', border: '2px solid ' + (theme === 'light' ? 'var(--color-secondary)' : 'var(--color-border)'), 
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'center', background: 'white', color: '#0F172A' 
                }}
              >
                <Sun size={28} style={{ color: '#EAB308', marginBottom: '8px' }} />
                <h5 style={{ fontWeight: 'bold' }}>Light Mode</h5>
              </div>
              <div 
                onClick={toggleTheme} 
                style={{ 
                  flex: 1, padding: '2rem', border: '2px solid ' + (theme === 'dark' ? 'var(--color-secondary)' : 'var(--color-border)'), 
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'center', background: '#0F172A', color: 'white' 
                }}
              >
                <Moon size={28} style={{ color: '#A78BFA', marginBottom: '8px' }} />
                <h5 style={{ fontWeight: 'bold' }}>Dark Mode</h5>
              </div>
            </div>
          </div>
        )}

        {/* Backup & Restore */}
        {activeTab === 'backup' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>Database Backup & Restore</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Export your SQLite relational tables or restore historical states.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Export SQL Database</h5>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Downloads sqlite db backup file</span>
                </div>
                <button onClick={handleBackupExport} style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Backup DB
                </button>
              </div>

              <div style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Restore Database</h5>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Upload SQL backup dump to restore</span>
                </div>
                <button onClick={() => addToast('Restore feature is locked for safety.', 'error')} style={{ padding: '8px 16px', background: 'var(--color-linen)', color: 'var(--color-text-muted)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Upload & Restore
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'audit' && (
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>System Audit Logs</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Immutable logs recording actions taken by users within the dashboard.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditLogs.map((log, index) => (
                <div key={index} style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', fontSize: '12.5px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-main)' }}>{log.user}</strong>: {log.action}
                  </div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSettingsModal;
