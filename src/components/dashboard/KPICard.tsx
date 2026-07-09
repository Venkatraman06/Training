import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './KPICard.module.css';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number; // positive for up, negative for down
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend && trend >= 0;

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.iconWrapper}>{icon}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        {trend !== undefined && (
          <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
            <span className={styles.trendLabel}>vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
