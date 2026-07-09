import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { KeyRound, User as UserIcon, HelpCircle, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please enter both username and password', 'error');
      return;
    }

    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      addToast('Welcome back to Hackers InfoTech!', 'success');
      navigate(from, { replace: true });
    } else {
      addToast('Invalid credentials. Check hint below!', 'error');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 40%), var(--color-bg)',
      padding: '1.5rem',
      fontFamily: 'var(--font-family)',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 auto 0.5rem auto',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}>
            HI
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>Hackers InfoTech</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Business Operations & Training Suite</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Enter username (e.g. ceo, ops)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Password</label>
              <span 
                onClick={() => navigate('/forgot-password')} 
                style={{ fontSize: '12px', color: 'var(--color-secondary)', cursor: 'pointer', fontWeight: '500' }}
              >
                Forgot?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 38px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          background: 'rgba(37, 99, 235, 0.05)',
          border: '1px dashed rgba(37, 99, 235, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
            <HelpCircle size={14} /> Quick Demo Login:
          </div>
          <div>Username: <code>admin</code></div>
          <div>Password: <code>password123</code></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
