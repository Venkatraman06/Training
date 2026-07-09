import React from 'react';
import { Award, Mail, Download, QrCode } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const certificates = [
  { id: 'CERT-2026-001', student: 'John Doe', course: 'Advanced React Bootcamp', date: 'Jul 12, 2026', status: 'Issued' },
  { id: 'CERT-2026-002', student: 'Jane Smith', course: 'Advanced React Bootcamp', date: 'Jul 12, 2026', status: 'Pending' },
  { id: 'CERT-2026-003', student: 'Rahul Kumar', course: 'Data Science', date: 'Jul 10, 2026', status: 'Issued' },
];

const BulkGenerateForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Select Course Batch</label><select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}><option>Advanced React Bootcamp</option></select></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('Batch generation started', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Generate</button>
    </div>
  </div>
)};

const CertificateManagement: React.FC = () => {
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Certificate Management</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => addToast('Scanner activated', 'info')}><QrCode size={16} /> Verify Certificate</button>
          <button className={styles.btnPrimary} onClick={() => openModal(<BulkGenerateForm onClose={closeModal} />, 'Bulk Generate Certificates')}><Award size={16} /> Generate Bulk</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-bg)', border: '2px dashed var(--color-camel)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--color-camel)', fontWeight: 'bold' }}>Template Preview</span>
          </div>
          <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)' }}>Default React Template</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Includes digital signature and QR verification code.</p>
          <button className={styles.btnSecondary} onClick={() => addToast('Opening template editor', 'info')} style={{ width: '100%' }}>Change Template</button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Recent Certificates</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                <th style={{ padding: '12px' }}>Cert ID</th>
                <th style={{ padding: '12px' }}>Student</th>
                <th style={{ padding: '12px' }}>Course</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id} style={{ borderBottom: '1px solid rgba(215, 201, 184, 0.2)' }}>
                  <td style={{ padding: '16px 12px', fontSize: '13px', fontWeight: '600', color: 'var(--color-espresso)' }}>{cert.id}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px' }}>{cert.student}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{cert.course}</td>
                  <td style={{ padding: '16px 12px' }}>
                     <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: cert.status === 'Issued' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)',
                        color: cert.status === 'Issued' ? 'var(--color-success)' : 'var(--color-warning)'
                      }}>
                        {cert.status}
                      </span>
                  </td>
                  <td style={{ padding: '16px 12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => addToast('Email dispatched to student', 'success')} style={{ color: 'var(--color-info)' }} title="Email"><Mail size={16} /></button>
                    <button onClick={() => addToast('Downloading certificate PDF', 'info')} style={{ color: 'var(--color-espresso)' }} title="Download"><Download size={16} /></button>
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

export default CertificateManagement;
