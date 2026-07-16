import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

const API_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('token');

const apiCall = async (endpoint: string, method = 'GET', body?: object) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (method === 'DELETE') return null;
  return res.json();
};

interface Lead {
  id: number;
  name: string;
  company: string | null;
  college: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  status: 'LEAD' | 'CONTACTED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  expected_deal_value: string;
  remarks: string | null;
  follow_up_date: string | null;
  created_at: string;
}

interface Proposal {
  id: number;
  title: string;
  client: number;
  client_details?: { id: number; name: string };
  training_cost: string;
  discount: string;
  gst: string;
  status: 'PENDING' | 'WON' | 'LOST';
}

const STATUS_LABEL: Record<Lead['status'], string> = {
  LEAD: 'New Lead',
  CONTACTED: 'Contacted',
  PROPOSAL_SENT: 'Proposal Sent',
  WON: 'Won',
  LOST: 'Lost',
};

const STATUS_COLOR: Record<Lead['status'], string> = {
  LEAD: '#6366f1',
  CONTACTED: '#F59E0B',
  PROPOSAL_SENT: '#3B82F6',
  WON: '#10B981',
  LOST: '#EF4444',
};

const SalesCRM: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [subTab, setSubTab] = useState<'dashboard' | 'opportunities' | 'quotations' | 'followup' | 'meetings' | 'documents'>('opportunities');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);

  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    college: '',
    contact_person: '',
    phone: '',
    email: '',
    status: 'LEAD' as Lead['status'],
    priority: 'MEDIUM' as Lead['priority'],
    expected_deal_value: '',
    remarks: '',
  });

  const [newProposal, setNewProposal] = useState({
    title: '',
    training_cost: '',
    discount: '',
  });

  const [salesMeetings, setSalesMeetings] = useState([
    { id: 1, clientName: 'MIT Pune', title: 'Pricing & Contract Discussion', date: '2026-07-08', time: '11:00 AM', outcome: 'Need updated GST proposal' },
    { id: 2, clientName: 'VIT Vellore', title: 'Data Science Demo Session', date: '2026-07-09', time: '03:00 PM', outcome: 'Syllabus accepted by Placement Team' },
  ]);
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetClient, setMeetClient] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/sales/dashboard')) setSubTab('dashboard');
    else if (path.includes('/sales/opportunities')) setSubTab('opportunities');
    else if (path.includes('/sales/quotes')) setSubTab('quotations');
    else if (path.includes('/sales/followups')) setSubTab('followup');
    else if (path.includes('/sales/meetings')) setSubTab('meetings');
    else if (path.includes('/sales/documents')) setSubTab('documents');
    else setSubTab('opportunities');
  }, [location.pathname]);

  const handleTabChange = (tab: typeof subTab) => {
    const routes: Record<typeof subTab, string> = {
      dashboard: '/sales/dashboard',
      opportunities: '/sales/opportunities',
      quotations: '/sales/quotes',
      followup: '/sales/followups',
      meetings: '/sales/meetings',
      documents: '/sales/documents',
    };
    navigate(routes[tab]);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/leads/');
      setLeads(data.results ?? data);
    } catch {
      addToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const data = await apiCall('/proposals/');
      setProposals(data.results ?? data);
    } catch {
      addToast('Failed to load proposals', 'error');
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchProposals();
  }, []);

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.expected_deal_value) {
      addToast('Name and deal value are required', 'error');
      return;
    }
    try {
      const created = await apiCall('/leads/', 'POST', {
        name: newLead.name,
        company: newLead.company || null,
        college: newLead.college || null,
        contact_person: newLead.contact_person || null,
        phone: newLead.phone || null,
        email: newLead.email || null,
        status: newLead.status,
        priority: newLead.priority,
        expected_deal_value: newLead.expected_deal_value,
        remarks: newLead.remarks || null,
        follow_up_date: null,
        next_follow_up: null,
        last_contact_date: null,
      });
      setLeads(prev => [created, ...prev]);
      setNewLead({ name: '', company: '', college: '', contact_person: '', phone: '', email: '', status: 'LEAD', priority: 'MEDIUM', expected_deal_value: '', remarks: '' });
      addToast('Lead added successfully!', 'success');
    } catch {
      addToast('Failed to create lead', 'error');
    }
  };

  const handleUpdateLeadStatus = async (id: number, status: Lead['status']) => {
    try {
      const updated = await apiCall(`/leads/${id}/`, 'PATCH', { status });
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      addToast(`Lead moved to ${STATUS_LABEL[status]}`, 'success');
    } catch {
      addToast('Failed to update lead', 'error');
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.training_cost) {
      addToast('Title and training cost are required', 'error');
      return;
    }
    try {
      const cost = parseFloat(newProposal.training_cost);
      const disc = parseFloat(newProposal.discount || '0');
      const gst = ((cost - disc) * 0.18).toFixed(2);
      const created = await apiCall('/proposals/', 'POST', {
        title: newProposal.title,
        training_cost: cost,
        discount: disc,
        gst,
        status: 'PENDING',
        client: 1,
      });
      setProposals(prev => [created, ...prev]);
      setNewProposal({ title: '', training_cost: '', discount: '' });
      addToast('Proposal created!', 'success');
    } catch {
      addToast('Failed to create proposal. Make sure at least one Client exists.', 'error');
    }
  };

  const handleAddMeeting = () => {
    if (!meetTitle || !meetDate || !meetTime) {
      addToast('Please fill all meeting details', 'error');
      return;
    }
    setSalesMeetings(prev => [...prev, { id: Date.now(), clientName: meetClient, title: meetTitle, date: meetDate, time: meetTime, outcome: 'Scheduled' }]);
    setMeetTitle(''); setMeetDate(''); setMeetTime('');
    addToast('Meeting scheduled!', 'success');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px', borderRadius: '8px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-main)',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' };

  const wonLeads = leads.filter(l => l.status === 'WON');
  const activeLeads = leads.filter(l => l.status === 'LEAD' || l.status === 'CONTACTED');
  const wonValue = wonLeads.reduce((sum, l) => sum + parseFloat(l.expected_deal_value || '0'), 0);
  const pipelineValue = leads.reduce((sum, l) => sum + parseFloat(l.expected_deal_value || '0'), 0);

  const STATUSES: Lead['status'][] = ['LEAD', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Sales CRM Hub</h1>
          <p className={styles.subtitle}>Track deal opportunities, quotations, contracts, and revenue conversions.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'opportunities', 'quotations', 'followup', 'meetings', 'documents'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 'bold',
              background: subTab === tab ? 'var(--color-secondary)' : 'transparent',
              color: subTab === tab ? 'white' : 'var(--color-text-muted)',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}
          >
            {tab === 'followup' ? 'Follow-up' : tab}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Won Revenue</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#10B981' }}>₹{wonValue.toLocaleString()}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pipeline Value</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-secondary)' }}>₹{pipelineValue.toLocaleString()}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Active Leads</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-accent)' }}>{activeLeads.length}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Leads</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#F59E0B' }}>{leads.length}</h3>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Pipeline Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leads.slice(0, 8).map(lead => (
                <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{lead.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{lead.company || lead.college || '—'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', color: 'var(--color-secondary)' }}>₹{parseFloat(lead.expected_deal_value).toLocaleString()}</strong>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: STATUS_COLOR[lead.status] + '22', color: STATUS_COLOR[lead.status], borderRadius: '4px', fontWeight: 'bold' }}>
                      {STATUS_LABEL[lead.status]}
                    </span>
                  </div>
                </div>
              ))}
              {leads.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No leads yet. Add one in Opportunities tab.</p>}
            </div>
          </div>
        </div>
      )}

      {/* OPPORTUNITIES */}
      {subTab === 'opportunities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            {loading && <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Loading leads...</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', gap: '1rem' }}>
              {STATUSES.map(status => {
                const statusLeads = leads.filter(l => l.status === status);
                return (
                  <div key={status} style={{ background: 'var(--color-linen)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${STATUS_COLOR[status]}`, paddingBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</span>
                      <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--color-surface)', borderRadius: '8px', fontWeight: 'bold' }}>{statusLeads.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                      {statusLeads.map(lead => (
                        <div key={lead.id} className="glass-panel" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--color-border)' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{lead.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{lead.company || lead.college || '—'}</span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>₹{parseFloat(lead.expected_deal_value).toLocaleString()}</span>
                          <span style={{ fontSize: '10px', color: lead.priority === 'HIGH' ? '#EF4444' : lead.priority === 'MEDIUM' ? '#F59E0B' : '#6B7280' }}>
                            {lead.priority} priority
                          </span>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                            {status !== 'CONTACTED' && status !== 'WON' && status !== 'LOST' && (
                              <button onClick={() => handleUpdateLeadStatus(lead.id, 'CONTACTED')} style={{ fontSize: '9px', background: '#fff8e1', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}>Contact</button>
                            )}
                            {status !== 'PROPOSAL_SENT' && status !== 'WON' && status !== 'LOST' && (
                              <button onClick={() => handleUpdateLeadStatus(lead.id, 'PROPOSAL_SENT')} style={{ fontSize: '9px', background: '#e3f2fd', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}>Proposal</button>
                            )}
                            {status !== 'WON' && status !== 'LOST' && (
                              <button onClick={() => handleUpdateLeadStatus(lead.id, 'WON')} style={{ fontSize: '9px', background: '#e8f5e9', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}>Won ✓</button>
                            )}
                            {status !== 'LOST' && (
                              <button onClick={() => handleUpdateLeadStatus(lead.id, 'LOST')} style={{ fontSize: '9px', background: '#ffebee', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 5px' }}>Lost ✗</button>
                            )}
                          </div>
                        </div>
                      ))}
                      {statusLeads.length === 0 && (
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '10px 0' }}>Empty</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Lead</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="Contact / Lead name" />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} value={newLead.company} onChange={e => setNewLead(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
              </div>
              <div>
                <label style={labelStyle}>College</label>
                <input style={inputStyle} value={newLead.college} onChange={e => setNewLead(p => ({ ...p, college: e.target.value }))} placeholder="College name" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9999999999" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Deal Value (₹) *</label>
                <input style={inputStyle} type="number" value={newLead.expected_deal_value} onChange={e => setNewLead(p => ({ ...p, expected_deal_value: e.target.value }))} placeholder="15000" />
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={inputStyle} value={newLead.priority} onChange={e => setNewLead(p => ({ ...p, priority: e.target.value as Lead['priority'] }))}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={newLead.status} onChange={e => setNewLead(p => ({ ...p, status: e.target.value as Lead['status'] }))}>
                  <option value="LEAD">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Remarks</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={newLead.remarks} onChange={e => setNewLead(p => ({ ...p, remarks: e.target.value }))} placeholder="Notes about this lead..." />
              </div>
              <button onClick={handleCreateLead} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUOTATIONS */}
      {subTab === 'quotations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Proposals</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Title</th>
                  <th style={{ padding: '10px' }}>Cost</th>
                  <th style={{ padding: '10px' }}>Discount</th>
                  <th style={{ padding: '10px' }}>GST (18%)</th>
                  <th style={{ padding: '10px' }}>Net</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(p => {
                  const cost = parseFloat(p.training_cost);
                  const disc = parseFloat(p.discount);
                  const gst = parseFloat(p.gst);
                  const net = cost - disc + gst;
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.title}</td>
                      <td style={{ padding: '12px' }}>₹{cost.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: 'var(--color-error)' }}>-₹{disc.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>₹{gst.toLocaleString()}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>₹{net.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: p.status === 'WON' ? '#e8f5e9' : p.status === 'LOST' ? '#ffebee' : '#e3f2fd', fontSize: '11px', fontWeight: 'bold' }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {proposals.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>No proposals yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Create Proposal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Proposal Title *</label>
                <input style={inputStyle} value={newProposal.title} onChange={e => setNewProposal(p => ({ ...p, title: e.target.value }))} placeholder="React JS Training Proposal" />
              </div>
              <div>
                <label style={labelStyle}>Training Cost (₹) *</label>
                <input style={inputStyle} type="number" value={newProposal.training_cost} onChange={e => setNewProposal(p => ({ ...p, training_cost: e.target.value }))} placeholder="18000" />
              </div>
              <div>
                <label style={labelStyle}>Discount (₹)</label>
                <input style={inputStyle} type="number" value={newProposal.discount} onChange={e => setNewProposal(p => ({ ...p, discount: e.target.value }))} placeholder="2000" />
              </div>
              {newProposal.training_cost && (
                <div style={{ background: 'var(--color-linen)', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Taxable</span>
                    <strong>₹{(parseFloat(newProposal.training_cost || '0') - parseFloat(newProposal.discount || '0')).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST 18%</span>
                    <strong>₹{Math.round((parseFloat(newProposal.training_cost || '0') - parseFloat(newProposal.discount || '0')) * 0.18).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '4px', borderTop: '1px solid var(--color-border)', paddingTop: '4px' }}>
                    <span>Net Total</span>
                    <strong style={{ color: 'var(--color-secondary)' }}>
                      ₹{Math.round((parseFloat(newProposal.training_cost || '0') - parseFloat(newProposal.discount || '0')) * 1.18).toLocaleString()}
                    </strong>
                  </div>
                </div>
              )}
              <button onClick={handleCreateProposal} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOW-UP */}
      {subTab === 'followup' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Lead Follow-up Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leads.filter(l => l.remarks || l.follow_up_date).map(lead => (
              <div key={lead.id} style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-secondary)' }}>{lead.name}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', background: STATUS_COLOR[lead.status] + '22', color: STATUS_COLOR[lead.status], borderRadius: '4px', fontWeight: 'bold' }}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>{lead.remarks || 'No remarks added.'}</p>
                {lead.follow_up_date && (
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Follow-up: {lead.follow_up_date}</span>
                )}
              </div>
            ))}
            {leads.filter(l => l.remarks || l.follow_up_date).length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No follow-up data. Add remarks when creating leads.</p>
            )}
          </div>
        </div>
      )}

      {/* MEETINGS */}
      {subTab === 'meetings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Demo Sessions & Meetings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Client</th>
                  <th style={{ padding: '10px' }}>Title</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Time</th>
                  <th style={{ padding: '10px' }}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {salesMeetings.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{m.clientName}</td>
                    <td style={{ padding: '12px' }}>{m.title}</td>
                    <td style={{ padding: '12px' }}>{m.date}</td>
                    <td style={{ padding: '12px' }}>{m.time}</td>
                    <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{m.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Meeting</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Client Name</label>
                <input style={inputStyle} value={meetClient} onChange={e => setMeetClient(e.target.value)} placeholder="Client / College name" />
              </div>
              <div>
                <label style={labelStyle}>Session Title</label>
                <input style={inputStyle} value={meetTitle} onChange={e => setMeetTitle(e.target.value)} placeholder="Curriculum Review Demo" />
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input style={inputStyle} type="date" value={meetDate} onChange={e => setMeetDate(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input style={inputStyle} value={meetTime} onChange={e => setMeetTime(e.target.value)} placeholder="11:30 AM" />
              </div>
              <button onClick={handleAddMeeting} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      {subTab === 'documents' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Client Agreements & Contracts</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>MIT_Pune_Quotation_Q-1024.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Quotation • Date: 2026-07-08</span>
              <button onClick={() => addToast('Downloading...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>VIT_Vellore_Syllabus_Agreement_Signed.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Signed Agreement • Date: 2026-07-07</span>
              <button onClick={() => addToast('Downloading...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCRM;