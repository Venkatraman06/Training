import React from 'react';
import { Folder, FileText, Upload, Download, MoreVertical } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const files = [
  { id: '1', name: 'MIT_Pune_MoU_2026.pdf', type: 'pdf', size: '2.4 MB', date: 'Jul 10, 2026' },
  { id: '2', name: 'React_Bootcamp_Curriculum.docx', type: 'doc', size: '1.1 MB', date: 'Jul 08, 2026' },
  { id: '3', name: 'Batch_A_Attendance.xlsx', type: 'excel', size: '540 KB', date: 'Jul 12, 2026' },
  { id: '4', name: 'Training_Photos', type: 'folder', size: '--', date: 'Jul 05, 2026' },
];

const UploadForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ border: '2px dashed var(--color-border)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
      <Upload size={24} color="var(--color-text-muted)" style={{ margin: '0 auto 8px' }}/>
      <p style={{ color: 'var(--color-espresso)', fontSize: '14px', fontWeight: 'bold' }}>Click to browse or drag and drop</p>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>PDF, PPTX, or DOCX up to 50MB</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('File uploaded successfully!', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Upload</button>
    </div>
  </div>
)};

const ProjectDocuments: React.FC = () => {
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project Documents</h1>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => openModal(<UploadForm onClose={closeModal} />, 'Upload Document')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={16} /> Upload File
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <button style={{ fontWeight: '600', color: 'var(--color-espresso)', borderBottom: '2px solid var(--color-espresso)', paddingBottom: '4px' }}>All Files</button>
          <button style={{ color: 'var(--color-text-muted)' }}>Agreements</button>
          <button style={{ color: 'var(--color-text-muted)' }}>Curriculum</button>
          <button style={{ color: 'var(--color-text-muted)' }}>Reports</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Size</th>
              <th style={{ padding: '12px' }}>Modified</th>
              <th style={{ padding: '12px' }}></th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.id} style={{ borderBottom: '1px solid rgba(215, 201, 184, 0.2)', cursor: 'pointer' }}>
                <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '500' }}>
                  {file.type === 'folder' ? <Folder size={20} color="var(--color-camel)" fill="var(--color-khaki)" /> : <FileText size={20} color="var(--color-text-muted)" />}
                  {file.name}
                </td>
                <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{file.size}</td>
                <td style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>{file.date}</td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  <button onClick={() => addToast('Downloading file...', 'success')} style={{ color: 'var(--color-text-muted)', marginRight: '12px' }}><Download size={16} /></button>
                  <button style={{ color: 'var(--color-text-muted)' }}><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDocuments;
