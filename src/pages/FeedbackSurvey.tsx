import React from 'react';
import { Star, TrendingUp, Users, MessageSquare, ThumbsUp, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './ModulePlaceholder.module.css';

const surveyData = [
  { month: 'Jan', satisfaction: 85, responses: 120 },
  { month: 'Feb', satisfaction: 88, responses: 150 },
  { month: 'Mar', satisfaction: 82, responses: 110 },
  { month: 'Apr', satisfaction: 90, responses: 200 },
  { month: 'May', satisfaction: 92, responses: 180 },
  { month: 'Jun', satisfaction: 95, responses: 250 },
];

const recentFeedback = [
  { id: 1, course: 'React Bootcamp', student: 'Alex M.', rating: 5, comment: 'Incredible hands-on exercises!', date: '2 hours ago' },
  { id: 2, course: 'Data Science', student: 'Sarah K.', rating: 4, comment: 'Great content, but pace was a bit fast.', date: 'Yesterday' },
  { id: 3, course: 'Cloud Computing', student: 'John D.', rating: 5, comment: 'AWS labs were exactly what I needed.', date: '2 days ago' },
  { id: 4, course: 'Python Basics', student: 'Emma W.', rating: 3, comment: 'Good intro, wish there were more projects.', date: '1 week ago' },
];

const FeedbackSurvey: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflowY: 'auto', paddingBottom: '2rem' }}>
      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className={styles.title}>Student Feedback & Surveys</h1>
          <p className={styles.subtitle}>Track satisfaction scores and analyze student reviews.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Filter size={16} /> Filter Date</button>
          <button className={styles.btnPrimary}>Create Survey</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Avg Satisfaction</span>
            <Star size={16} color="var(--color-camel)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>4.8/5.0</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +0.2 this month</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Total Responses</span>
            <MessageSquare size={16} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>1,010</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +15% this month</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Completion Rate</span>
            <Users size={16} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>76%</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Target: 80%</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Net Promoter Score</span>
            <ThumbsUp size={16} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-espresso)' }}>62</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> Excellent</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1.5rem' }}>Satisfaction Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={surveyData}>
                <defs>
                  <linearGradient id="colorSat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-camel)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-camel)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} domain={['dataMin - 10', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="satisfaction" stroke="var(--color-camel)" strokeWidth={3} fillOpacity={1} fill="url(#colorSat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--color-espresso)', marginBottom: '1rem' }}>Recent Feedback</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
            {recentFeedback.map(fb => (
              <div key={fb.id} style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-white)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-espresso)' }}>{fb.course}</div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < fb.rating ? "var(--color-camel)" : "transparent"} color={i < fb.rating ? "var(--color-camel)" : "var(--color-border)"} />
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px', lineHeight: 1.4 }}>"{fb.comment}"</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  <span>{fb.student}</span>
                  <span>{fb.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: '1rem', padding: '8px', width: '100%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-espresso)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>View All Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSurvey;
