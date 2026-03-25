import React from "react";

interface RadioButtonGroupProps {
  selectedOption: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  questionId: string;
}

const options = [
  { value: "Not at all", label: "Not at all" },
  { value: "Unlikely", label: "Unlikely" },
  { value: "Somewhat", label: "Somewhat" },
  { value: "Likely", label: "Likely" },
  { value: "Definitely", label: "Definitely" },
];

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ selectedOption, onChange, questionId }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map((option) => {
        const isSelected = selectedOption === option.value;
        return (
          <label
            key={option.value}
            style={{
              position: 'relative',
              cursor: 'pointer',
              flex: 1,
              minWidth: 90,
            }}
          >
            <input
              type="radio"
              name={questionId}
              value={option.value}
              checked={isSelected}
              onChange={onChange}
              style={{ display: 'none' }}
            />
            <div style={{
              padding: '0.6rem 1rem',
              borderRadius: '100px',
              border: `1px solid ${isSelected ? 'rgba(201,168,76,0.6)' : 'rgba(245,240,235,0.1)'}`,
              background: isSelected
                ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(138,158,140,0.15))'
                : 'rgba(245,240,235,0.04)',
              color: isSelected ? 'var(--ds-gold-light)' : 'var(--ds-muted)',
              fontSize: '0.8rem',
              fontWeight: isSelected ? 500 : 300,
              letterSpacing: '0.04em',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}>
              {option.label}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RadioButtonGroup;
