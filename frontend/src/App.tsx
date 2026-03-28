import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import React from "react";
import CameraPage from "./Components/CameraPage";
import FormPage from "./Components/FormPage";
import SkincareAnalysisDashboard from "./Components/SkincareAnalysisDashboard";
import { motion } from "framer-motion";
import Login from "./Components/Login";
import { Auth0ProviderWithNavigate } from "./auth/auth-provider";

function HomePage() {
  const navigate = useNavigate();
  const isElectronApp = false;

  return (
    <div className="ds-page flex flex-col items-center justify-center" style={{ background: 'var(--ds-ink)' }}>
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '60vw', height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,158,140,0.07) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.5rem',
            border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(201,168,76,0.05)',
          }} className="animate-pulse-ring">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="12" r="5" stroke="#C9A84C" strokeWidth="1.5"/>
              <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 2v3M16 27v3M2 16h3M27 16h3" stroke="#8A9E8C" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display ds-gradient-text" style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 300,
            letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 0.5rem',
          }}>
            DermaSmart
          </h1>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: '0.7rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--ds-muted)', marginBottom: '0.75rem',
          }}>
            AI-Powered Skin Intelligence
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontSize: '1.1rem', color: 'var(--ds-warm)', maxWidth: 420,
            margin: '0 auto 3rem', fontWeight: 300, lineHeight: 1.7,
          }}
        >
          Personalized dermatological analysis powered by computer vision and clinical AI.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Login />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          style={{
            position: 'fixed', bottom: '2rem', left: 0, right: 0,
            textAlign: 'center', fontFamily: "'DM Mono', monospace",
            fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--ds-muted)',
          }}
        >
          Built by{' '}
          <a href="https://github.com/Ravikiranreddybada" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--ds-gold)', textDecoration: 'none' }}>
            Ravi Kiran Reddy Bada
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export function DSButton({ children, onClick, type }: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        position: 'relative', padding: '0.875rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(138,158,140,0.1) 100%)',
        border: '1px solid rgba(201,168,76,0.35)', borderRadius: '100px',
        color: 'var(--ds-cream)', fontSize: '0.875rem', fontWeight: 400,
        letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(138,158,140,0.2) 100%)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.6)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(201,168,76,0.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(138,158,140,0.1) 100%)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.35)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
    >
      {children}
    </button>
  );
}

export function DSNav({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(26,24,20,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--ds-glass-border)',
    }}>
      <button onClick={() => navigate('/')} style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 300,
        color: 'var(--ds-cream)', background: 'none', border: 'none',
        cursor: 'pointer', letterSpacing: '0.02em',
      }}>
        Derma<span style={{ color: 'var(--ds-gold)' }}>Smart</span>
      </button>
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
        letterSpacing: '0.2em', color: 'var(--ds-muted)', textTransform: 'uppercase',
      }}>
        {title}
      </span>
      <a href="https://github.com/Ravikiranreddybada" target="_blank" rel="noopener noreferrer"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--ds-gold)' }}>
        @Ravikiranreddybada
      </a>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Auth0ProviderWithNavigate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/report" element={<SkincareAnalysisDashboard />} />
        </Routes>
      </Auth0ProviderWithNavigate>
    </Router>
  );
}

export default App;
