import React, { useState } from 'react';
import { Search, UserPlus, FileDown, MoreVertical, Activity } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const students = [
  { id: 'STU001', name: 'John Doe', email: 'john.doe@mitpune.edu', course: 'React Bootcamp', attendance: '92%', status: 'Active' },
  { id: 'STU002', name: 'Jane Smith', email: 'jane.smith@mitpune.edu', course: 'React Bootcamp', attendance: '88%', status: 'Active' },
  { id: 'STU003', name: 'Rahul Kumar', email: 'rahul.k@iitb.edu', course: 'Data Science', attendance: '95%', status: 'Active' },
  { id: 'STU004', name: 'Sneha Patel', email: 'sneha.p@vit.edu', course: 'Cloud Computing', attendance: '100%', status: 'Active' },
  { id: 'STU005', name: 'Amit Singh', email: 'amit.s@srm.edu', course: 'Java Full Stack', attendance: '45%', status: 'At Risk' }
];

const StudentForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  
  const handleSubmit = () => {
    addToast('Student successfully registered!', 'success');
    onClose();
  };

  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>First Name</label>
        <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Last Name</label>
        <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
      </div>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Email Address</label>
      <input type="email" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Assign to Training</label>
      <select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <option>React Bootcamp - MIT Pune</option>
        <option>Data Science - IIT Bombay</option>
      </select>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={handleSubmit} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Add Student</button>
    </div>
  </div>
)};

const SkillRadarModal = ({ studentName }: { studentName: string }) => {
  const skillsData = [
    { subject: 'Frontend', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: 'Backend', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: 'Database', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: 'DevOps', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
    { subject: 'System Design', A: Math.floor(Math.random() * 50) + 50, fullMark: 100 },
  ];

  return (
    <div style={{ height: '300px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '1rem' }}>Skill progression map for {studentName}</p>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
          <PolarGrid stroke="rgba(215, 201, 184, 0.5)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-espresso)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name={studentName} dataKey="A" stroke="var(--color-camel)" fill="var(--color-camel)" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const StudentManagement: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Student Management</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => addToast('Exporting student data to CSV...', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileDown size={16} /> Export</button>
          <button 
            className={styles.btnPrimary} 
            onClick={() => openModal(<StudentForm onClose={closeModal} />, 'Register New Student')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }} 
            />
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Total: 1,432 Students</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Student ID</th>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Assigned Course</th>
                <th style={{ padding: '12px' }}>Attendance</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(215, 201, 184, 0.2)' }}>
                  <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '500' }}>{student.id}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-espresso)', fontWeight: '600' }}>{student.name}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'var(--color-text-muted)' }}>{student.email}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px' }}>{student.course}</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 'bold', color: parseInt(student.attendance) > 75 ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {student.attendance}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: student.status === 'Active' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                      color: student.status === 'Active' ? 'var(--color-success)' : 'var(--color-error)'
                    }}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => openModal(<SkillRadarModal studentName={student.name} />, `${student.name} - Skill Matrix`)}
                      style={{ color: 'var(--color-camel)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <Activity size={14} /> Skills
                    </button>
                    <button style={{ color: 'var(--color-text-muted)' }}><MoreVertical size={16} /></button>
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

export default StudentManagement;
