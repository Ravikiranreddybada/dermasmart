import { motion } from "framer-motion";

const GradientText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <motion.span
      className={`ds-gradient-text font-display ${className || ''}`}
      style={{ fontWeight: 300 }}
    >
      {text}
    </motion.span>
  );
};

export default GradientText;
