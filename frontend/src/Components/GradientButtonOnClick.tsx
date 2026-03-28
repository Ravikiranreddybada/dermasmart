import React from "react";

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
        position: 'relative', padding: '0.875rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(138,158,140,0.1) 100%)',
        border: '1px solid rgba(201,168,76,0.35)', borderRadius: '100px',
        color: 'var(--ds-cream)', fontSize: '0.875rem', fontWeight: 400,
        letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer', transition: 'all 0.3s ease',
      }}
    >
      {buttonName}
    </button>
  );
};

export default GradientButton;
