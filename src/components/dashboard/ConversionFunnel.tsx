import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

const data = [
  { name: 'Leads', value: 1200 },
  { name: 'Contacted', value: 850 },
  { name: 'Proposals', value: 450 },
  { name: 'Won', value: 180 },
];

const ConversionFunnel: React.FC = () => {
  return (
    <div className={`glass-panel ${styles.chartCard}`}>
      <h3 className={styles.title}>Lead Conversion Funnel</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(215, 201, 184, 0.4)" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7D5A44' }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A342A', fontWeight: 500 }} width={80} />
            <Tooltip 
              cursor={{ fill: 'rgba(215, 201, 184, 0.2)' }}
              contentStyle={{ backgroundColor: '#FCFAF8', borderRadius: '8px', border: '1px solid rgba(215, 201, 184, 0.4)' }}
            />
            <Bar dataKey="value" fill="#B2967D" radius={[0, 4, 4, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionFunnel;
