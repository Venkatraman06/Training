import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// No lucide icons used in this file
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

interface Deal {
  id: number;
  title: string;
  clientName: string;
  expectedValue: string;
  stage: 'Active' | 'Negotiation' | 'Won' | 'Lost';
  followupNotes: string;
  lastContact: string;
}

interface Quotation {
  id: number;
  quoteNo: string;
  clientName: string;
  trainingCost: number;
  discount: number;
  gst: number;
  netAmount: number;
  status: 'Pending' | 'Approved' | 'Sent';
}

const SalesCRM: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'dashboard' | 'opportunities' | 'quotations' | 'followup' | 'meetings' | 'documents'>('opportunities');
  const { addToast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/sales/dashboard')) {
      setSubTab('dashboard');
    } else if (path.includes('/sales/opportunities')) {
      setSubTab('opportunities');
    } else if (path.includes('/sales/quotes')) {
      setSubTab('quotations');
    } else if (path.includes('/sales/followups')) {
      setSubTab('followup');
    } else if (path.includes('/sales/meetings')) {
      setSubTab('meetings');
    } else if (path.includes('/sales/documents')) {
      setSubTab('documents');
    } else {
      // Default /sales path
      setSubTab('quotations');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: typeof subTab) => {
    if (tab === 'dashboard') {
      navigate('/sales/dashboard');
    } else if (tab === 'opportunities') {
      navigate('/sales/opportunities');
    } else if (tab === 'quotations') {
      navigate('/sales/quotes');
    } else if (tab === 'followup') {
      navigate('/sales/followups');
    } else if (tab === 'meetings') {
      navigate('/sales/meetings');
    } else if (tab === 'documents') {
      navigate('/sales/documents');
    }
  };

  // Deals Mock State
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, title: 'React JS Corporate Training', clientName: 'MIT Pune', expectedValue: '18000.00', stage: 'Negotiation', followupNotes: 'Price discussion on GST exemptions.', lastContact: '2026-07-08' },
    { id: 2, title: 'AWS Cloud Certification Batch', clientName: 'Stanford University', expectedValue: '15000.00', stage: 'Won', followupNotes: 'MoU Signed. Initial batch setup scheduled.', lastContact: '2026-07-08' },
    { id: 3, title: 'Data Science & ML Bootcamp', clientName: 'VIT Vellore', expectedValue: '25000.00', stage: 'Active', followupNotes: 'Sent customized syllabus outline.', lastContact: '2026-07-07' }
  ]);

  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealClient, setNewDealClient] = useState('MIT Pune');
  const [newDealVal, setNewDealVal] = useState('');
  const [newDealStage, setNewDealStage] = useState<Deal['stage']>('Active');

  // Quotations Mock State
  const [quotes, setQuotes] = useState<Quotation[]>([
    { id: 1, quoteNo: 'Q-1024', clientName: 'MIT Pune', trainingCost: 18000, discount: 2000, gst: 2880, netAmount: 18880, status: 'Sent' },
    { id: 2, quoteNo: 'Q-1025', clientName: 'VIT Vellore', trainingCost: 25000, discount: 3000, gst: 3960, netAmount: 25960, status: 'Approved' }
  ]);

  const [quoteCost, setQuoteCost] = useState('');
  const [quoteDisc, setQuoteDisc] = useState('');
  const [quoteClient, setQuoteClient] = useState('MIT Pune');

  // Client meetings Mock State
  const [salesMeetings, setSalesMeetings] = useState([
    { id: 1, clientName: 'MIT Pune', title: 'Pricing & Contract Discussion', date: '2026-07-08', time: '11:00 AM', outcome: 'Need updated GST proposal' },
    { id: 2, clientName: 'VIT Vellore', title: 'Data Science Demo Session', date: '2026-07-09', time: '03:00 PM', outcome: 'Syllabus accepted by Placement Team' }
  ]);

  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('');
  const [meetTime, setMeetTime] = useState('');
  const [meetClient, setMeetClient] = useState('MIT Pune');

  const handleCreateDeal = () => {
    if (!newDealTitle || !newDealVal) {
      addToast('Please enter deal title and value', 'error');
      return;
    }
    const dl: Deal = {
      id: Date.now(),
      title: newDealTitle,
      clientName: newDealClient,
      expectedValue: parseFloat(newDealVal).toFixed(2),
      stage: newDealStage,
      followupNotes: 'New deal captured.',
      lastContact: new Date().toISOString().split('T')[0]
    };
    setDeals([...deals, dl]);
    setNewDealTitle('');
    setNewDealVal('');
    addToast('Deal recorded in sales pipeline!', 'success');
  };

  const handleUpdateDealStage = (id: number, stage: Deal['stage']) => {
    setDeals(deals.map(d => d.id === id ? { ...d, stage: stage, lastContact: new Date().toISOString().split('T')[0] } : d));
    addToast(`Deal stage updated to ${stage}`, 'success');
  };

  const handleCreateQuote = () => {
    if (!quoteCost) {
      addToast('Please enter training cost', 'error');
      return;
    }
    const cost = parseFloat(quoteCost);
    const disc = parseFloat(quoteDisc || '0');
    const taxable = cost - disc;
    const gstVal = Math.round(taxable * 0.18);
    const net = taxable + gstVal;

    const qNo = `Q-${1024 + quotes.length}`;
    const quote: Quotation = {
      id: Date.now(),
      quoteNo: qNo,
      clientName: quoteClient,
      trainingCost: cost,
      discount: disc,
      gst: gstVal,
      netAmount: net,
      status: 'Sent'
    };
    setQuotes([...quotes, quote]);
    setQuoteCost('');
    setQuoteDisc('');
    addToast(`Quotation ${qNo} generated successfully!`, 'success');
  };

  const handleAddMeeting = () => {
    if (!meetTitle || !meetDate || !meetTime) {
      addToast('Please fill all meeting details', 'error');
      return;
    }
    const meet = {
      id: Date.now(),
      clientName: meetClient,
      title: meetTitle,
      date: meetDate,
      time: meetTime,
      outcome: 'Scheduled'
    };
    setSalesMeetings([...salesMeetings, meet]);
    setMeetTitle('');
    setMeetDate('');
    setMeetTime('');
    addToast('Client meeting scheduled!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Sales CRM Hub</h1>
          <p className={styles.subtitle}>Track deal opportunities, quotations, contracts, and revenue conversions.</p>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'opportunities', 'quotations', 'followup', 'meetings', 'documents'] as const).map(tab => (
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
            {tab === 'followup' ? 'Sales Follow-up' : tab}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.0rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Closed/Won Revenue</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#10B981' }}>$15,000</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Opportunities Value</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-secondary)' }}>$43,000</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Active Proposals</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-accent)' }}>{deals.filter(d=>d.stage==='Active').length}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Negotiation Deals</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#F59E0B' }}>{deals.filter(d=>d.stage==='Negotiation').length}</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Active Pipeline Forecast</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deals.map(deal => (
                  <div key={deal.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <strong style={{ display: 'block' }}>{deal.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Client: {deal.clientName}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ display: 'block', color: 'var(--color-secondary)' }}>${parseFloat(deal.expectedValue).toLocaleString()}</strong>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--color-linen)', borderRadius: '4px', fontWeight: 'bold' }}>{deal.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Conversion Rates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Won Conversion</span><strong>66.6%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '66%', background: '#10B981', borderRadius: '4px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Negotiations Progress</span><strong>85%</strong></div>
                  <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px' }}><div style={{ height: '100%', width: '85%', background: '#F59E0B', borderRadius: '4px' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Pipeline */}
      {subTab === 'opportunities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', overflowX: 'auto' }}>
            {(['Active', 'Negotiation', 'Won', 'Lost'] as const).map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              return (
                <div key={stage} style={{ background: 'var(--color-linen)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-border)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{stage}</span>
                    <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--color-surface)', borderRadius: '8px', fontWeight: 'bold' }}>{stageDeals.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '450px' }}>
                    {stageDeals.map(d => (
                      <div key={d.id} className="glass-panel" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{d.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{d.clientName}</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>${parseFloat(d.expectedValue).toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          <button onClick={() => handleUpdateDealStage(d.id, 'Negotiation')} style={{ fontSize: '9px', background: '#fff8e1', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 4px' }}>Negotiate</button>
                          <button onClick={() => handleUpdateDealStage(d.id, 'Won')} style={{ fontSize: '9px', background: '#e8f5e9', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 4px' }}>Won</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Opportunity */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Add Deal Opportunity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Deal Title</label>
                <input type="text" value={newDealTitle} onChange={e => setNewDealTitle(e.target.value)} placeholder="Fullstack Training" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Select Client</label>
                <select value={newDealClient} onChange={e => setNewDealClient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="MIT Pune">MIT Pune</option>
                  <option value="VIT Vellore">VIT Vellore</option>
                  <option value="Stanford University">Stanford University</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Value ($)</label>
                <input type="number" value={newDealVal} onChange={e => setNewDealVal(e.target.value)} placeholder="15000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Stage</label>
                <select value={newDealStage} onChange={e => setNewDealStage(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Active">Active Opportunity</option>
                  <option value="Negotiation">Negotiation</option>
                </select>
              </div>
              <button onClick={handleCreateDeal} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Add Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotations View */}
      {subTab === 'quotations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Quotations & Proposal Templates</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Quote No</th>
                  <th style={{ padding: '10px' }}>Client</th>
                  <th style={{ padding: '10px' }}>Cost</th>
                  <th style={{ padding: '10px' }}>Discount</th>
                  <th style={{ padding: '10px' }}>18% GST</th>
                  <th style={{ padding: '10px' }}>Net</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{q.quoteNo}</td>
                    <td style={{ padding: '12px' }}>{q.clientName}</td>
                    <td style={{ padding: '12px' }}>${q.trainingCost}</td>
                    <td style={{ padding: '12px', color: 'var(--color-error)' }}>-${q.discount}</td>
                    <td style={{ padding: '12px' }}>${q.gst}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>${q.netAmount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#e8f5e9', color: '#2e7d32', fontSize: '11px', fontWeight: 'bold' }}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Generate Quotation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Select Client</label>
                <select value={quoteClient} onChange={e => setQuoteClient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="MIT Pune">MIT Pune</option>
                  <option value="VIT Vellore">VIT Vellore</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Gross Cost ($)</label>
                <input type="number" value={quoteCost} onChange={e => setQuoteCost(e.target.value)} placeholder="18000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Discount Amount ($)</label>
                <input type="number" value={quoteDisc} onChange={e => setQuoteDisc(e.target.value)} placeholder="2000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreateQuote} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Follow-up log */}
      {subTab === 'followup' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Negotiations & Contracts Discussions Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deals.map(deal => (
              <div key={deal.id} style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-secondary)' }}>{deal.title}</span>
                <p style={{ margin: '4px 0', fontSize: '13px' }}><strong>Latest Discussion:</strong> {deal.followupNotes}</p>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Last Contact: {deal.lastContact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Meetings */}
      {subTab === 'meetings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Demo Sessions & Meetings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Client</th>
                  <th style={{ padding: '10px' }}>Session / Title</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Time</th>
                  <th style={{ padding: '10px' }}>Outcome Notes</th>
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
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Schedule Client Meeting</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Client</label>
                <select value={meetClient} onChange={e => setMeetClient(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="MIT Pune">MIT Pune</option>
                  <option value="VIT Vellore">VIT Vellore</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Session Title</label>
                <input type="text" value={meetTitle} onChange={e => setMeetTitle(e.target.value)} placeholder="Curriculum Review Demo" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={meetDate} onChange={e => setMeetDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Time</label>
                <input type="text" value={meetTime} onChange={e => setMeetTime(e.target.value)} placeholder="11:30 AM" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleAddMeeting} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Documents */}
      {subTab === 'documents' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Client Agreements, Contracts & Quotations</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>MIT_Pune_Quotation_Q-1024.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Quotation • Date: 2026-07-08</span>
              <button onClick={() => addToast('Downloading Quotation PDF...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>VIT_Vellore_Syllabus_Agreement_Signed.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Signed Agreement • Date: 2026-07-07</span>
              <button onClick={() => addToast('Downloading Signed MoU...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCRM;
