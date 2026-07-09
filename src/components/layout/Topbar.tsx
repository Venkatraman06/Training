import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronDown, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import NewTrainingForm from '../forms/NewTrainingForm';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlobalSettingsModal from './GlobalSettingsModal';
import styles from './Topbar.module.css';

const ProfileForm = ({ onClose }: { onClose: () => void }) => {
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async () => {
    const success = await updateUser({
      first_name: firstName,
      last_name: lastName,
      email: email
    });
    if (success) {
      addToast('Profile updated successfully!', 'success');
      onClose();
    } else {
      addToast('Error saving profile changes.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        <img src="https://i.pravatar.cc/150?img=11" alt="Admin" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
        <div>
          <button onClick={() => addToast('Avatar upload started', 'info')} style={{ fontSize: '13px', background: 'rgba(37,99,235,0.1)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-secondary)', fontWeight: 'bold' }}>Change Avatar</button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} /></div>
        <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} /></div>
        <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} /></div>
        <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Role</label><input type="text" defaultValue={user?.role || 'Super Admin'} disabled style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }} /></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Cancel</button>
        <button onClick={handleSave} style={{ padding: '8px 16px', background: 'var(--color-secondary)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>Save Profile</button>
      </div>
    </div>
  );
};

const Topbar: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNewTraining = () => {
    openModal(
      <NewTrainingForm 
        onSuccess={() => {
          closeModal();
          alert('Training created successfully!');
        }} 
        onCancel={closeModal} 
      />,
      'Create New Training'
    );
  };

  const handleProfileClick = () => {
    openModal(<ProfileForm onClose={closeModal} />, 'Profile Management');
  };

  const handleSettingsClick = () => {
    openModal(<GlobalSettingsModal onClose={closeModal} />, 'Global Settings Configuration');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search trainings, students, or leads..." 
          className={styles.searchInput} 
        />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.createBtn} onClick={handleNewTraining}>
          <Plus size={16} />
          <span>New Training</span>
        </button>
        
        {/* Theme Toggle Button */}
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Global Settings Gear Button */}
        <button className={styles.iconBtn} onClick={handleSettingsClick} title="Global Settings">
          <Settings size={20} />
        </button>

        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profile} onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <div className={styles.avatar}>
            <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user ? `${user.first_name} ${user.last_name}` : 'Sarah Admin'}</span>
            <span className={styles.userRole}>{user ? user.role : 'Super Admin'}</span>
          </div>
          <ChevronDown size={16} className={styles.profileIcon} />
        </div>

        {/* Logout Button */}
        <button className={styles.iconBtn} onClick={logout} title="Sign Out" style={{ marginLeft: '4px' }}>
          <LogOut size={20} color="var(--color-error)" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
