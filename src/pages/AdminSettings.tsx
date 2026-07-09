import React from 'react';
import { Shield, Users, Mail, Database, Palette } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

const AdminSettings: React.FC = () => {
  const { addToast } = useToast();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => addToast('Settings saved successfully!', 'success')}>Save Changes</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => addToast('Loading Roles...', 'info')} style={{ textAlign: 'left', padding: '12px', background: 'var(--color-khaki)', color: 'var(--color-espresso)', fontWeight: 'bold', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', border: 'none', cursor: 'pointer' }}>
            <Shield size={16} /> Roles & Permissions
          </button>
          <button onClick={() => addToast('Switching to Team Management...', 'info')} style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Users size={16} /> Team Management
          </button>
          <button onClick={() => addToast('Switching to Email Templates...', 'info')} style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Mail size={16} /> Email Templates
          </button>
          <button onClick={() => addToast('Initializing Database Backup...', 'info')} style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Database size={16} /> Backup & Restore
          </button>
          <button onClick={() => addToast('Loading Branding Assets...', 'info')} style={{ textAlign: 'left', padding: '12px', color: 'var(--color-text-muted)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Palette size={16} /> Branding
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1.5rem' }}>Roles & Permissions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-espresso)', marginBottom: '8px' }}>Super Admin</label>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Has full access to all 17 modules, finance reports, and system settings.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked disabled /> Full Access</label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-espresso)', marginBottom: '8px' }}>Sales Manager</label>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Access to CRM, Marketing, and Documents.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Sales CRM</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Marketing</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Documents</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" /> Finance</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" /> Settings</label>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-espresso)', marginBottom: '8px' }}>Trainer</label>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Access to Training Planning, Students, and Assessments.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Training Planning</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Students</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" defaultChecked /> Assessments</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><input type="checkbox" /> Sales CRM</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
