import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Password reset link sent!', 'success');
    }, 1500);
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
        {!submitted ? (
          <>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>Forgot Password</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                {loading ? 'Sending link...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <CheckCircle2 size={56} color="var(--color-success)" />
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-main)' }}>Check your email</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', maxWidth: '300px' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '13px', 
              color: 'var(--color-secondary)', 
              fontWeight: '600' 
            }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
