import React from 'react';
import { Download, Filter, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import styles from './ModulePlaceholder.module.css';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const revenueData = [
  { month: 'Jan', MIT: 12000, IITB: 8000, VIT: 4000 },
  { month: 'Feb', MIT: 15000, IITB: 9500, VIT: 4500 },
  { month: 'Mar', MIT: 18000, IITB: 12000, VIT: 6000 },
  { month: 'Apr', MIT: 22000, IITB: 15000, VIT: 8000 },
  { month: 'May', MIT: 20000, IITB: 14000, VIT: 7500 },
  { month: 'Jun', MIT: 25000, IITB: 18000, VIT: 10000 },
];

const performanceData = [
  { name: 'Batch A', students: 120, avgScore: 85 },
  { name: 'Batch B', students: 95, avgScore: 72 },
  { name: 'Batch C', students: 140, avgScore: 90 },
  { name: 'Batch D', students: 80, avgScore: 65 },
];

const skillsData = [
  { subject: 'React', A: 120, B: 110, fullMark: 150 },
  { subject: 'Node.js', A: 98, B: 130, fullMark: 150 },
  { subject: 'MongoDB', A: 86, B: 130, fullMark: 150 },
  { subject: 'AWS', A: 99, B: 100, fullMark: 150 },
  { subject: 'System Design', A: 85, B: 90, fullMark: 150 },
  { subject: 'Python', A: 65, B: 85, fullMark: 150 },
];

const FilterForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Date Range</label><select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}><option>Last 30 Days</option><option>This Year</option></select></div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
      <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
      <button onClick={() => { addToast('Filters Applied', 'success'); onClose(); }} style={{ padding: '8px 16px', background: 'var(--color-espresso)', color: 'white', borderRadius: '8px' }}>Apply Filters</button>
    </div>
  </div>
)};

const Reports: React.FC = () => {
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports & Analytics</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => openModal(<FilterForm onClose={closeModal} />, 'Report Filters')}><Filter size={16} /> Filters</button>
          <button className={styles.btnPrimary} onClick={() => addToast('Generating PDF Report... Download will start shortly', 'success')}><Download size={16} /> Export PDF</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: '350px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} /> Revenue Growth by College
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMIT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-espresso)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-espresso)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIITB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-camel)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-camel)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(215, 201, 184, 0.3)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="MIT" stroke="var(--color-espresso)" fillOpacity={1} fill="url(#colorMIT)" />
              <Area type="monotone" dataKey="IITB" stroke="var(--color-camel)" fillOpacity={1} fill="url(#colorIITB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', height: '350px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> Students vs Avg Score (Batches)
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis yAxisId="left" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(215, 201, 184, 0.3)" />
              <Bar yAxisId="left" dataKey="students" barSize={30} fill="var(--color-cocoa)" />
              <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="var(--color-espresso)" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', width: '50%' }}>
         <h3 style={{ fontSize: '18px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Overall Skill Mastery (Radar)</h3>
         <ResponsiveContainer width="100%" height="85%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
            <PolarGrid stroke="rgba(215, 201, 184, 0.5)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-espresso)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar name="MIT Pune" dataKey="A" stroke="var(--color-espresso)" fill="var(--color-espresso)" fillOpacity={0.6} />
            <Radar name="IIT Bombay" dataKey="B" stroke="var(--color-camel)" fill="var(--color-camel)" fillOpacity={0.6} />
            <Legend />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Reports;
