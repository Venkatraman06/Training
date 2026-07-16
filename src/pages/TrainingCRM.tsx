import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, LayoutGrid, List, Search, Users, Eye,
  TrendingUp, BarChart2, Paperclip, Check
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

interface Lead {
  id: number;
  name: string;
  company: string;
  college: string;
  contact_person: string;
  designation: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  lead_source: string;
  status: 'LEAD' | 'CONTACTED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  remarks: string;
  expected_deal_value: string;
  training_requirement: string;
  follow_up_date: string | null;
  next_follow_up: string | null;
  last_contact_date: string | null;
  notes: string;
}

interface ActivityLog {
  id: number;
  lead: number | null;
  lead_name: string | null;
  activity_type: 'CALL' | 'MEETING' | 'EMAIL' | 'WHATSAPP' | 'NOTE' | 'REMINDER';
  description: string;
  created_at: string;
}

interface Meeting {
  id: number;
  lead: number;
  lead_name: string;
  title: string;
  date: string;
  time: string;
  outcome: string;
}

interface LeadTask {
  id: number;
  lead: number;
  lead_name: string;
  title: string;
  due_date: string;
  completed: boolean;
}

interface LeadDoc {
  id: number;
  lead: number;
  lead_name: string;
  name: string;
  doc_type: string;
  uploaded_at: string;
}

const API_URL = 'http://127.0.0.1:8000/api';

const TrainingCRM: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'dashboard' | 'leads' | 'followups' | 'meetings' | 'tasks' | 'documents'>('leads');
  const [view, setView] = useState<'grid' | 'kanban'>('grid');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const { openModal, closeModal } = useModal();
  const { addToast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/crm/dashboard')) {
      setSubTab('dashboard');
    } else if (path.includes('/crm/followups')) {
      setSubTab('followups');
    } else if (path.includes('/crm/meetings')) {
      setSubTab('meetings');
    } else if (path.includes('/crm/tasks')) {
      setSubTab('tasks');
    } else if (path.includes('/crm/documents')) {
      setSubTab('documents');
    } else {
      setSubTab('leads');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: 'dashboard' | 'leads' | 'followups' | 'meetings' | 'tasks' | 'documents') => {
    if (tab === 'leads') {
      navigate('/crm');
    } else {
      navigate(`/crm/${tab}`);
    }
  };

  // Follow-up activities (real backend data via ActivityLog)
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityType, setNewActivityType] = useState<ActivityLog['activity_type']>('CALL');
  const [selectedLeadForActivity, setSelectedLeadForActivity] = useState<number | ''>('');

  // Meetings (real backend data)
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetLead, setMeetLead] = useState<number | ''>('');

  // Tasks (real backend data)
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskLead, setNewTaskLead] = useState<number | ''>('');

  // Documents (real backend data)
  const [docs, setDocs] = useState<LeadDoc[]>([]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Requirement');
  const [newDocLead, setNewDocLead] = useState<number | ''>('');

  // Once leads are loaded, default all the "select a lead" pickers to the first real lead
  useEffect(() => {
    if (leads.length > 0) {
      if (selectedLeadForActivity === '') setSelectedLeadForActivity(leads[0].id);
      if (meetLead === '') setMeetLead(leads[0].id);
      if (newTaskLead === '') setNewTaskLead(leads[0].id);
      if (newDocLead === '') setNewDocLead(leads[0].id);
    }
  }, [leads]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        setMockLeads();
      }
    } catch (e) {
      setMockLeads();
    }
  };

  const setMockLeads = () => {
    // Backend unreachable - keep whatever leads are already in state instead of
    // silently showing fake institutions that don't exist in the database.
    addToast('Could not reach backend - check that the Django server is running on port 8000', 'error');
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/activities/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (e) {
      console.warn('Failed to load activities', e);
    }
  };

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/meetings/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (e) {
      console.warn('Failed to load meetings', e);
    }
  };

  const fetchLeadTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/lead-tasks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (e) {
      console.warn('Failed to load lead tasks', e);
    }
  };

  const fetchDocs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/lead-documents/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocs(data);
      }
    } catch (e) {
      console.warn('Failed to load lead documents', e);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchActivities();
    fetchMeetings();
    fetchLeadTasks();
    fetchDocs();
  }, []);

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leadData)
      });
      if (response.ok) {
        addToast('Lead created successfully!', 'success');
        fetchLeads();
        closeModal();
      } else {
        const errText = await response.text();
        console.error('Lead create failed:', errText);
        addToast('Failed to save lead to backend - it will not persist after refresh', 'error');
      }
    } catch (e) {
      addToast('Error saving lead - check backend is running on port 8000', 'error');
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: Lead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    setLeads(updated);
    addToast(`Status updated to ${newStatus}`, 'success');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/leads/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        addToast('Status change failed to save to backend', 'error');
      }
    } catch (e) {
      addToast('Status change failed to save to backend', 'error');
    }
  };

  const handleAddFollowup = async () => {
    if (!newActivityDesc.trim() || selectedLeadForActivity === '') return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/activities/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          lead: selectedLeadForActivity,
          activity_type: newActivityType,
          description: newActivityDesc
        })
      });
      if (response.ok) {
        setNewActivityDesc('');
        addToast('Follow-up logged successfully!', 'success');
        fetchActivities();
      } else {
        addToast('Failed to save follow-up to backend', 'error');
      }
    } catch (e) {
      addToast('Failed to save follow-up to backend', 'error');
    }
  };

  const handleAddMeeting = async () => {
    if (!meetTitle || !meetDate || !meetTime || meetLead === '') {
      addToast('Please fill all meeting details', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/meetings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ lead: meetLead, title: meetTitle, date: meetDate, time: meetTime })
      });
      if (response.ok) {
        setMeetTitle('');
        setMeetDate('');
        setMeetTime('');
        addToast('Meeting scheduled successfully!', 'success');
        fetchMeetings();
      } else {
        addToast('Failed to save meeting to backend', 'error');
      }
    } catch (e) {
      addToast('Failed to save meeting to backend', 'error');
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle || !newTaskDue || newTaskLead === '') {
      addToast('Please fill task details', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/lead-tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ lead: newTaskLead, title: newTaskTitle, due_date: newTaskDue })
      });
      if (response.ok) {
        setNewTaskTitle('');
        setNewTaskDue('');
        addToast('Task created successfully!', 'success');
        fetchLeadTasks();
      } else {
        addToast('Failed to save task to backend', 'error');
      }
    } catch (e) {
      addToast('Failed to save task to backend', 'error');
    }
  };

  const handleToggleTask = async (id: number) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const newCompleted = !target.completed;
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/lead-tasks/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ completed: newCompleted })
      });
      if (response.ok) {
        addToast('Task status updated', 'info');
      } else {
        addToast('Failed to save task status to backend', 'error');
      }
    } catch (e) {
      addToast('Failed to save task status to backend', 'error');
    }
  };

  const handleAddDoc = async () => {
    if (!newDocName || newDocLead === '') {
      addToast('Please enter document name', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/lead-documents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ lead: newDocLead, name: newDocName, doc_type: newDocType })
      });
      if (response.ok) {
        setNewDocName('');
        addToast('Document attached successfully!', 'success');
        fetchDocs();
      } else {
        addToast('Failed to save document to backend', 'error');
      }
    } catch (e) {
      addToast('Failed to save document to backend', 'error');
    }
  };

  const filteredLeads = leads.filter(l => {
    const query = search.toLowerCase();
    const matchesSearch = 
      l.name.toLowerCase().includes(query) || 
      l.company.toLowerCase().includes(query) ||
      l.college.toLowerCase().includes(query) ||
      l.contact_person.toLowerCase().includes(query);
    const matchesStatus = statusFilter ? l.status === statusFilter : true;
    const matchesPriority = priorityFilter ? l.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'HIGH': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      case 'MEDIUM': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
      default: return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'WON': return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'LOST': return { bg: '#ffebee', color: '#c62828' };
      case 'PROPOSAL_SENT': return { bg: '#e3f2fd', color: '#1565c0' };
      case 'CONTACTED': return { bg: '#fff8e1', color: '#f57f17' };
      default: return { bg: '#f5f5f5', color: '#616161' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Lead Management</h1>
          <p className={styles.subtitle}>Capture, nurture, and track pipeline followups.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles.btnPrimary} onClick={() => openModal(<LeadForm onSubmit={handleCreateLead} onClose={closeModal}/>, 'Add New Lead')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'leads', 'followups', 'meetings', 'tasks', 'documents'] as const).map(tab => (
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
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-tab: Dashboard */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(37,99,235,0.1)', borderRadius: '8px', color: 'var(--color-secondary)' }}><Users size={24} /></div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Captured Leads</span>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{leads.length}</h4>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', color: '#10B981' }}><TrendingUp size={24} /></div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Conversion Rate</span>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{leads.length > 0 ? ((leads.filter(l => l.status === 'WON').length / leads.length) * 100).toFixed(1) : '0.0'}%</h4>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(124,58,237,0.1)', borderRadius: '8px', color: 'var(--color-accent)' }}><BarChart2 size={24} /></div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Expected Value</span>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 0 0' }}>${leads.reduce((sum, l) => sum + parseFloat(l.expected_deal_value || '0'), 0).toLocaleString()}</h4>
              </div>
            </div>
          </div>

          {/* Funnel & Recent Activities */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Lead Funnel Stages</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>New Leads</span><strong>{leads.filter(l=>l.status==='LEAD').length}</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '100%', background: 'var(--color-secondary)', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Contacted</span><strong>{leads.filter(l=>l.status==='CONTACTED').length}</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '66%', background: 'var(--color-accent)', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Proposal Sent</span><strong>{leads.filter(l=>l.status==='PROPOSAL_SENT').length}</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '33%', background: '#F59E0B', borderRadius: '4px' }}></div></div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Activities</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activities.slice(0, 3).map(act => (
                  <div key={act.id} style={{ display: 'flex', gap: '10px', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{act.activity_type}</span>
                    <span style={{ flex: 1 }}>{act.description}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>{act.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Leads */}
      {subTab === 'leads' && (
        <>
          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search leads, institutions, or contacts..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontSize: '14px' }} 
              />
            </div>

            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontSize: '14px' }}
            >
              <option value="">All Statuses</option>
              <option value="LEAD">Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>

            <select 
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontSize: '14px' }}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <div style={{ display: 'flex', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '2px' }}>
              <button onClick={() => setView('grid')} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', background: view === 'grid' ? 'var(--color-surface)' : 'transparent', color: view === 'grid' ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                <List size={14} /> List
              </button>
              <button onClick={() => setView('kanban')} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', background: view === 'kanban' ? 'var(--color-surface)' : 'transparent', color: view === 'kanban' ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                <LayoutGrid size={14} /> Kanban
              </button>
            </div>
          </div>

          {/* Grid View */}
          {view === 'grid' ? (
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Institution & Lead</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Contact Person</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Value</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Priority</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{lead.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{lead.company || lead.college}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500' }}>{lead.contact_person}</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{lead.designation}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600' }}>
                        ${parseFloat(lead.expected_deal_value).toLocaleString()}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', ...getPriorityColor(lead.priority) }}>
                          {lead.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', ...getStatusColor(lead.status) }}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button 
                          onClick={() => openModal(<LeadDetailsView lead={lead} onUpdateStatus={handleUpdateStatus} />, `Lead Detail: ${lead.name}`)}
                          style={{ background: 'rgba(37,99,235,0.1)', border: 'none', padding: '6px 12px', borderRadius: '6px', color: 'var(--color-secondary)', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban View */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', overflowX: 'auto', minWidth: '1000px' }}>
              {(['LEAD', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST'] as const).map(column => {
                const stageLeads = filteredLeads.filter(l => l.status === column);
                return (
                  <div key={column} style={{ background: 'var(--color-linen)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{column.replace('_', ' ')}</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: 'var(--color-surface)', fontWeight: 'bold' }}>{stageLeads.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '500px' }}>
                      {stageLeads.map(lead => (
                        <div 
                          key={lead.id} 
                          className="glass-panel" 
                          onClick={() => openModal(<LeadDetailsView lead={lead} onUpdateStatus={handleUpdateStatus} />, `Lead Detail: ${lead.name}`)}
                          style={{ padding: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--color-border)' }}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{lead.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{lead.contact_person}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>${parseFloat(lead.expected_deal_value).toLocaleString()}</span>
                            <span style={{ padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', ...getPriorityColor(lead.priority) }}>{lead.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Sub-tab: Follow-ups */}
      {subTab === 'followups' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Logs */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Activity History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.map(act => (
                <div key={act.id} style={{ padding: '12px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
                  <div style={{ padding: '6px 12px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', height: 'fit-content' }}>
                    {act.activity_type}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', display: 'block' }}>{act.lead_name}</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>{act.description}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{act.created_at}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log New Activity Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Log Follow-up</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Select Lead</label>
                <select value={selectedLeadForActivity} onChange={e => setSelectedLeadForActivity(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Activity Type</label>
                <select value={newActivityType} onChange={e => setNewActivityType(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp Note</option>
                  <option value="MEETING">Meeting Notes</option>
                  <option value="NOTE">General Note</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Summary Details</label>
                <textarea rows={3} value={newActivityDesc} onChange={e => setNewActivityDesc(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} placeholder="e.g. Discussed pricing details..." />
              </div>
              <button onClick={handleAddFollowup} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Meetings */}
      {subTab === 'meetings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Scheduled Meetings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '8px 12px', fontSize: '12px' }}>Lead</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px' }}>Meeting Title</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px' }}>Date</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px' }}>Time</th>
                  <th style={{ padding: '8px 12px', fontSize: '12px' }}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(meet => (
                  <tr key={meet.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px' }}><span style={{ fontWeight: 'bold' }}>{meet.lead_name}</span></td>
                    <td style={{ padding: '12px' }}>{meet.title}</td>
                    <td style={{ padding: '12px' }}>{meet.date}</td>
                    <td style={{ padding: '12px' }}>{meet.time}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: meet.outcome === 'Pending' ? '#fff8e1' : '#e8f5e9', color: meet.outcome === 'Pending' ? '#f57f17' : '#2e7d32', fontSize: '11px', fontWeight: 'bold' }}>
                        {meet.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Meeting</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Lead</label>
                <select value={meetLead} onChange={e => setMeetLead(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Meeting Title</label>
                <input type="text" value={meetTitle} onChange={e => setMeetTitle(e.target.value)} placeholder="Curriculum Review" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={meetDate} onChange={e => setMeetDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Time</label>
                <input type="text" value={meetTime} onChange={e => setMeetTime(e.target.value)} placeholder="e.g. 10:30 AM" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleAddMeeting} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Meet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Tasks */}
      {subTab === 'tasks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Lead Tasks Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--color-linen)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      style={{ 
                        width: '20px', height: '20px', borderRadius: '4px', border: '2px solid var(--color-secondary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', background: task.completed ? 'var(--color-secondary)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {task.completed && <Check size={14} color="white" />}
                    </button>
                    <span style={{ fontSize: '13.5px', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text-main)', fontWeight: '500' }}>
                      {task.title} <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({task.lead_name})</span>
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Due: {task.due_date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Add Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Lead</label>
                <select value={newTaskLead} onChange={e => setNewTaskLead(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Task Description</label>
                <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Send customized syllabus" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Due Date</label>
                <input type="date" value={newTaskDue} onChange={e => setNewTaskDue(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleAddTask} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Documents */}
      {subTab === 'documents' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Attached Documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {docs.map(doc => (
                <div key={doc.id} style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Paperclip size={18} style={{ color: 'var(--color-secondary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.name}>{doc.name}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    <span>Lead: {doc.lead_name}</span>
                    <span style={{ display: 'block' }}>Type: {doc.doc_type} • Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button onClick={() => addToast('Downloading file...', 'info')} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Attach Document</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Lead</label>
                <select value={newDocLead} onChange={e => setNewDocLead(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Document Name</label>
                <input type="text" value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="Stanford_RFP_v2.pdf" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Type</label>
                <select value={newDocType} onChange={e => setNewDocType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Requirement">Requirement Doc</option>
                  <option value="Visiting Card">Visiting Card</option>
                  <option value="Proposal">Proposal Draft</option>
                  <option value="Other">Other Attachment</option>
                </select>
              </div>
              <button onClick={handleAddDoc} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Upload Doc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Lead Creation Form Component
const LeadForm = ({ onSubmit, onClose }: { onSubmit: (data: Partial<Lead>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '', company: '', college: '', contact_person: '', designation: '',
    phone: '', whatsapp: '', email: '', location: '', lead_source: 'Website',
    status: 'LEAD', priority: 'MEDIUM', remarks: '', expected_deal_value: '0.00',
    training_requirement: '', follow_up_date: '', next_follow_up: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const cleaned = {
    ...formData,
    follow_up_date: formData.follow_up_date || null,
    next_follow_up: formData.next_follow_up || null,
    last_contact_date: formData.last_contact_date || null,
  };
  onSubmit(cleaned);
};

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Lead/Institution Name *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Company</label>
          <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>College / Department</label>
          <input type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Contact Person *</label>
          <input required type="text" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Designation</label>
          <input type="text" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Phone</label>
          <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>WhatsApp</label>
          <input type="text" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Expected Deal Value ($) *</label>
          <input required type="number" step="0.01" value={formData.expected_deal_value} onChange={e => setFormData({ ...formData, expected_deal_value: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Next Follow-up Date</label>
          <input type="date" value={formData.next_follow_up || ''} onChange={e => setFormData({ ...formData, next_follow_up: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Training Requirements</label>
        <textarea rows={3} value={formData.training_requirement} onChange={e => setFormData({ ...formData, training_requirement: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <button type="button" onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Cancel</button>
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Save Lead</button>
      </div>
    </form>
  );
};

// Lead History and Timeline Details View
const LeadDetailsView = ({ lead, onUpdateStatus }: { lead: Lead; onUpdateStatus: (id: number, status: Lead['status']) => void }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [activityType, setActivityType] = useState<ActivityLog['activity_type']>('NOTE');
  const { addToast } = useToast();

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/activities/?lead=${lead.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        addToast('Could not load activity history from backend', 'error');
      }
    } catch (e) {
      addToast('Could not load activity history from backend', 'error');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [lead.id]);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    const activityData = {
      lead: lead.id,
      activity_type: activityType,
      description: newActivity
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activityData)
      });
      if (response.ok) {
        addToast('Activity logged successfully!', 'success');
        setNewActivity('');
        fetchActivities();
      } else {
        addToast('Failed to save activity to backend - it will not persist', 'error');
      }
    } catch (err) {
      addToast('Error logging activity - check backend is running', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Status Pipeline</span>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {(['LEAD', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST'] as const).map(status => (
              <button
                key={status}
                onClick={() => onUpdateStatus(lead.id, status)}
                style={{
                  padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold',
                  background: lead.status === status ? 'var(--color-secondary)' : 'var(--color-linen)',
                  color: lead.status === status ? 'white' : 'var(--color-text-muted)'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Estimated Value</span>
          <h4 style={{ margin: '4px 0 0 0', color: 'var(--color-secondary)' }}>${parseFloat(lead.expected_deal_value).toLocaleString()}</h4>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Contact Information</h5>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Person:</strong> {lead.contact_person} ({lead.designation})</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Email:</strong> {lead.email}</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Phone:</strong> {lead.phone}</p>
          <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>WhatsApp:</strong> {lead.whatsapp}</p>
        </div>
        <div>
          <h5 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Requirements & Remarks</h5>
          <p style={{ margin: '4px 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>{lead.training_requirement || 'No requirements stated.'}</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '13px' }}><strong>Source:</strong> {lead.lead_source}</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
        <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Log New Follow-up</h5>
        <form onSubmit={handleAddActivity} style={{ display: 'flex', gap: '10px' }}>
          <select value={activityType} onChange={e => setActivityType(e.target.value as any)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
            <option value="CALL">Call</option>
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="MEETING">Meeting Notes</option>
            <option value="NOTE">Note</option>
          </select>
          <input required type="text" placeholder="Enter follow-up description..." value={newActivity} onChange={e => setNewActivity(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
          <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Log</button>
        </form>

        <h5 style={{ fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '10px' }}>Timeline Logs</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activities.map(act => (
            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--color-linen)', borderRadius: '6px', fontSize: '12px' }}>
              <div>
                <strong style={{ color: 'var(--color-secondary)', marginRight: '6px' }}>[{act.activity_type}]</strong>
                <span>{act.description}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)' }}>{new Date(act.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingCRM;