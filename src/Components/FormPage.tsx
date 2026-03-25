import { useState } from "react";
import { motion } from "framer-motion";
import RadioButtonGroup from "./RadioButtonGroup";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { DSNav } from "../App";

const questions = [
  { id: "skinOily", label: "How oily does your skin feel throughout the day?", key: "isOily" },
  { id: "skinDry", label: "How dry or tight does your skin feel?", key: "isDry" },
  { id: "skinIntensive", label: "How intensive is your current skincare routine?", key: "isIntensive" },
];

function FormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const endpoint = "https://30af-192-245-87-13.ngrok-free.app/analyzeSkin";
  const image = location.state;
  const [loading, setLoading] = useState(false);
  const [isOily, setIsOily] = useState("Not at all");
  const [isDry, setIsDry] = useState("Not at all");
  const [isIntensive, setIsIntensive] = useState("Not at all");

  const getMappedSkinType = (skinType: string) => {
    if (skinType === "Not at all" || skinType === "Unlikely") return "Dry";
    else if (skinType === "Somewhat") return "Combination";
    else return "Oily";
  };

  const setters: Record<string, (v: string) => void> = {
    isOily: setIsOily,
    isDry: setIsDry,
    isIntensive: setIsIntensive,
  };
  const values: Record<string, string> = { isOily, isDry, isIntensive };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append("name", "Jason");
    data.append("skin_type", getMappedSkinType(isOily));
    data.append("age", "25");
    data.append("gender", "male");
    if (image) data.append("image", image);
    try {
      const response = await fetch(endpoint, { method: "POST", body: data });
      if (!response.ok) throw new Error("Network response was not ok");
      const responseData = await response.json();
      navigate("/report", { state: { responseData } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ds-page" style={{ background: 'var(--ds-ink)', paddingTop: 80 }}>
      <DSNav title="Skin Assessment" />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
            letterSpacing: '0.25em', color: 'var(--ds-gold)', textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Step 2 of 3 — Questionnaire
          </div>
          <h2 className="font-display ds-gradient-text" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, margin: '0 0 0.75rem',
          }}>
            Refine Your Analysis
          </h2>
          <p style={{ color: 'var(--ds-muted)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7 }}>
            Answer a few questions to help DermaSmart generate a precise, personalized report.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="ds-card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
                  letterSpacing: '0.2em', color: 'var(--ds-sage)', textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  Question {i + 1}
                </div>
                <p style={{
                  color: 'var(--ds-cream)', fontSize: '0.95rem', fontWeight: 400,
                  margin: '0 0 1.25rem', lineHeight: 1.6,
                }}>
                  {q.label}
                </p>
                <RadioButtonGroup
                  selectedOption={values[q.key]}
                  onChange={(e) => setters[q.key](e.target.value)}
                  questionId={q.id}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ textAlign: 'center', marginTop: '2.5rem' }}
          >
            {loading ? (
              <Loader />
            ) : (
              <button
                type="submit"
                style={{
                  padding: '1rem 3rem',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(138,158,140,0.15))',
                  border: '1px solid rgba(201,168,76,0.45)',
                  borderRadius: '100px',
                  color: 'var(--ds-cream)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(201,168,76,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Generate My Report →
              </button>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;
