import React from 'react';
import { 
  Users, Briefcase, DollarSign, 
  Award, Calendar, CheckCircle
} from 'lucide-react';
import KPICard from '../components/dashboard/KPICard';
import RevenueChart from '../components/dashboard/RevenueChart';
import ConversionFunnel from '../components/dashboard/ConversionFunnel';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, Sarah</h1>
          <p className={styles.subtitle}>Here's what's happening with TrainOps Pro today.</p>
        </div>
        <div className={styles.datePicker}>
          <Calendar size={16} />
          <span>This Month</span>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <KPICard 
          title="Total Revenue" 
          value="$124,500" 
          trend={12.5} 
          icon={<DollarSign size={20} />} 
        />
        <KPICard 
          title="Active Trainings" 
          value="24" 
          trend={8.2} 
          icon={<Briefcase size={20} />} 
        />
        <KPICard 
          title="Total Students" 
          value="1,432" 
          trend={15.3} 
          icon={<Users size={20} />} 
        />
        <KPICard 
          title="Certificates Issued" 
          value="850" 
          trend={-2.4} 
          icon={<Award size={20} />} 
        />
      </div>

      <div className={styles.chartsGrid}>
        <RevenueChart />
        <ConversionFunnel />
      </div>

      <div className={styles.bottomGrid}>
        <div className={`glass-panel ${styles.recentActivity}`}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <CheckCircle size={14} />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    <strong>John Doe</strong> marked Python Bootcamp as completed.
                  </p>
                  <span className={styles.activityTime}>{i} hour{i > 1 ? 's' : ''} ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`glass-panel ${styles.upcomingTrainings}`}>
          <h3 className={styles.sectionTitle}>Upcoming Trainings</h3>
          <div className={styles.trainingList}>
            {[
              { name: 'React Advanced', date: 'Jul 12', college: 'MIT Pune' },
              { name: 'Data Science with Python', date: 'Jul 15', college: 'IIT Bombay' },
              { name: 'Cloud Computing Fundamentals', date: 'Jul 18', college: 'VIT Vellore' },
            ].map((training, i) => (
              <div key={i} className={styles.trainingItem}>
                <div className={styles.trainingDate}>
                  <span className={styles.dateDay}>{training.date.split(' ')[1]}</span>
                  <span className={styles.dateMonth}>{training.date.split(' ')[0]}</span>
                </div>
                <div className={styles.trainingInfo}>
                  <h4 className={styles.trainingName}>{training.name}</h4>
                  <p className={styles.trainingCollege}>{training.college}</p>
                </div>
                <button className={styles.viewBtn}>View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
