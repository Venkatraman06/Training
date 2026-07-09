import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import styles from './ModulePlaceholder.module.css';
import { useToast } from '../context/ToastContext';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
}

interface Expense {
  id: number;
  category: 'Salary' | 'Office' | 'Marketing' | 'Travel' | 'Software' | 'Hosting' | 'Miscellaneous';
  description: string;
  amount: number;
  date: string;
}

const FinanceManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'dashboard' | 'payments' | 'invoices' | 'expenses' | 'reports' | 'documents'>('dashboard');
  const { addToast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/finance/dashboard')) {
      setSubTab('dashboard');
    } else if (path.includes('/finance/payments')) {
      setSubTab('payments');
    } else if (path.includes('/finance/invoices')) {
      setSubTab('invoices');
    } else if (path.includes('/finance/expenses')) {
      setSubTab('expenses');
    } else if (path.includes('/finance/reports')) {
      setSubTab('reports');
    } else if (path.includes('/finance/documents')) {
      setSubTab('documents');
    } else {
      setSubTab('dashboard');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: typeof subTab) => {
    if (tab === 'dashboard') {
      navigate('/finance');
    } else {
      navigate(`/finance/${tab}`);
    }
  };

  // Transactions / Payments State
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'INV-1023', date: '2026-07-08', description: 'MIT Pune - React Bootcamp (First Installment)', amount: 15000, type: 'income', status: 'Paid' },
    { id: 'INV-1024', date: '2026-07-09', description: 'Stanford University - Cloud Bootcamp', amount: 18000, type: 'income', status: 'Pending' },
    { id: 'EXP-501', date: '2026-07-07', description: 'Priya Sharma - Bootcamp Trainer Fee', amount: 4500, type: 'expense', status: 'Paid' },
    { id: 'INV-1025', date: '2026-07-05', description: 'VIT Vellore - Data Analytics Bootcamp', amount: 22000, type: 'income', status: 'Partial' },
    { id: 'INV-1022', date: '2026-06-15', description: 'Cambridge Science - AI Bootcamp', amount: 12000, type: 'income', status: 'Overdue' }
  ]);

  const [newClient, setNewClient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newInvoiceStatus, setNewInvoiceStatus] = useState<Transaction['status']>('Pending');

  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, category: 'Salary', description: 'Staff June payroll', amount: 125000, date: '2026-06-30' },
    { id: 2, category: 'Hosting', description: 'AWS Production servers cloud credit', amount: 8500, date: '2026-07-05' },
    { id: 3, category: 'Travel', description: 'Pune center outreach travel expenses', amount: 3200, date: '2026-07-06' },
    { id: 4, category: 'Marketing', description: 'LinkedIn Outreach campaign budget', amount: 15000, date: '2026-07-01' }
  ]);

  const [expCategory, setExpCategory] = useState<Expense['category']>('Office');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');

  const handleCreateInvoice = () => {
    if (!newClient || !newAmount) {
      addToast('Please enter client and amount', 'error');
      return;
    }
    const invId = `INV-${1026 + transactions.length}`;
    const tx: Transaction = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      description: `${newClient} - Training Bootcamp Fees`,
      amount: parseFloat(newAmount),
      type: 'income',
      status: newInvoiceStatus
    };
    setTransactions([tx, ...transactions]);
    setNewClient('');
    setNewAmount('');
    addToast(`Invoice ${invId} generated successfully!`, 'success');
  };

  const handleCreateExpense = () => {
    if (!expDesc || !expAmount || !expDate) {
      addToast('Please enter all expense details', 'error');
      return;
    }
    const exp: Expense = {
      id: Date.now(),
      category: expCategory,
      description: expDesc,
      amount: parseFloat(expAmount),
      date: expDate
    };
    setExpenses([exp, ...expenses]);

    // Record as transaction too
    const tx: Transaction = {
      id: `EXP-${600 + expenses.length}`,
      date: expDate,
      description: `${expCategory} - ${expDesc}`,
      amount: parseFloat(expAmount),
      type: 'expense',
      status: 'Paid'
    };
    setTransactions([tx, ...transactions]);

    setExpDesc('');
    setExpAmount('');
    setExpDate('');
    addToast('Expense recorded successfully!', 'success');
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0) + 
                       transactions.filter(t => t.type === 'income' && t.status === 'Partial').reduce((sum, t) => sum + (t.amount * 0.5), 0); // assume 50% paid for partials
  const totalPending = transactions.filter(t => t.type === 'income' && t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
  const totalOverdue = transactions.filter(t => t.type === 'income' && t.status === 'Overdue').reduce((sum, t) => sum + t.amount, 0);
  const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Finance Hub</h1>
          <p className={styles.subtitle}>Track incoming client fees, outgoing employee salaries/bills, and invoices.</p>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '10px' }}>
        {(['dashboard', 'payments', 'invoices', 'expenses', 'reports', 'documents'] as const).map(tab => (
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

      {/* Dashboard View */}
      {subTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.0rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px' }}><ArrowUpRight size={16} color="#10B981"/> Total Income Received</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#10B981' }}>₹{totalIncome.toLocaleString()}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px' }}><Clock size={16} color="#F59E0B"/> Pending Payments</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#F59E0B' }}>₹{totalPending.toLocaleString()}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px' }}><ArrowDownRight size={16} color="#EF4444"/> Overdue Receivables</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: '#EF4444' }}>₹{totalOverdue.toLocaleString()}</h3>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px' }}><DollarSign size={16} color="var(--color-secondary)"/> Total Expenses</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '6px', color: 'var(--color-text-main)' }}>₹{totalExp.toLocaleString()}</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Cash Flow Operations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {transactions.slice(0, 4).map(txn => (
                  <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <strong style={{ display: 'block' }}>{txn.description}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>ID: {txn.id} • Date: {txn.date}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ display: 'block', color: txn.type === 'income' ? '#10B981' : '#EF4444' }}>
                        {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </strong>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--color-linen)', borderRadius: '4px', fontWeight: 'bold' }}>{txn.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '1rem' }}>Profitability Margin</h3>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-linen)', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '32px', color: '#10B981', margin: 0, fontWeight: '900' }}>
                  ₹{(totalIncome - totalExp).toLocaleString()}
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px' }}>Net Operating Profit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {subTab === 'payments' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Payments Logs & Receivables</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '10px' }}>Ref ID</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Details / Client</th>
                <th style={{ padding: '10px' }}>Amount</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => t.type === 'income').map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.id}</td>
                  <td style={{ padding: '12px' }}>{t.date}</td>
                  <td style={{ padding: '12px' }}>{t.description}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#10B981' }}>₹{t.amount.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                      background: t.status === 'Paid' ? '#e8f5e9' : t.status === 'Pending' ? '#e3f2fd' : t.status === 'Overdue' ? '#ffebee' : '#fff8e1',
                      color: t.status === 'Paid' ? '#2e7d32' : t.status === 'Pending' ? '#1565c0' : t.status === 'Overdue' ? '#c62828' : '#f57f17'
                    }}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoices Generator */}
      {subTab === 'invoices' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Invoices Ledger (18% GST Invoices)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Invoice No</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Client Description</th>
                  <th style={{ padding: '10px' }}>Taxable Amt</th>
                  <th style={{ padding: '10px' }}>18% GST</th>
                  <th style={{ padding: '10px' }}>Net Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(t => t.type === 'income').map(t => {
                  const taxable = Math.round(t.amount / 1.18);
                  const gst = t.amount - taxable;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{t.id}</td>
                      <td style={{ padding: '12px' }}>{t.date}</td>
                      <td style={{ padding: '12px' }}>{t.description}</td>
                      <td style={{ padding: '12px' }}>₹{taxable.toLocaleString()}</td>
                      <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>₹{gst.toLocaleString()}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>₹{t.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Generate Tax Invoice</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Client Name</label>
                <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="MIT Pune College" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Net Total Amount (₹)</label>
                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="15000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Invoice Status</label>
                <select value={newInvoiceStatus} onChange={e => setNewInvoiceStatus(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Pending">Unpaid (Pending)</option>
                  <option value="Paid">Paid (Cleared)</option>
                </select>
              </div>
              <button onClick={handleCreateInvoice} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Generate PDF Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {subTab === 'expenses' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Operating Expenses Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Description</th>
                  <th style={{ padding: '10px' }}>Amount</th>
                  <th style={{ padding: '10px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{e.category}</td>
                    <td style={{ padding: '12px' }}>{e.description}</td>
                    <td style={{ padding: '12px', color: '#EF4444', fontWeight: 'bold' }}>-₹{e.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Record Expense</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Category</label>
                <select value={expCategory} onChange={e => setExpCategory(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  <option value="Salary">Salary Payroll</option>
                  <option value="Office">Office Rent / Bills</option>
                  <option value="Marketing">Marketing / Ad spend</option>
                  <option value="Travel">Travel Allowance</option>
                  <option value="Software">Software Tooling</option>
                  <option value="Hosting">Cloud Hosting (AWS)</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Description</label>
                <input type="text" value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Noida office electricity bill" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Amount (₹)</label>
                <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="8000" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: '600' }}>Date</label>
                <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} />
              </div>
              <button onClick={handleCreateExpense} style={{ padding: '10px', background: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Log Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {subTab === 'reports' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Monthly Profit & Loss Statement (P&L)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-linen)', borderRadius: '6px' }}>
              <span>Operating Income (Bootcamp campaigns fees)</span>
              <strong style={{ color: '#10B981' }}>+₹{totalIncome.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--color-linen)', borderRadius: '6px' }}>
              <span>Operating Expenses (Salaries, Cloud credit, Travel)</span>
              <strong style={{ color: '#EF4444' }}>-₹{totalExp.toLocaleString()}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '2px solid var(--color-border)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', fontSize: '16px' }}>
              <span style={{ fontWeight: 'bold' }}>Net Operational Profit</span>
              <strong style={{ color: '#10B981' }}>₹{(totalIncome - totalExp).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {subTab === 'documents' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Financial Statements & Receipt Attachments</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>MIT_Pune_Receipt_INV-1023.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Invoice Receipt • Date: 2026-07-08</span>
              <button onClick={() => addToast('Downloading Invoice Receipt PDF...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h5 style={{ fontWeight: 'bold', fontSize: '13.5px', marginBottom: '4px' }}>AWS_Billing_July_EXP-502.pdf</h5>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Type: Expense Statement • Date: 2026-07-05</span>
              <button onClick={() => addToast('Downloading AWS Billing PDF...', 'success')} style={{ display: 'block', border: 'none', background: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', padding: 0 }}>Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;
