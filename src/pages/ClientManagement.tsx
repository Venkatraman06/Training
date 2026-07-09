import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Mail, Phone, Star
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface Client {
  id: number;
  name: string;
  company: string;
  college: string;
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string;
  relationship_score: number;
  status: string;
  notes: string;
}

const API_URL = 'http://127.0.0.1:8000/api';

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        setMockClients();
      }
    } catch (e) {
      setMockClients();
    }
  };

  const setMockClients = () => {
    setClients([
      {
        id: 1, name: 'MIT Pune', company: 'MAEER Group', college: 'MIT Pune CS Dept',
        contact_person: 'Dr. Karad', phone: '+919876543', whatsapp: '+919876543',
        email: 'admin@mitpune.edu', relationship_score: 95, status: 'Active',
        notes: 'Long term training partner. Highly satisfied.'
      },
      {
        id: 2, name: 'VIT Vellore', company: 'Vellore Tech', college: 'VIT Chennai Campus',
        contact_person: 'Prof. Viswanathan', phone: '+919999999', whatsapp: '+919999999',
        email: 'placement@vit.ac.in', relationship_score: 90, status: 'Active',
        notes: 'Good potential for future workshops.'
      }
    ]);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (data: Partial<Client>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        addToast('Client created successfully!', 'success');
        fetchClients();
        closeModal();
      } else {
        const mockNew: Client = {
          id: clients.length + 1,
          name: data.name || 'New Client',
          company: data.company || '',
          college: data.college || '',
          contact_person: data.contact_person || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          relationship_score: Number(data.relationship_score) || 80,
          status: data.status || 'Active',
          notes: data.notes || ''
        };
        setClients([mockNew, ...clients]);
        addToast('Client created successfully (Mock mode)!', 'success');
        closeModal();
      }
    } catch (e) {
      addToast('Error saving client', 'error');
    }
  };

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_person.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Client CRM</h1>
          <p className={styles.subtitle}>Track business accounts, relationship scores, and communication history.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => openModal(<ClientForm onSubmit={handleCreateClient} onClose={closeModal} />, 'Add Account Client')}>
          <Plus size={16} /> New Client
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search accounts, companies, contact persons..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(client => (
          <div key={client.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{client.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{client.company}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(37,99,235,0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                <Star size={12} fill="var(--color-secondary)"/> Score: {client.relationship_score}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div><strong>Primary Contact:</strong> {client.contact_person}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}><Mail size={12}/> {client.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}><Phone size={12}/> {client.phone}</div>
            </div>

            <button 
              onClick={() => openModal(<ClientDetailView client={client} />, `Client Account Profile: ${client.name}`)}
              style={{ width: '100%', padding: '8px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', border: 'none', marginTop: '10px' }}
            >
              View Dedicated Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form to add client
const ClientForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<Client>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '', company: '', college: '', contact_person: '',
    phone: '', whatsapp: '', email: '', relationship_score: 90,
    status: 'Active', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem', width: '100%', maxWidth: '500px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Client Name *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Company Group</label>
          <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Contact Person *</label>
          <input required type="text" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Relationship Score *</label>
          <input required type="number" min="0" max="100" value={formData.relationship_score} onChange={e => setFormData({ ...formData, relationship_score: Number(e.target.value) })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone</label>
          <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Notes</label>
        <textarea rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Save Client</button>
      </div>
    </form>
  );
};

// Client Details drawer View
const ClientDetailView = ({ client }: { client: Client }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '500px', padding: '0.5rem' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{client.name}</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>{client.company}</p>
      </div>

      <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--color-border)', fontSize: '13px' }}>
        <div><strong>Placement Head:</strong> {client.contact_person}</div>
        <div><strong>Email Address:</strong> {client.email}</div>
        <div><strong>Phone/WhatsApp:</strong> {client.phone}</div>
        <div><strong>Relationship Score:</strong> {client.relationship_score}%</div>
      </div>

      <div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>Client Contract History</h4>
        <p style={{ fontSize: '13px', background: 'var(--color-bg)', padding: '10px', borderRadius: '6px', margin: 0 }}>
          {client.notes || 'No notes logged.'}
        </p>
      </div>
    </div>
  );
};

export default ClientManagement;
