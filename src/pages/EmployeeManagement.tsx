import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Mail, Phone
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface Employee {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  whatsapp?: string;
}

// API Endpoint

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const fetchEmployees = async () => {
    try {
      // For simplicity, let's look up /api/users/ (but Django user view is at /auth/me/ or similar). Let's see if we have a user directory endpoint.
      // If we don't, we will fall back to mock data.
      setMockEmployees();
    } catch (e) {
      setMockEmployees();
    }
  };

  const setMockEmployees = () => {
    setEmployees([
      { id: 1, username: 'ceo', email: 'ceo@hackersinfotech.com', first_name: 'Sarah', last_name: 'CEO', role: 'CEO', phone: '+1234567' },
      { id: 2, username: 'ops', email: 'ops@hackersinfotech.com', first_name: 'John', last_name: 'Operations', role: 'Operations Manager', phone: '+1234568' },
      { id: 3, username: 'sales', email: 'sales@hackersinfotech.com', first_name: 'Alice', last_name: 'Sales', role: 'Sales Team', phone: '+1234569' },
      { id: 4, username: 'trainer', email: 'trainer@hackersinfotech.com', first_name: 'Alan', last_name: 'Trainer', role: 'Trainer', phone: '+1234570' },
      { id: 5, username: 'finance', email: 'finance@hackersinfotech.com', first_name: 'Dave', last_name: 'Finance', role: 'Finance', phone: '+1234571' }
    ]);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = (data: Partial<Employee>) => {
    const mockNew: Employee = {
      id: employees.length + 1,
      username: data.username || 'new_emp',
      email: data.email || '',
      first_name: data.first_name || 'New',
      last_name: data.last_name || 'Employee',
      role: data.role || 'Intern',
      phone: data.phone || ''
    };
    setEmployees([mockNew, ...employees]);
    addToast('Employee profile added (Mock mode)!', 'success');
    closeModal();
  };

  const filtered = employees.filter(e => {
    const name = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? e.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Employee & HR Management</h1>
          <p className={styles.subtitle}>Manage company roles, salary payouts, tasks assigned and directories.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => openModal(<EmployeeForm onSubmit={handleCreateEmployee} onClose={closeModal} />, 'Add Employee Profile')}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search employee by name or email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
        >
          <option value="">All Roles</option>
          <option value="CEO">CEO</option>
          <option value="Operations Manager">Operations Manager</option>
          <option value="Sales Team">Sales Team</option>
          <option value="Trainer">Trainer</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(emp => (
          <div key={emp.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: 'var(--color-secondary)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {emp.first_name[0]}{emp.last_name[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>{emp.first_name} {emp.last_name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{emp.role}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12}/> {emp.email}</div>
              {emp.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12}/> {emp.phone}</div>}
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(37,99,235,0.05)', color: 'var(--color-text-main)' }}>Active Tasks: 0</span>
              <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(37,99,235,0.05)', color: 'var(--color-text-main)' }}>Perf: 5.0 ★</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form to add employee
const EmployeeForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<Employee>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    username: '', email: '', first_name: '', last_name: '',
    role: 'Intern', phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem', width: '100%', maxWidth: '450px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>First Name *</label>
          <input required type="text" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Last Name *</label>
          <input required type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Username *</label>
          <input required type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email *</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Role</label>
          <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <option value="CEO">CEO</option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Sales Team">Sales Team</option>
            <option value="Trainer">Trainer</option>
            <option value="Finance">Finance</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone</label>
          <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Add Employee</button>
      </div>
    </form>
  );
};

export default EmployeeManagement;
