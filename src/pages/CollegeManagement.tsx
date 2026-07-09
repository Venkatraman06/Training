import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, GraduationCap, MapPin, Phone, Mail, 
  Globe, Eye
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface College {
  id: number;
  name: string;
  address: string;
  district: string;
  state: string;
  website: string;
  principal_name: string;
  principal_phone: string;
  principal_email: string;
  placement_officer_name: string;
  placement_officer_phone: string;
  placement_officer_email: string;
  coordinator_name: string;
  coordinator_phone: string;
  coordinator_email: string;
  notes: string;
}

const API_URL = 'http://127.0.0.1:8000/api';

const CollegeManagement: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/colleges/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      } else {
        setMockColleges();
      }
    } catch (e) {
      setMockColleges();
    }
  };

  const setMockColleges = () => {
    setColleges([
      {
        id: 1, name: 'MIT Pune', address: 'Kothrud, Pune', district: 'Pune', state: 'Maharashtra',
        website: 'https://mitpune.edu.in', principal_name: 'Dr. Prasad', principal_phone: '+9198765431', principal_email: 'prasad@mit.edu',
        placement_officer_name: 'Prof. Deshmukh', placement_officer_phone: '+9198765432', placement_officer_email: 'placement@mit.edu',
        coordinator_name: 'Mrs. Kulkarni', coordinator_phone: '+9198765433', coordinator_email: 'coordinator@mit.edu',
        notes: 'Long term training partner. Strong infrastructure.'
      },
      {
        id: 2, name: 'VIT Vellore', address: 'Katpadi, Vellore', district: 'Vellore', state: 'Tamil Nadu',
        website: 'https://vit.ac.in', principal_name: 'Dr. Rambabu', principal_phone: '+9199999991', principal_email: 'rambabu@vit.ac.in',
        placement_officer_name: 'Prof. Suresh', placement_officer_phone: '+9199999992', placement_officer_email: 'suresh@vit.ac.in',
        coordinator_name: 'Dr. Parthasarathy', coordinator_phone: '+9199999993', coordinator_email: 'partha@vit.ac.in',
        notes: 'Interested in annual AI/ML workshops.'
      }
    ]);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleCreateCollege = async (data: Partial<College>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/colleges/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        addToast('College registered successfully!', 'success');
        fetchColleges();
        closeModal();
      } else {
        const mockNew: College = {
          id: colleges.length + 1,
          name: data.name || 'New College',
          address: data.address || '',
          district: data.district || '',
          state: data.state || '',
          website: data.website || '',
          principal_name: data.principal_name || '',
          principal_phone: data.principal_phone || '',
          principal_email: data.principal_email || '',
          placement_officer_name: data.placement_officer_name || '',
          placement_officer_phone: data.placement_officer_phone || '',
          placement_officer_email: data.placement_officer_email || '',
          coordinator_name: data.coordinator_name || '',
          coordinator_phone: data.coordinator_phone || '',
          coordinator_email: data.coordinator_email || '',
          notes: data.notes || ''
        };
        setColleges([mockNew, ...colleges]);
        addToast('College registered successfully (Mock mode)!', 'success');
        closeModal();
      }
    } catch (e) {
      addToast('Error registering college', 'error');
    }
  };

  const filtered = colleges.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.district.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState ? c.state === selectedState : true;
    return matchesSearch && matchesState;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>College Management</h1>
          <p className={styles.subtitle}>Maintain institutional records, training histories, and profile logs.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => openModal(<CollegeForm onSubmit={handleCreateCollege} onClose={closeModal} />, 'Add College Profile')}>
          <Plus size={16} /> Register College
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search college by name or district..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
          />
        </div>
        <select 
          value={selectedState} 
          onChange={e => setSelectedState(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Karnataka">Karnataka</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(college => (
          <div key={college.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--color-border)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{college.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <MapPin size={12} /> {college.district}, {college.state}
                </span>
              </div>
              <GraduationCap size={24} style={{ color: 'var(--color-secondary)' }} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div><strong>Placement Officer:</strong> {college.placement_officer_name || 'N/A'}</div>
              {college.placement_officer_email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}><Mail size={12}/> {college.placement_officer_email}</div>}
              {college.placement_officer_phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}><Phone size={12}/> {college.placement_officer_phone}</div>}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
              {college.website && (
                <a href={college.website} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <Globe size={12}/> Website
                </a>
              )}
              <button 
                onClick={() => openModal(<CollegeProfileView college={college} />, `College Profile: ${college.name}`)}
                style={{ padding: '6px 12px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', marginLeft: 'auto' }}
              >
                <Eye size={12} /> View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// College Form
const CollegeForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<College>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<College>>({
    name: '', address: '', district: '', state: '', website: '',
    principal_name: '', principal_phone: '', principal_email: '',
    placement_officer_name: '', placement_officer_phone: '', placement_officer_email: '',
    coordinator_name: '', coordinator_phone: '', coordinator_email: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem', width: '100%', maxWidth: '600px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>College Name *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>District</label>
          <input type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>State</label>
          <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Website URL</label>
          <input type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>

        {/* Contacts section */}
        <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px', marginTop: '6px' }}>Placement Officer Contacts</div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Name</label>
          <input type="text" value={formData.placement_officer_name} onChange={e => setFormData({ ...formData, placement_officer_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone</label>
          <input type="text" value={formData.placement_officer_phone} onChange={e => setFormData({ ...formData, placement_officer_phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>

        <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px', marginTop: '6px' }}>Principal Contacts</div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Principal Name</label>
          <input type="text" value={formData.principal_name} onChange={e => setFormData({ ...formData, principal_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Principal Email</label>
          <input type="email" value={formData.principal_email} onChange={e => setFormData({ ...formData, principal_email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>General Notes</label>
        <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Save College</button>
      </div>
    </form>
  );
};

// Profile Page Details Drawer View
const CollegeProfileView = ({ college }: { college: College }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px', padding: '0.5rem' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{college.name}</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>{college.address}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--color-border)' }}>
          <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Principal Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
            <span><strong>Name:</strong> {college.principal_name || 'N/A'}</span>
            <span><strong>Email:</strong> {college.principal_email || 'N/A'}</span>
            <span><strong>Phone:</strong> {college.principal_phone || 'N/A'}</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--color-border)' }}>
          <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Coordinator Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
            <span><strong>Name:</strong> {college.coordinator_name || 'N/A'}</span>
            <span><strong>Email:</strong> {college.coordinator_email || 'N/A'}</span>
            <span><strong>Phone:</strong> {college.coordinator_phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--color-border)' }}>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Placement Contacts</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
          <span><strong>Placement Officer:</strong> {college.placement_officer_name || 'N/A'}</span>
          <span><strong>Email:</strong> {college.placement_officer_email || 'N/A'}</span>
          <span><strong>Phone:</strong> {college.placement_officer_phone || 'N/A'}</span>
        </div>
      </div>

      <div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Uploaded Documents & Notes</h4>
        <p style={{ fontSize: '13px', background: 'var(--color-bg)', padding: '10px', borderRadius: '6px', margin: 0 }}>
          {college.notes || 'No general notes logged.'}
        </p>
      </div>
    </div>
  );
};

export default CollegeManagement;
