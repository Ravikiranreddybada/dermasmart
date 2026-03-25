import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { AlertCircle, Calendar, DollarSign, Droplet, Leaf } from "lucide-react";
import { useState } from "react";
import productsData from "@/assets/Products.json";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DSNav } from "../App";

const SkincareAnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const { responseData } = location.state || {};

  const mockData = {
    condition: "Combination Skin with Mild Oiliness",
    hydration: 68,
    diet: ["Increase omega-3 rich foods (salmon, walnuts)", "Hydrating fruits: watermelon, cucumber", "Foods rich in vitamin E and zinc", "Reduce dairy and processed sugars"],
    morning: ["Gentle gel cleanser", "Niacinamide toner", "Lightweight moisturizer", "SPF 50 sunscreen"],
    evening: ["Micellar water + gentle cleanser", "Exfoliating serum (2–3×/week)", "Hyaluronic acid serum", "Barrier repair night cream"],
  };

  const report = responseData?.dermaReport?.report;
  const condition = report?.overview?.condition || mockData.condition;
  const hydration = 70;
  const dietRecs = report?.diet?.recommendations || mockData.diet;
  const morningRoutine = report?.routine?.morning || mockData.morning;
  const eveningRoutine = report?.routine?.evening || mockData.evening;

  const tabStyle = (val: string) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.8rem',
    letterSpacing: '0.06em',
    fontWeight: 400,
    color: activeTab === val ? 'var(--ds-cream)' : 'var(--ds-muted)',
    background: activeTab === val ? 'rgba(201,168,76,0.15)' : 'transparent',
    border: `1px solid ${activeTab === val ? 'rgba(201,168,76,0.3)' : 'transparent'}`,
    borderRadius: 100,
    padding: '0.5rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <div className="ds-page" style={{ background: 'var(--ds-ink)', minHeight: '100vh', paddingTop: 80 }}>
      <DSNav title="Your Report" />

      {/* Ambient */}
      <div style={{
        position: 'fixed', top: '20%', left: '-15%', width: '50vw', height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,158,140,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
            letterSpacing: '0.25em', color: 'var(--ds-gold)', textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            DermaSmart · AI Analysis Complete
          </div>
          <h1 className="font-display ds-gradient-text" style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, margin: '0 0 0.5rem',
          }}>
            Your Skin Intelligence Report
          </h1>
          <p style={{ color: 'var(--ds-muted)', fontSize: '0.875rem', fontWeight: 300 }}>
            Personalized recommendations based on clinical AI analysis
          </p>
        </motion.div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          {/* Tab nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabsList style={{
              display: 'flex', gap: '0.5rem', background: 'transparent',
              marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center',
              height: 'auto', padding: 0,
            }}>
              {["overview", "diet", "routine", "products"].map(tab => (
                <TabsTrigger key={tab} value={tab} style={tabStyle(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          {/* Overview */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
            >
              <div className="ds-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <AlertCircle size={16} color="var(--ds-gold)" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--ds-gold)', textTransform: 'uppercase' }}>
                    Skin Condition
                  </span>
                </div>
                <p className="font-display" style={{ fontSize: '1.4rem', fontWeight: 300, color: 'var(--ds-cream)', margin: 0, lineHeight: 1.3 }}>
                  {condition}
                </p>
              </div>

              <div className="ds-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Droplet size={16} color="var(--ds-sage)" />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--ds-sage)', textTransform: 'uppercase' }}>
                    Hydration Level
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(245,240,235,0.1)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${hydration}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--ds-sage), var(--ds-gold))' }}
                    />
                  </div>
                  <span className="font-display" style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--ds-cream)' }}>{hydration}%</span>
                </div>
              </div>

              {/* Analysis summary card */}
              <div className="ds-card" style={{ padding: '1.75rem', gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--ds-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Analysis Summary
                </div>
                <p style={{ color: 'var(--ds-warm)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
                  Your skin profile indicates a combination pattern with moderate oiliness in the T-zone and normal-to-dry cheek regions. Our AI detected subtle signs of dehydration and recommends a hydration-focused routine with targeted treatments. Scroll through the tabs to explore your personalized diet plan, daily routine, and curated product recommendations.
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* Diet */}
          <TabsContent value="diet">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="ds-card"
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <Leaf size={16} color="var(--ds-sage)" />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--ds-sage)', textTransform: 'uppercase' }}>
                  Dietary Recommendations
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dietRecs.map((rec: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(245,240,235,0.03)',
                      borderRadius: 12,
                      border: '1px solid rgba(245,240,235,0.06)',
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(138,158,140,0.15)', border: '1px solid rgba(138,158,140,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ds-sage)',
                    }}>
                      {index + 1}
                    </div>
                    <p style={{ margin: 0, color: 'var(--ds-warm)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.6 }}>
                      {rec}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Routine */}
          <TabsContent value="routine">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
            >
              {[
                { label: "Morning Routine", icon: <Calendar size={16} color="var(--ds-gold)" />, steps: morningRoutine, accent: 'var(--ds-gold)' },
                { label: "Evening Routine", icon: <Calendar size={16} color="var(--ds-sage)" />, steps: eveningRoutine, accent: 'var(--ds-sage)' },
              ].map((col) => (
                <div key={col.label} className="ds-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {col.icon}
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: col.accent, textTransform: 'uppercase' }}>
                      {col.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {col.steps.map((step: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                      >
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                          background: `rgba(${col.accent === 'var(--ds-gold)' ? '201,168,76' : '138,158,140'},0.12)`,
                          border: `1px solid rgba(${col.accent === 'var(--ds-gold)' ? '201,168,76' : '138,158,140'},0.25)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: col.accent,
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ color: 'var(--ds-warm)', fontSize: '0.875rem', fontWeight: 300 }}>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <ScrollArea className="h-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}
              >
                {productsData.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="ds-card"
                    style={{ padding: '1.25rem', overflow: 'hidden' }}
                  >
                    <div style={{
                      borderRadius: 12, overflow: 'hidden', marginBottom: '1rem',
                      background: 'rgba(245,240,235,0.04)', height: 180,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                      />
                    </div>
                    <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--ds-cream)', margin: '0 0 0.5rem' }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      <DollarSign size={12} color="var(--ds-gold)" />
                      <span style={{ color: 'var(--ds-gold)', fontSize: '0.875rem', fontFamily: "'DM Mono', monospace" }}>
                        {product.price}
                      </span>
                    </div>
                    <p style={{ color: 'var(--ds-muted)', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                      {product.description}
                    </p>
                    {product.keyIngredients && (
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--ds-sage)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Key Ingredients
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {product.keyIngredients.map((ing: string, idx: number) => (
                            <span key={idx} style={{
                              padding: '0.2rem 0.6rem', borderRadius: 100,
                              background: 'rgba(138,158,140,0.1)', border: '1px solid rgba(138,158,140,0.2)',
                              color: 'var(--ds-sage)', fontSize: '0.65rem', letterSpacing: '0.04em',
                            }}>
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div style={{
          textAlign: 'center', marginTop: '3rem', paddingTop: '2rem',
          borderTop: '1px solid rgba(245,240,235,0.06)',
          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em',
          color: 'var(--ds-muted)',
        }}>
          DermaSmart · Built by{' '}
          <a href="https://github.com/Ravikiranreddybada" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--ds-gold)' }}>
            Ravi Kiran Reddy Bada
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkincareAnalysisDashboard;
