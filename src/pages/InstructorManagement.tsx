import React from 'react';
import { Star, Calendar, UserPlus, Sparkles } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const instructors = [
  {
    id: 1,
    name: 'Dr. Alan Smith',
    role: 'Senior Technical Trainer',
    skills: ['React', 'Node.js', 'System Design'],
    rating: 4.8,
    trainings: 12,
    avatar: 'https://i.pravatar.cc/150?img=11',
    availability: 'Available'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Full Stack Instructor',
    skills: ['Python', 'Django', 'React'],
    rating: 4.9,
    trainings: 8,
    avatar: 'https://i.pravatar.cc/150?img=5',
    availability: 'In Training'
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Cloud Architect',
    skills: ['AWS', 'Azure', 'DevOps'],
    rating: 4.7,
    trainings: 5,
    avatar: 'https://i.pravatar.cc/150?img=14',
    availability: 'On Leave'
  }
];

const InstructorForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  
  const handleSubmit = () => {
    addToast('Instructor successfully added to roster!', 'success');
    onClose();
  };

  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Instructor Name</label>
      <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Skills (comma separated)</label>
      <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={handleSubmit} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Save Instructor</button>
    </div>
  </div>
)};

const AIMatchModal = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  
  const [matching, setMatching] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setMatching(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
      {matching ? (
        <>
          <Sparkles size={48} color="var(--color-camel)" style={{ animation: 'pulse 1.5s infinite' }} />
          <p style={{ color: 'var(--color-espresso)', fontWeight: 'bold' }}>TrainOps AI is analyzing project requirements...</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Matching skills, availability, and past ratings.</p>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--color-bg)', padding: '1rem', borderRadius: '12px', width: '100%' }}>
            <img src={instructors[0].avatar} alt={instructors[0].name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>{instructors[0].name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-success)' }}>98% Match for Advanced React Bootcamp</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', background: 'var(--color-khaki)', padding: '2px 8px', borderRadius: '12px' }}>React</span>
                <span style={{ fontSize: '11px', background: 'var(--color-khaki)', padding: '2px 8px', borderRadius: '12px' }}>Available</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { addToast('Instructor officially assigned to project!', 'success'); onClose(); }}
            style={{ padding: '12px 24px', width: '100%', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
            Confirm Assignment
          </button>
        </>
      )}
    </div>
  );
};

const InstructorManagement: React.FC = () => {
  const { openModal, closeModal } = useModal();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Instructor Management</h1>
        <div className={styles.actions}>
          <button 
            className={styles.btnSecondary} 
            onClick={() => openModal(<AIMatchModal onClose={closeModal} />, 'AI Trainer Matcher')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} /> AI Match
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={() => openModal(<InstructorForm onClose={closeModal} />, 'Add New Instructor')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} /> Add Instructor
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {instructors.map(instructor => (
          <div key={instructor.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={instructor.avatar} alt={instructor.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>{instructor.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{instructor.role}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {instructor.skills.map(skill => (
                <span key={skill} style={{ fontSize: '11px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '12px', color: 'var(--color-espresso)' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-main)' }}>
                <Star size={14} color="#ED6C02" fill="#ED6C02" /> {instructor.rating}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <Calendar size={14} /> {instructor.trainings} Trainings
              </div>
            </div>

            <div style={{ 
              marginTop: '4px', textAlign: 'center', padding: '6px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold',
              backgroundColor: instructor.availability === 'Available' ? 'rgba(46, 125, 50, 0.1)' : instructor.availability === 'In Training' ? 'rgba(237, 108, 2, 0.1)' : 'rgba(211, 47, 47, 0.1)',
              color: instructor.availability === 'Available' ? 'var(--color-success)' : instructor.availability === 'In Training' ? 'var(--color-warning)' : 'var(--color-error)'
            }}>
              {instructor.availability}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorManagement;
