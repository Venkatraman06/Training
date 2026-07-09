import React from 'react';
import { Target, Trophy, Clock, FileText } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const assessments = [
  { id: 'A1', title: 'React Hooks & Context', type: 'MCQ', duration: '45 mins', students: 120, avgScore: '78%' },
  { id: 'A2', title: 'Redux State Management', type: 'Coding', duration: '120 mins', students: 115, avgScore: '65%' },
  { id: 'A3', title: 'E-commerce UI Capstone', type: 'Project', duration: '14 days', students: 120, avgScore: 'Pending' },
];

const AssessmentForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Assessment Title</label><input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} /></div>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Duration (mins)</label><input type="number" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} /></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('Assessment Created!', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Create</button>
    </div>
  </div>
)};

const AssessmentSystem: React.FC = () => {
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Assessment System</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => addToast('Opening Question Bank...', 'info')}>Question Bank</button>
          <button className={styles.btnPrimary} onClick={() => openModal(<AssessmentForm onClose={closeModal} />, 'Create Assessment')}>+ Create Assessment</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Target size={24} color="var(--color-info)" />
          <h3 style={{ fontSize: '24px', color: 'var(--color-espresso)', margin: 0 }}>45</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Active Assessments</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Trophy size={24} color="var(--color-warning)" />
          <h3 style={{ fontSize: '24px', color: 'var(--color-espresso)', margin: 0 }}>74%</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Average Class Score</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Clock size={24} color="var(--color-success)" />
          <h3 style={{ fontSize: '24px', color: 'var(--color-espresso)', margin: 0 }}>12</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Pending Evaluations</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1.5rem' }}>Recent Assessments</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Assessment Name</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Duration</th>
                <th style={{ padding: '12px' }}>Students Attempted</th>
                <th style={{ padding: '12px' }}>Avg Score</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(assessment => (
                <tr key={assessment.id} style={{ borderBottom: '1px solid rgba(215, 201, 184, 0.2)' }}>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '600' }}>{assessment.title}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px' }}>
                    <span style={{ background: 'var(--color-khaki)', color: 'var(--color-espresso)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      {assessment.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{assessment.duration}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px' }}>{assessment.students} / 120</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 'bold' }}>{assessment.avgScore}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <button onClick={() => addToast('Downloading results CSV...', 'info')} style={{ color: 'var(--color-info)', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} /> View Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSystem;
