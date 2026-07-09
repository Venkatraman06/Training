import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Clock
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

interface TrainingProject {
  id: number;
  title: string;
  collegeName: string;
  trainerName: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Active' | 'Completed';
  npsScore: string;
}

interface SessionSlot {
  id: number;
  time: string;
  title: string;
  type: 'Theory' | 'Practical' | 'Lab';
  status: 'Pending' | 'Ongoing' | 'Completed';
}

const TrainingPlanning: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'dashboard' | 'projects' | 'schedule' | 'attendance' | 'assessments' | 'feedback' | 'certificates'>('projects');
  const { addToast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/planning/dashboard')) {
      setSubTab('dashboard');
    } else if (path.includes('/planning/schedule')) {
      setSubTab('schedule');
    } else if (path.includes('/planning/attendance')) {
      setSubTab('attendance');
    } else if (path.includes('/planning/assessments')) {
      setSubTab('assessments');
    } else if (path.includes('/planning/feedback')) {
      setSubTab('feedback');
    } else if (path.includes('/planning/certificates')) {
      setSubTab('certificates');
    } else {
      setSubTab('projects');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: typeof subTab) => {
    if (tab === 'projects') {
      navigate('/planning');
    } else {
      navigate(`/planning/${tab}`);
    }
  };

  // Active Training Projects State
  const [projects, setProjects] = useState<TrainingProject[]>([
    { id: 1, title: 'React JS & Web Development Bootcamp', collegeName: 'MIT Pune', trainerName: 'Dr. Alan Smith', startDate: '2026-07-01', endDate: '2026-07-10', status: 'Active', npsScore: '9.2/10' },
    { id: 2, title: 'AWS Cloud Practitioner Certification', collegeName: 'Stanford University', trainerName: 'Priya Sharma', startDate: '2026-07-15', endDate: '2026-07-22', status: 'Planned', npsScore: '-' },
    { id: 3, title: 'Python & Data Analytics Intensive', collegeName: 'VIT Vellore', trainerName: 'Dr. Alan Smith', startDate: '2026-06-15', endDate: '2026-06-25', status: 'Completed', npsScore: '9.5/10' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCollege, setNewCollege] = useState('MIT Pune');
  const [newTrainer, setNewTrainer] = useState('Dr. Alan Smith');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  // Daily Schedule Slots
  const [slots, setSlots] = useState<SessionSlot[]>([
    { id: 1, time: '09:00 AM - 10:30 AM', title: 'React State Hooks & Effects', type: 'Theory', status: 'Completed' },
    { id: 2, time: '10:45 AM - 12:30 PM', title: 'Interactive Form Handling Lab', type: 'Practical', status: 'Ongoing' },
    { id: 3, time: '01:30 PM - 03:00 PM', title: 'Custom Hooks Architecture', type: 'Theory', status: 'Pending' },
    { id: 4, time: '03:15 PM - 05:00 PM', title: 'E-commerce Shopping Cart Challenge', type: 'Lab', status: 'Pending' }
  ]);
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotType, setNewSlotType] = useState<SessionSlot['type']>('Theory');

  // Attendance mock list
  const [attendance, setAttendance] = useState([
    { studentId: 101, name: 'Abhishek Kumar', present: true },
    { studentId: 102, name: 'Ananya Sharma', present: true },
    { studentId: 103, name: 'Rahul Patil', present: false },
    { studentId: 104, name: 'Sneha Deshmukh', present: true }
  ]);

  // Assessments mock list
  const assessments = [
    { id: 1, name: 'Mid-term Quiz 1', avgScore: '84%', completed: true },
    { id: 2, name: 'React Routing Assignment', avgScore: '78%', completed: true },
    { id: 3, name: 'Final Capstone Project Draft', avgScore: '-', completed: false }
  ];

  // Feedback NPS comments
  const feedbacks = [
    { id: 1, studentName: 'Ananya Sharma', rating: 10, comment: 'Amazing practical sessions! The trainer Priya is extremely knowledgeable.' },
    { id: 2, studentName: 'Rahul Patil', rating: 8, comment: 'Good lab exercises, but need more time for state management topics.' },
    { id: 3, studentName: 'Sneha Deshmukh', rating: 9, comment: 'Excellent boot camp program structure.' }
  ];

  const handleCreateProject = () => {
    if (!newTitle || !newStart || !newEnd) {
      addToast('Please fill all project details', 'error');
      return;
    }
    const proj: TrainingProject = {
      id: Date.now(),
      title: newTitle,
      collegeName: newCollege,
      trainerName: newTrainer,
      startDate: newStart,
      endDate: newEnd,
      status: 'Planned',
      npsScore: '-'
    };
    setProjects([...projects, proj]);
    setNewTitle('');
    setNewStart('');
    setNewEnd('');
    addToast('Training project scheduled!', 'success');
  };

  const handleAddSlot = () => {
    if (!newSlotTitle || !newSlotTime) {
      addToast('Please fill slot title and time range', 'error');
      return;
    }
    const sl: SessionSlot = {
      id: Date.now(),
      time: newSlotTime,
      title: newSlotTitle,
      type: newSlotType,
      status: 'Pending'
    };
    setSlots([...slots, sl]);
    setNewSlotTitle('');
    setNewSlotTime('');
    addToast('Session slot added to training schedule!', 'success');
  };

  const handleToggleAttendance = (id: number) => {
    setAttendance(attendance.map(a => a.studentId === id ? { ...a, present: !a.present } : a));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Training & Operations</h1>
          <p className={styles.subtitle}>Assign trainers, schedule bootcamp sessions, and log student performance.</p>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'projects', 'schedule', 'attendance', 'assessments', 'feedback', 'certificates'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
              background: subTab === tab ? 'var(--color-secondary)' : 'transparent',
              color: subTab === tab ? 'white' : 'var(--color-text-muted)',
              textTransform: 'capitalize', transition: 'all 0.2s'
            }}
          >
            {tab === 'projects' ? 'Training Projects' : tab === 'schedule' ? 'Daily Schedule' : tab}
          </button>
        ))}
      </div>

      {/* Operations Dashboard Overview */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Active Bootcamps</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-secondary)' }}>
                {projects.filter(p => p.status === 'Active').length}
              </h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Assigned Trainers</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-text-main)' }}>2</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Students</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-accent)' }}>124</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Avg Satisfaction (NPS)</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#10B981' }}>9.4/10</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedules & Timelines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <strong>{p.title}</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)' }}>Trainer: {p.trainerName} • Venue: {p.collegeName}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{p.startDate} to {p.endDate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Feedback Summary</h3>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Average rating of 9.4 based on student feedback comments.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Projects Overview */}
      {subTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Active Training Campaigns</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Bootcamp Campaign</th>
                  <th style={{ padding: '10px' }}>College</th>
                  <th style={{ padding: '10px' }}>Assigned Trainer</th>
                  <th style={{ padding: '10px' }}>Duration</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>NPS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.title}</td>
                    <td style={{ padding: '12px' }}>{p.collegeName}</td>
                    <td style={{ padding: '12px' }}>{p.trainerName}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.startDate} to {p.endDate}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                        background: p.status === 'Active' ? '#e8f5e9' : p.status === 'Planned' ? '#e3f2fd' : '#f5f5f5',
                        color: p.status === 'Active' ? '#2e7d32' : p.status === 'Planned' ? '#1565c0' : '#616161'
                      }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{p.npsScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Project Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Create Training Project</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Project Title</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="React JS Bootcamp" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>College Venue</label>
                <select value={newCollege} onChange={e => setNewCollege(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="MIT Pune">MIT Pune</option>
                  <option value="Stanford University">Stanford University</option>
                  <option value="VIT Vellore">VIT Vellore</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Assign Trainer</label>
                <select value={newTrainer} onChange={e => setNewTrainer(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Dr. Alan Smith">Dr. Alan Smith</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>Start Date</label>
                  <input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>End Date</label>
                  <input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
                </div>
              </div>
              <button onClick={handleCreateProject} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Schedule Slots Tab */}
      {subTab === 'schedule' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Camp Schedule Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {slots.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'var(--color-linen)', borderRadius: '10px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '4px', fontWeight: 'bold' }}>{s.type}</span>
                    <h5 style={{ fontWeight: 'bold', margin: '6px 0 2px 0', fontSize: '14px' }}>{s.title}</h5>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {s.time}</span>
                  </div>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                    background: s.status === 'Completed' ? '#e8f5e9' : s.status === 'Ongoing' ? '#fff8e1' : '#f5f5f5',
                    color: s.status === 'Completed' ? '#2e7d32' : s.status === 'Ongoing' ? '#f57f17' : '#616161'
                  }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Slot</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Slot Title</label>
                <input type="text" value={newSlotTitle} onChange={e => setNewSlotTitle(e.target.value)} placeholder="Redux Middleware Dev" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Time Range</label>
                <input type="text" value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} placeholder="e.g. 02:00 PM - 03:30 PM" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Type</label>
                <select value={newSlotType} onChange={e => setNewSlotType(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Theory">Theory Lecture</option>
                  <option value="Practical">Practical Session</option>
                  <option value="Lab">Lab Exercise</option>
                </select>
              </div>
              <button onClick={handleAddSlot} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Sheet */}
      {subTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Student Daily Attendance Sheet</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attendance.map(a => (
              <div key={a.studentId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--color-linen)', borderRadius: '8px', alignItems: 'center' }}>
                <span style={{ fontWeight: '500', fontSize: '14px' }}>{a.name} <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({a.studentId})</span></span>
                <button 
                  onClick={() => handleToggleAttendance(a.studentId)}
                  style={{
                    border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                    background: a.present ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: a.present ? '#10B981' : '#EF4444'
                  }}
                >
                  {a.present ? 'Present' : 'Absent'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessments Log */}
      {subTab === 'assessments' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Bootcamp Assessments Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assessments.map(ass => (
              <div key={ass.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{ass.name}</span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Average Batch Score: {ass.avgScore}</p>
                </div>
                <span style={{ 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                  background: ass.completed ? '#e8f5e9' : '#fff8e1', color: ass.completed ? '#2e7d32' : '#f57f17'
                }}>{ass.completed ? 'Completed' : 'Pending Evaluation'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Metrics NPS */}
      {subTab === 'feedback' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Student Feedback Comments (NPS)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feedbacks.map(f => (
              <div key={f.id} style={{ padding: '12px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
                <div style={{ padding: '6px 12px', background: 'var(--color-secondary)', color: 'white', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', height: 'fit-content' }}>
                  {f.rating}
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>{f.studentName}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>"{f.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates Generator */}
      {subTab === 'certificates' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Generate Bootcamp Completion Certificates</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {attendance.map(a => (
              <div key={a.studentId} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', margin: 0 }}>{a.name}</h5>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Course: React JS & Web Bootcamp</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => addToast(`Certificate issued for ${a.name}!`, 'success')} style={{ border: 'none', background: 'var(--color-secondary)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Issue Certificate
                  </button>
                  <button onClick={() => addToast('Downloading certificate PDF...', 'info')} style={{ border: 'none', background: 'var(--color-linen)', color: 'var(--color-text-muted)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPlanning;
