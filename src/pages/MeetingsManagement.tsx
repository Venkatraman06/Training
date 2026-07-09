import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, Users, Video } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string;
  link?: string;
  minutes?: string;
}

const MeetingsManagement: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 1, title: 'Stanford MoU Kickoff', date: '2026-07-09', time: '10:00 AM', attendees: 'Dr. Alan, Alice (Sales)', link: 'https://meet.google.com/abc-defg-hij', minutes: 'Discuss curriculum package.' },
    { id: 2, title: 'MIT Pune annual review', date: '2026-07-08', time: '04:00 PM', attendees: 'Sarah (CEO), Mrs. Kulkarni', link: 'https://meet.google.com/xyz-qwer-zxc', minutes: 'Review feedback of React bootcamp.' }
  ]);
  const [search, setSearch] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const handleCreateMeeting = (data: Partial<Meeting>) => {
    const mockNew: Meeting = {
      id: meetings.length + 1,
      title: data.title || 'New Meeting',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || '12:00 PM',
      attendees: data.attendees || 'None',
      link: data.link,
      minutes: data.minutes
    };
    setMeetings([mockNew, ...meetings]);
    addToast('Meeting scheduled successfully!', 'success');
    closeModal();
  };

  const filtered = meetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Meetings Schedule</h1>
          <p className={styles.subtitle}>Coordinate corporate meetups, client feedback syncs, and kickoff logs.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => openModal(<MeetingForm onSubmit={handleCreateMeeting} onClose={closeModal} />, 'Schedule New Meeting')}>
          <Plus size={16} /> Schedule Meeting
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search meetings by title..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(meeting => (
          <div key={meeting.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{meeting.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14}/> {meeting.date}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> {meeting.time}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14}/> {meeting.attendees}</div>
            </div>

            {meeting.minutes && (
              <p style={{ fontSize: '13px', background: 'var(--color-bg)', padding: '8px 12px', borderRadius: '6px', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                Notes: {meeting.minutes}
              </p>
            )}

            {meeting.link && (
              <a href={meeting.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-secondary)', fontWeight: 'bold', marginTop: '6px', textDecoration: 'none' }}>
                <Video size={14}/> Join Video Call
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Form to schedule meeting
const MeetingForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<Meeting>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: '', date: '', time: '', attendees: '', link: '', minutes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Meeting Title *</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Date *</label>
          <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Time *</label>
          <input required type="text" placeholder="e.g. 10:00 AM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Attendees *</label>
          <input required type="text" placeholder="e.g. Dr. Alan, Alice" value={formData.attendees} onChange={e => setFormData({ ...formData, attendees: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Video Link</label>
          <input type="url" placeholder="https://meet.google.com/..." value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Meeting Minutes / Agenda</label>
          <textarea rows={2} value={formData.minutes} onChange={e => setFormData({ ...formData, minutes: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Schedule</button>
      </div>
    </form>
  );
};

export default MeetingsManagement;
