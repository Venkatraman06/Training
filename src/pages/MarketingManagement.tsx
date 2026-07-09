import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Target
} from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

interface Campaign {
  id: number;
  name: string;
  channel: 'Email' | 'WhatsApp' | 'LinkedIn' | 'College Outreach';
  status: 'Active' | 'Scheduled' | 'Paused' | 'Completed';
  budget: string;
  leads: number;
  roi: string;
}

interface MarketingEvent {
  id: number;
  name: string;
  type: 'Workshop' | 'Seminar' | 'Webinar' | 'College Visit';
  date: string;
  targetAudience: string;
  registrations: number;
}

interface SocialPost {
  id: number;
  platform: 'Instagram' | 'LinkedIn' | 'Facebook' | 'YouTube';
  caption: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  scheduledDate: string;
}

interface CollegeDrive {
  id: number;
  collegeName: string;
  contactPerson: string;
  driveDate: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
}

const MarketingManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'dashboard' | 'campaigns' | 'outreach' | 'social' | 'events' | 'calendar' | 'analytics'>('dashboard');
  const { addToast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/marketing/campaigns')) {
      setSubTab('campaigns');
    } else if (path.includes('/marketing/outreach')) {
      setSubTab('outreach');
    } else if (path.includes('/marketing/social')) {
      setSubTab('social');
    } else if (path.includes('/marketing/events')) {
      setSubTab('events');
    } else if (path.includes('/marketing/calendar')) {
      setSubTab('calendar');
    } else if (path.includes('/marketing/analytics')) {
      setSubTab('analytics');
    } else {
      setSubTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: typeof subTab) => {
    if (tab === 'dashboard') {
      navigate('/marketing');
    } else {
      navigate(`/marketing/${tab}`);
    }
  };

  // Campaigns Mock state
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 1, name: 'Summer React Bootcamp Promo', channel: 'College Outreach', status: 'Active', budget: '₹45,000', leads: 345, roi: '+24%' },
    { id: 2, name: 'B2B Corporate Training Email', channel: 'Email', status: 'Scheduled', budget: '₹12,000', leads: 0, roi: '-' },
    { id: 3, name: 'Data Science Retargeting', channel: 'LinkedIn', status: 'Paused', budget: '₹25,000', leads: 89, roi: '+12%' },
    { id: 4, name: 'WhatsApp Course Launch Blast', channel: 'WhatsApp', status: 'Completed', budget: '₹5,000', leads: 198, roi: '+40%' }
  ]);

  const [newCampName, setNewCampName] = useState('');
  const [newCampChannel, setNewCampChannel] = useState<Campaign['channel']>('Email');
  const [newCampBudget, setNewCampBudget] = useState('');

  // Events Mock state
  const [events, setEvents] = useState<MarketingEvent[]>([
    { id: 1, name: 'AI & Data Science Workshop', type: 'Workshop', date: '2026-07-12', targetAudience: 'MIT Pune Students', registrations: 180 },
    { id: 2, name: 'Cloud Computing Career Seminar', type: 'Seminar', date: '2026-07-15', targetAudience: 'COEP Computer Science', registrations: 250 },
    { id: 3, name: 'Free Fullstack React Webinar', type: 'Webinar', date: '2026-07-09', targetAudience: 'Open Registration', registrations: 420 },
    { id: 4, name: 'Stanford CS Placement Talk', type: 'College Visit', date: '2026-07-19', targetAudience: 'Stanford CS Undergrads', registrations: 95 }
  ]);

  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<MarketingEvent['type']>('Workshop');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventAudience, setNewEventAudience] = useState('');

  // Social Posts Mock state
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    { id: 1, platform: 'LinkedIn', caption: 'Excited to announce our new Cloud Architect course in Noida! 🚀 #Cloud #Bootcamp', status: 'Published', scheduledDate: '2026-07-08' },
    { id: 2, platform: 'Instagram', caption: 'Student feedback from our recent Web Development course. Swipe to read! 👉', status: 'Scheduled', scheduledDate: '2026-07-10' },
    { id: 3, platform: 'YouTube', caption: 'Full Tutorial: Deploying Django APIs to AWS ECS.', status: 'Draft', scheduledDate: '2026-07-14' }
  ]);

  const [newPostPlatform, setNewPostPlatform] = useState<SocialPost['platform']>('LinkedIn');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostDate, setNewPostDate] = useState('');

  // College Drives State
  const [drives, setDrives] = useState<CollegeDrive[]>([
    { id: 1, collegeName: 'MIT Pune', contactPerson: 'Dr. Karad', driveDate: '2026-07-18', status: 'Scheduled' },
    { id: 2, collegeName: 'COEP Pune', contactPerson: 'Prof. Patil', driveDate: '2026-07-22', status: 'Pending' }
  ]);
  const [driveColl, setDriveColl] = useState('');
  const [driveContact, setDriveContact] = useState('');
  const [driveDate, setDriveDate] = useState('');

  const handleCreateCampaign = () => {
    if (!newCampName || !newCampBudget) {
      addToast('Please enter campaign details', 'error');
      return;
    }
    const camp: Campaign = {
      id: Date.now(),
      name: newCampName,
      channel: newCampChannel,
      status: 'Scheduled',
      budget: `₹${newCampBudget}`,
      leads: 0,
      roi: '-'
    };
    setCampaigns([...campaigns, camp]);
    setNewCampName('');
    setNewCampBudget('');
    addToast('Campaign scheduled successfully!', 'success');
  };

  const handleCreateEvent = () => {
    if (!newEventName || !newEventDate || !newEventAudience) {
      addToast('Please fill all event details', 'error');
      return;
    }
    const ev: MarketingEvent = {
      id: Date.now(),
      name: newEventName,
      type: newEventType,
      date: newEventDate,
      targetAudience: newEventAudience,
      registrations: 0
    };
    setEvents([...events, ev]);
    setNewEventName('');
    setNewEventDate('');
    setNewEventAudience('');
    addToast('Marketing event scheduled successfully!', 'success');
  };

  const handleCreatePost = () => {
    if (!newPostCaption || !newPostDate) {
      addToast('Please fill post caption and date', 'error');
      return;
    }
    const post: SocialPost = {
      id: Date.now(),
      platform: newPostPlatform,
      caption: newPostCaption,
      status: 'Scheduled',
      scheduledDate: newPostDate
    };
    setSocialPosts([...socialPosts, post]);
    setNewPostCaption('');
    setNewPostDate('');
    addToast('Social media post scheduled in calendar!', 'success');
  };

  const handleCreateDrive = () => {
    if (!driveColl || !driveContact || !driveDate) {
      addToast('Please fill all drive details', 'error');
      return;
    }
    const dr: CollegeDrive = {
      id: Date.now(),
      collegeName: driveColl,
      contactPerson: driveContact,
      driveDate: driveDate,
      status: 'Scheduled'
    };
    setDrives([...drives, dr]);
    setDriveColl('');
    setDriveContact('');
    setDriveDate('');
    addToast('College Outreach Drive scheduled!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Marketing & Promotions</h1>
          <p className={styles.subtitle}>Promote courses, outreach universities, and schedule campaigns.</p>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'campaigns', 'outreach', 'social', 'events', 'calendar', 'analytics'] as const).map(tab => (
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
            {tab === 'social' ? 'Social Media' : tab === 'calendar' ? 'Content Calendar' : tab === 'outreach' ? 'College Outreach' : tab}
          </button>
        ))}
      </div>

      {/* Overview Dashboard Tab */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Total Leads Generated</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>1,284</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Avg Cost Per Lead (CPL)</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>₹84</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Active Marketing Campaigns</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>{campaigns.filter(c => c.status === 'Active').length}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Channel Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}><span>College Drives</span><strong>40%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '40%', background: 'var(--color-secondary)', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}><span>LinkedIn Ads</span><strong>30%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '30%', background: '#F59E0B', borderRadius: '4px' }}></div></div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Top Lead Channels</h3>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Website, LinkedIn referrals, WhatsApp blasts, and College visits.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {subTab === 'campaigns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Active Campaigns</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Campaign Name</th>
                  <th style={{ padding: '10px' }}>Channel</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Budget</th>
                  <th style={{ padding: '10px' }}>Leads</th>
                  <th style={{ padding: '10px' }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(camp => (
                  <tr key={camp.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{camp.name}</td>
                    <td style={{ padding: '12px' }}>{camp.channel}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                        background: camp.status === 'Active' ? '#e8f5e9' : camp.status === 'Scheduled' ? '#e3f2fd' : '#f5f5f5',
                        color: camp.status === 'Active' ? '#2e7d32' : camp.status === 'Scheduled' ? '#1565c0' : '#616161'
                      }}>{camp.status}</span>
                    </td>
                    <td style={{ padding: '12px' }}>{camp.budget}</td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{camp.leads}</td>
                    <td style={{ padding: '12px', color: '#10B981', fontWeight: 'bold' }}>{camp.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Create New Campaign</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Campaign Name</label>
                <input type="text" value={newCampName} onChange={e => setNewCampName(e.target.value)} placeholder="Summer React Drive" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Channel</label>
                <select value={newCampChannel} onChange={e => setNewCampChannel(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="College Outreach">College Outreach</option>
                  <option value="Email">Email Campaigns</option>
                  <option value="WhatsApp">WhatsApp Campaigns</option>
                  <option value="LinkedIn">LinkedIn Outreach</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Budget (₹)</label>
                <input type="number" value={newCampBudget} onChange={e => setNewCampBudget(e.target.value)} placeholder="20000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreateCampaign} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* College Outreach Tab */}
      {subTab === 'outreach' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>College Drives & Outreach Visits</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>College Name</th>
                  <th style={{ padding: '10px' }}>Contact Person</th>
                  <th style={{ padding: '10px' }}>Drive Date</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {drives.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{d.collegeName}</td>
                    <td style={{ padding: '12px' }}>{d.contactPerson}</td>
                    <td style={{ padding: '12px' }}>{d.driveDate}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                        background: d.status === 'Completed' ? '#e8f5e9' : '#fff8e1',
                        color: d.status === 'Completed' ? '#2e7d32' : '#f57f17'
                      }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule College Drive</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>College Name</label>
                <input type="text" value={driveColl} onChange={e => setDriveColl(e.target.value)} placeholder="DY Patil Pune" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>TPO Contact</label>
                <input type="text" value={driveContact} onChange={e => setDriveContact(e.target.value)} placeholder="Prof. Sharma" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={driveDate} onChange={e => setDriveDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreateDrive} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {subTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Workshops, Seminars & Webinars</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Event Name</th>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th style={{ padding: '10px' }}>Scheduled Date</th>
                  <th style={{ padding: '10px' }}>Target Audience</th>
                  <th style={{ padding: '10px' }}>Registrations</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ev.name}</td>
                    <td style={{ padding: '12px' }}>{ev.type}</td>
                    <td style={{ padding: '12px' }}>{ev.date}</td>
                    <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{ev.targetAudience}</td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{ev.registrations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Event</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Event Title</label>
                <input type="text" value={newEventName} onChange={e => setNewEventName(e.target.value)} placeholder="AI & Analytics Seminar" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Type</label>
                <select value={newEventType} onChange={e => setNewEventType(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Webinar">Webinar</option>
                  <option value="College Visit">College Outreach Visit</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Target Audience</label>
                <input type="text" value={newEventAudience} onChange={e => setNewEventAudience(e.target.value)} placeholder="e.g. Stanford CS Dept" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreateEvent} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {subTab === 'social' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Scheduled Post Promotions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {socialPosts.map(post => (
                <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-linen)', borderRadius: '8px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '13.5px', color: 'var(--color-secondary)' }}>{post.platform}</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--color-text-main)' }}>{post.caption}</p>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Date: {post.scheduledDate}</span>
                  </div>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                    background: post.status === 'Published' ? '#e8f5e9' : '#fff8e1',
                    color: post.status === 'Published' ? '#2e7d32' : '#f57f17'
                  }}>{post.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Social Post</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Platform</label>
                <select value={newPostPlatform} onChange={e => setNewPostPlatform(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube Promotions</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Post Caption</label>
                <textarea rows={3} value={newPostCaption} onChange={e => setNewPostCaption(e.target.value)} placeholder="Join our next Python bootcamp..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={newPostDate} onChange={e => setNewPostDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreatePost} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Calendar Tab */}
      {subTab === 'calendar' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Marketing Content Calendar</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Days headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ background: 'var(--color-linen)', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid var(--color-border)' }}>
                {day}
              </div>
            ))}
            
            {/* Calendar Dates Mock (35 boxes) */}
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayNum = (idx % 31) + 1;
              const hasPost = idx === 9 || idx === 11 || idx === 18;
              return (
                <div key={idx} style={{ height: '90px', background: 'var(--color-surface)', padding: '8px', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>{dayNum}</span>
                  {hasPost && (
                    <span style={{ fontSize: '9px', padding: '2px 4px', background: 'rgba(37,99,235,0.1)', color: 'var(--color-secondary)', borderRadius: '4px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {idx === 9 ? 'Insta: Review' : idx === 11 ? 'LinkedIn: Cloud' : 'YT: Tutorial'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {subTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Lead Sources Conversion</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>College Visits</span><strong>45%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '45%', background: 'var(--color-secondary)', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>LinkedIn Promotions</span><strong>28%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '28%', background: 'var(--color-accent)', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Email Campaigns</span><strong>17%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '17%', background: '#10B981', borderRadius: '4px' }}></div></div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Campaign ROI & Analytics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--color-linen)', borderRadius: '8px' }}>
                  <TrendingUp size={24} style={{ color: '#10B981', marginBottom: '6px' }} />
                  <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>3.2x</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Average ROI Factor</span>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--color-linen)', borderRadius: '8px' }}>
                  <Target size={24} style={{ color: 'var(--color-secondary)', marginBottom: '6px' }} />
                  <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>₹84 / Lead</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Avg Cost Per Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingManagement;
