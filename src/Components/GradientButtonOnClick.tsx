interface GradientButtonProps {
  buttonName: string;
  onClick: () => void;
  type?: "submit" | "reset" | "button";
}

const GradientButton: React.FC<GradientButtonProps> = ({ buttonName, onClick, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '0.875rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(138,158,140,0.1) 100%)',
        border: '1px solid rgba(201,168,76,0.35)',
        borderRadius: '100px',
        color: 'var(--ds-cream)',
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: '0.08em',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
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
      {buttonName}
    </button>
  );
};

export default GradientButton;
