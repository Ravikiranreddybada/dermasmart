const Loader = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.2)',
          animation: 'spin 3s linear infinite',
        }} />
        {/* Inner spinning arc */}
        <div style={{
          position: 'absolute', inset: 6, borderRadius: '50%',
          border: '1.5px solid transparent',
          borderTopColor: 'var(--ds-gold)',
          borderRightColor: 'rgba(201,168,76,0.3)',
          animation: 'spin 1.2s cubic-bezier(0.4,0,0.6,1) infinite',
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--ds-gold)',
          opacity: 0.8,
        }} />
      </div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--ds-muted)',
        textTransform: 'uppercase',
      }}>
        Analyzing...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
