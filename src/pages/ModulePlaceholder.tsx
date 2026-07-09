import React from 'react';
import { useLocation } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';

const moduleNames: Record<string, string> = {
  '/marketing': 'Marketing Management',
  '/planning': 'Training Planning',
  '/instructors': 'Instructor Management',
  '/students': 'Student Management',
  '/assessments': 'Assessment System',
  '/finance': 'Finance Management',
  '/certificates': 'Certificate Management',
  '/documents': 'Project Documents',
  '/feedback': 'Feedback & Survey',
  '/reports': 'Reports & Analytics',
  '/ai-assistant': 'AI Assistant',
  '/automations': 'Automation Center',
  '/tasks': 'Task Management',
  '/notifications': 'Notification Center',
  '/settings': 'Admin Settings'
};

const ModulePlaceholder: React.FC = () => {
  const location = useLocation();
  const moduleName = moduleNames[location.pathname] || 'Module Area';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{moduleName}</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>Export Data</button>
          <button className={styles.btnPrimary}>Create New</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.iconWrapper}>
            <PackageOpen size={48} />
          </div>
          <h2 className={styles.emptyTitle}>No data available yet</h2>
          <p className={styles.emptySubtitle}>
            This module is being built out. Check back later or add some dummy data to get started.
          </p>
        </div>

        {/* Adaptive dummy table to make it look full */}
        <div className={`glass-panel ${styles.dummyTable}`}>
          <div className={styles.tableHeader}>
            <span>ID</span>
            <span>Name</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={styles.tableRow}>
              <span>#00{i}</span>
              <span>Sample Entry {i}</span>
              <span className={styles.badge}>Active</span>
              <span>Jul {10 + i}, 2026</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
