import React from 'react';
import { Bell, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';

const notifications = [
  { id: 1, type: 'alert', title: 'Payment Overdue', message: 'Invoice INV-1024 for IIT Bombay is overdue by 3 days.', time: '10 mins ago', read: false },
  { id: 2, type: 'message', title: 'New Feedback', message: 'Jane Smith submitted feedback for React Bootcamp.', time: '1 hour ago', read: false },
  { id: 3, type: 'success', title: 'Certificates Issued', message: 'Successfully generated and emailed 120 certificates.', time: '2 hours ago', read: true },
  { id: 4, type: 'info', title: 'System Update', message: 'TrainOps Pro will undergo maintenance at 2 AM EST.', time: 'Yesterday', read: true },
];

const NotificationCenter: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notification Center</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>Mark All as Read</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map(notif => (
          <div key={notif.id} style={{ 
            display: 'flex', gap: '1rem', padding: '1rem', 
            background: notif.read ? 'transparent' : 'var(--color-bg)', 
            border: '1px solid', borderColor: notif.read ? 'rgba(215, 201, 184, 0.2)' : 'var(--color-border)', 
            borderRadius: '8px' 
          }}>
            <div style={{ marginTop: '4px' }}>
              {notif.type === 'alert' && <AlertTriangle color="var(--color-error)" size={20} />}
              {notif.type === 'message' && <MessageSquare color="var(--color-info)" size={20} />}
              {notif.type === 'success' && <CheckCircle color="var(--color-success)" size={20} />}
              {notif.type === 'info' && <Bell color="var(--color-camel)" size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--color-espresso)', margin: 0, fontWeight: notif.read ? '500' : 'bold' }}>{notif.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{notif.time}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-main)', margin: 0 }}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
