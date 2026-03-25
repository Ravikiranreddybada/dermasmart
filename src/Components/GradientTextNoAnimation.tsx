const GradientTextNoAnimation: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <span className={`ds-gradient-text font-display ${className || ''}`} style={{ fontWeight: 300 }}>
      {text}
    </span>
  );
};
export default GradientTextNoAnimation;
