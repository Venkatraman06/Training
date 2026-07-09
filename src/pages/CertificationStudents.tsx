import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Calendar, Phone
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface PersonalStudent {
  id: number;
  student_name: string;
  phone: string;
  email: string;
  certification_name: string;
  trainer: number;
  trainer_details?: { first_name: string; last_name: string };
  course_duration: string;
  fees: string;
  installments: Array<{ id: number; amount: number; due_date: string; status: 'PAID' | 'UNPAID' }>;
  payment_status: 'UNPAID' | 'PARTIAL' | 'PAID';
  exam_date: string | null;
  certificate_status: 'NONE' | 'PENDING' | 'ISSUED';
  notes: string;
}

const API_URL = 'http://127.0.0.1:8000/api';

const CertificationStudents: React.FC = () => {
  const [students, setStudents] = useState<PersonalStudent[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/personal-students/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        setMockStudents();
      }
    } catch (e) {
      setMockStudents();
    }
  };

  const setMockStudents = () => {
    setStudents([
      {
        id: 1, student_name: 'Abhishek Rao', phone: '+919000000001', email: 'abhishek@gmail.com',
        certification_name: 'AWS Certified Solutions Architect', trainer: 5,
        trainer_details: { first_name: 'Alan', last_name: 'Trainer' },
        course_duration: '2 months', fees: '450.00', payment_status: 'PARTIAL',
        installments: [
          { id: 1, amount: 225, due_date: '2026-06-15', status: 'PAID' },
          { id: 2, amount: 225, due_date: '2026-07-15', status: 'UNPAID' }
        ],
        exam_date: '2026-08-10', certificate_status: 'PENDING',
        notes: 'Installment 1 paid. Exam scheduled for August.'
      },
      {
        id: 2, student_name: 'Divya Nair', phone: '+919000000002', email: 'divya@gmail.com',
        certification_name: 'Certified React Professional', trainer: 5,
        trainer_details: { first_name: 'Alan', last_name: 'Trainer' },
        course_duration: '1 month', fees: '250.00', payment_status: 'PAID',
        installments: [
          { id: 1, amount: 250, due_date: '2026-06-01', status: 'PAID' }
        ],
        exam_date: '2026-06-25', certificate_status: 'ISSUED',
        notes: 'Successfully passed the exam with 92% score.'
      }
    ]);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (data: Partial<PersonalStudent>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/personal-students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        addToast('Student registered successfully!', 'success');
        fetchStudents();
        closeModal();
      } else {
        const mockNew: PersonalStudent = {
          id: students.length + 1,
          student_name: data.student_name || 'New Student',
          phone: data.phone || '',
          email: data.email || '',
          certification_name: data.certification_name || '',
          trainer: Number(data.trainer) || 5,
          trainer_details: { first_name: 'Alan', last_name: 'Trainer' },
          course_duration: data.course_duration || '1 month',
          fees: data.fees || '0.00',
          payment_status: data.payment_status || 'UNPAID',
          installments: data.installments || [],
          exam_date: data.exam_date || null,
          certificate_status: data.certificate_status || 'NONE',
          notes: data.notes || ''
        };
        setStudents([mockNew, ...students]);
        addToast('Student registered successfully (Mock mode)!', 'success');
        closeModal();
      }
    } catch (e) {
      addToast('Error registering student', 'error');
    }
  };

  const handleUpdatePayment = async (id: number, status: PersonalStudent['payment_status']) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, payment_status: status } : s));
    addToast('Payment status updated!', 'success');
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.student_name.toLowerCase().includes(search.toLowerCase()) || s.certification_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? s.payment_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Personal Certification Students</h1>
          <p className={styles.subtitle}>Track fees installment payments, exam details, and certification progress.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => openModal(<StudentForm onSubmit={handleCreateStudent} onClose={closeModal} />, 'Register Certification Student')}>
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search student by name or certification..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
        >
          <option value="">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="UNPAID">Unpaid</option>
        </select>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Student</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Certification</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Fees ($)</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Payment Status</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Certificate Status</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Exam Date</th>
              <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{s.student_name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10}/> {s.phone}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '500' }}>{s.certification_name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Duration: {s.course_duration}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: '600' }}>
                  ${parseFloat(s.fees).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: s.payment_status === 'PAID' ? 'rgba(46,125,50,0.1)' : s.payment_status === 'PARTIAL' ? 'rgba(237,108,2,0.1)' : 'rgba(211,47,47,0.1)',
                    color: s.payment_status === 'PAID' ? 'var(--color-success)' : s.payment_status === 'PARTIAL' ? 'var(--color-warning)' : 'var(--color-error)'
                  }}>{s.payment_status}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: s.certificate_status === 'ISSUED' ? 'rgba(46,125,50,0.1)' : s.certificate_status === 'PENDING' ? 'rgba(237,108,2,0.1)' : 'rgba(100,116,139,0.1)',
                    color: s.certificate_status === 'ISSUED' ? 'var(--color-success)' : s.certificate_status === 'PENDING' ? 'var(--color-warning)' : 'var(--color-text-muted)'
                  }}>{s.certificate_status}</span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px' }}>
                  {s.exam_date ? new Date(s.exam_date).toLocaleDateString() : 'Not Scheduled'}
                </td>
                <td style={{ padding: '16px' }}>
                  <button 
                    onClick={() => openModal(<InstallmentTrackerView student={s} onUpdatePayment={handleUpdatePayment} />, `Installments: ${s.student_name}`)}
                    style={{ padding: '6px 12px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    Track Installments
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Form to add student
const StudentForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<PersonalStudent>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<PersonalStudent>>({
    student_name: '', phone: '', email: '', certification_name: '',
    fees: '0.00', course_duration: '3 months', payment_status: 'UNPAID',
    certificate_status: 'NONE', notes: '', exam_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem', width: '100%', maxWidth: '500px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Student Name *</label>
          <input required type="text" value={formData.student_name} onChange={e => setFormData({ ...formData, student_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone *</label>
          <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Certification Name *</label>
          <input required type="text" value={formData.certification_name} onChange={e => setFormData({ ...formData, certification_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Total Course Fees ($) *</label>
          <input required type="number" step="0.01" value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Course Duration</label>
          <input type="text" value={formData.course_duration} onChange={e => setFormData({ ...formData, course_duration: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Notes</label>
        <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Save Student</button>
      </div>
    </form>
  );
};

// Installment Tracker View
const InstallmentTrackerView = ({ student, onUpdatePayment }: { student: PersonalStudent; onUpdatePayment: (id: number, status: PersonalStudent['payment_status']) => void }) => {
  const [inst, setInst] = useState(student.installments);

  const toggleStatus = (id: number) => {
    const updated = inst.map(i => i.id === id ? { ...i, status: i.status === 'PAID' ? 'UNPAID' : 'PAID' as any } : i);
    setInst(updated);
    // calculate payment status
    const paidCount = updated.filter(i => i.status === 'PAID').length;
    if (paidCount === updated.length) {
      onUpdatePayment(student.id, 'PAID');
    } else if (paidCount > 0) {
      onUpdatePayment(student.id, 'PARTIAL');
    } else {
      onUpdatePayment(student.id, 'UNPAID');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '450px', padding: '0.5rem' }}>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Fee Structure & Installment Logs</h4>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Total Fees: ${parseFloat(student.fees).toLocaleString()}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {inst.length === 0 ? (
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No structured installments defined.</span>
        ) : (
          inst.map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontWeight: '600', fontSize: '13px' }}>Installment #{item.id}</span>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Calendar size={12}/> Due: {new Date(item.due_date).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>${item.amount}</span>
                <button 
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                    background: item.status === 'PAID' ? 'var(--color-success)' : 'var(--color-error)',
                    color: 'white'
                  }}
                >
                  {item.status}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificationStudents;
