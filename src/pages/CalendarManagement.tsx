import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';

interface CalendarEvent {
  id: number;
  title: string;
  type: 'MEETING' | 'VISIT' | 'TRAINING' | 'DEADLINE' | 'EXAM';
  date: string;
  time: string;
  details: string;
}

const mockEvents: CalendarEvent[] = [
  { id: 1, title: 'Stanford University Visit', type: 'VISIT', date: '2026-07-09', time: '10:00 AM', details: 'Institutional meeting with CS Dean.' },
  { id: 2, title: 'React components workshop', type: 'TRAINING', date: '2026-07-10', time: '09:00 AM', details: 'Day 5 of MIT Pune web bootcamp.' },
  { id: 3, title: 'Mid-term quiz deadline', type: 'DEADLINE', date: '2026-07-12', time: '11:59 PM', details: 'React basic quiz assignment due.' },
  { id: 4, title: 'AWS Cert. Exam: Abhishek', type: 'EXAM', date: '2026-07-15', time: '02:00 PM', details: 'Solutions Architect exam slot.' },
  { id: 5, title: 'Annual review meeting', type: 'MEETING', date: '2026-07-08', time: '04:00 PM', details: 'Meeting with MAEER group directors.' }
];

const CalendarManagement: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-08'));
  const [selectedType, setSelectedType] = useState('');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayIndex = getFirstDayOfMonth(currentDate);

  const getEventBadgeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'VISIT': return { bg: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' };
      case 'TRAINING': return { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' };
      case 'DEADLINE': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'EXAM': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
      default: return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
    }
  };

  const filteredEvents = mockEvents.filter(e => selectedType ? e.type === selectedType : true);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Unified Calendar</h1>
          <p className={styles.subtitle}>Aggregate meetings, visits, training sessions, task deadlines, and exams.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.25fr', gap: '1.5rem' }}>
        {/* Month grid calendar */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handlePrevMonth} style={{ padding: '6px', borderRadius: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}><ChevronLeft size={16}/></button>
              <button onClick={handleNextMonth} style={{ padding: '6px', borderRadius: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}><ChevronRight size={16}/></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '4px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--color-text-muted)', paddingBottom: '6px' }}>{day}</span>
            ))}
            
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '70px', border: '1px solid rgba(0,0,0,0.02)' }}></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);

              return (
                <div key={`day-${day}`} style={{ height: '70px', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--color-surface)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{day}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                    {dayEvents.map(e => (
                      <div key={e.id} style={{ fontSize: '9px', padding: '2px 4px', borderRadius: '3px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', ...getEventBadgeColor(e.type) }}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Agenda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Event Filters</h4>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
            >
              <option value="">All Events</option>
              <option value="MEETING">Meetings</option>
              <option value="VISIT">College Visits</option>
              <option value="TRAINING">Trainings</option>
              <option value="DEADLINE">Deadlines</option>
              <option value="EXAM">Exams</option>
            </select>
          </div>

          <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '14px' }}>Upcoming Agenda</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '300px' }}>
              {filteredEvents.map(e => (
                <div key={e.id} style={{ borderLeft: `3px solid ${getEventBadgeColor(e.type).color}`, paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{e.title}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    <span>{e.date} • {e.time}</span>
                    <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '8px', fontWeight: 'bold', ...getEventBadgeColor(e.type) }}>{e.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;
