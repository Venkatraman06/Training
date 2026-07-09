import React, { useState } from 'react';
import KanbanBoard from '../components/ui/KanbanBoard';
import { Plus, LayoutGrid, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

import { useEffect } from 'react';

const defaultColumns = [
  { id: 'tk-1', title: 'To Do', status: 'TODO', cards: [] },
  { id: 'tk-2', title: 'In Progress', status: 'IN_PROGRESS', cards: [] },
  { id: 'tk-3', title: 'Testing / Review', status: 'REVIEW', cards: [] },
  { id: 'tk-4', title: 'Completed', status: 'COMPLETED', cards: [] }
];

const TaskForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Task Title</label><input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} /></div>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Assignee</label><input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} /></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('Task created and assigned!', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Create Task</button>
    </div>
  </div>
)};

const CalendarView = () => {
  // Hardcoded for July 2026 as per example data
  const daysInMonth = 31;
  const firstDayOfMonth = 3; // Wednesday (0 = Sunday)
  
  const tasksByDay: Record<number, any[]> = {
    5: [{ title: 'Send MIT MoU', type: 'completed' }],
    8: [{ title: 'Data Science Invoice', type: 'pending' }],
    10: [{ title: 'React Training Payment', type: 'completed' }],
    12: [{ title: 'Review New UI Mockups', type: 'pending' }],
    15: [{ title: 'Call Stanford Lead', type: 'pending' }],
  };

  const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`blank-${i}`} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', opacity: 0.5 }}></div>);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const dayTasks = tasksByDay[day] || [];
    return (
      <div key={`day-${day}`} style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', minHeight: '100px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{day}</span>
        {dayTasks.map((t, idx) => (
          <div key={idx} style={{ 
            fontSize: '11px', 
            padding: '4px 6px', 
            borderRadius: '4px', 
            background: t.type === 'completed' ? 'rgba(46, 125, 50, 0.1)' : 'var(--color-khaki)',
            color: t.type === 'completed' ? 'var(--color-success)' : 'var(--color-espresso)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {t.title}
          </div>
        ))}
      </div>
    );
  });

  return (
    <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--color-espresso)', margin: 0 }}>July 2026</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '4px', color: 'var(--color-text-muted)' }}><ChevronLeft size={20} /></button>
          <button style={{ padding: '4px', color: 'var(--color-text-muted)' }}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0', flex: 1, borderTop: '1px solid var(--color-border)', borderLeft: '1px solid var(--color-border)' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-espresso)', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>{d}</div>
        ))}
        {blanks}
        {days}
      </div>
    </div>
  );
};

const TaskManagement: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const [view, setView] = useState<'kanban' | 'calendar'>('kanban');
  const [columns, setColumns] = useState(defaultColumns);
  const { addToast } = useToast();

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks/');
      if (!response.ok) throw new Error('Network response was not ok');
      const tasks = await response.json();
      
      const newColumns = JSON.parse(JSON.stringify(defaultColumns)); // Deep copy
      tasks.forEach((task: any) => {
        const col = newColumns.find((c: any) => c.status === task.status);
        if (col) {
          col.cards.push({
            id: task.id.toString(),
            title: task.title,
            subtitle: task.subtitle,
            tags: task.tags || [],
            comments: task.comments_count,
            attachments: task.attachments_count,
            avatarUrl: task.avatar_url
          });
        }
      });
      setColumns(newColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      addToast('Failed to load tasks from backend', 'error');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Task & Team Management</h1>
        <div className={styles.actions} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '2px' }}>
            <button 
              onClick={() => setView('kanban')}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', background: view === 'kanban' ? 'var(--color-white)' : 'transparent', color: view === 'kanban' ? 'var(--color-espresso)' : 'var(--color-text-muted)', boxShadow: view === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontSize: '13px', fontWeight: '500' }}>
              <LayoutGrid size={14} /> Kanban
            </button>
            <button 
              onClick={() => setView('calendar')}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', background: view === 'calendar' ? 'var(--color-white)' : 'transparent', color: view === 'calendar' ? 'var(--color-espresso)' : 'var(--color-text-muted)', boxShadow: view === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontSize: '13px', fontWeight: '500' }}>
              <CalendarIcon size={14} /> Calendar
            </button>
          </div>
          <button className={styles.btnPrimary} onClick={() => openModal(<TaskForm onClose={closeModal} />, 'Add New Task')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Add Task</button>
        </div>
      </div>
      
      {view === 'kanban' ? <KanbanBoard columns={columns} /> : <CalendarView />}
    </div>
  );
};

export default TaskManagement;
