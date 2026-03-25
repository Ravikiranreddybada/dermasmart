import { Link } from "react-router-dom";

interface GradientButtonProps {
  buttonName: string;
  to: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({ buttonName, to }) => {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.875rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(138,158,140,0.1) 100%)',
        border: '1px solid rgba(201,168,76,0.35)',
        borderRadius: '100px',
        color: 'var(--ds-cream)',
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: '0.08em',
        fontFamily: "'DM Sans', sans-serif",
        textDecoration: 'none',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      }}
    >
      {buttonName}
    </Link>
  );
};

export default GradientButton;
