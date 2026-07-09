import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 7500 },
  { name: 'Jul', revenue: 6800 },
];

const RevenueChart: React.FC = () => {
  return (
    <div className={`glass-panel ${styles.chartCard}`}>
      <h3 className={styles.title}>Revenue Analytics</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7D5A44" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7D5A44" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7D5A44' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7D5A44' }} tickFormatter={(value) => `$${value}`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(215, 201, 184, 0.4)" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FCFAF8', borderRadius: '8px', border: '1px solid rgba(215, 201, 184, 0.4)' }}
              itemStyle={{ color: '#4A342A', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#4A342A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
