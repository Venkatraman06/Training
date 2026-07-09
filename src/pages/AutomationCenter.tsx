import React from 'react';
import { Zap, Play, Pause, Plus, ArrowRight, Activity, Mail } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const automations = [
  { id: 1, name: 'Issue Certificate on Completion', trigger: 'Training Status = Completed', action: 'Generate & Email Certificate', status: 'active' },
  { id: 2, name: 'Follow-up Unpaid Invoices', trigger: 'Invoice Due Date Passed', action: 'Send Email Reminder', status: 'active' },
  { id: 3, name: 'Weekly Admin Report', trigger: 'Every Friday 5 PM', action: 'Email Report to Super Admin', status: 'paused' },
];

const WorkflowForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Workflow Name</label><input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} /></div>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Trigger Event</label><select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}><option>When Student Completes Course</option><option>When Invoice is Overdue</option></select></div>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Action</label><select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}><option>Send Email Notification</option><option>Generate Certificate</option></select></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('Workflow saved and activated!', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Save Workflow</button>
    </div>
  </div>
)};

const AutomationCenter: React.FC = () => {
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Automation Center</h1>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => openModal(<WorkflowForm onClose={closeModal} />, 'Create New Workflow')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> New Workflow</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1.5rem' }}>Visual Workflow: Issue Certificate</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', overflowX: 'auto', padding: '2rem 0' }}>
            {/* Trigger Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-khaki)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-espresso)' }}>
                <Activity size={28} color="var(--color-espresso)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Trigger</div>
                <div style={{ fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '600' }}>Training Completed</div>
              </div>
            </div>

            <ArrowRight size={32} color="var(--color-text-muted)" />

            {/* Condition Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '80px', height: '80px', transform: 'rotate(45deg)', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-camel)' }}>
                <div style={{ transform: 'rotate(-45deg)' }}><Zap size={28} color="var(--color-camel)" /></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Condition</div>
                <div style={{ fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '600' }}>Attendance &gt; 75%</div>
              </div>
            </div>

            <ArrowRight size={32} color="var(--color-text-muted)" />

            {/* Action Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--color-espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={28} color="white" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Action</div>
                <div style={{ fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '600' }}>Email Certificate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>All Workflows</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>Workflow Name</th>
              <th style={{ padding: '12px' }}>Trigger</th>
              <th style={{ padding: '12px' }}>Action</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Enable/Disable</th>
            </tr>
          </thead>
          <tbody>
            {automations.map(auto => (
              <tr key={auto.id} style={{ borderBottom: '1px solid rgba(215, 201, 184, 0.2)' }}>
                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '500', color: 'var(--color-espresso)' }}>{auto.name}</td>
                <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{auto.trigger}</td>
                <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="var(--color-camel)" /> {auto.action}
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: auto.status === 'active' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(215, 201, 184, 0.3)',
                    color: auto.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)'
                  }}>
                    {auto.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <button style={{ color: auto.status === 'active' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {auto.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutomationCenter;
