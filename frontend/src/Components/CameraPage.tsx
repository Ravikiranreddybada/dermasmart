import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DSNav } from "../App";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new File([u8arr], filename, { type: mime });
};

export const CameraPage: React.FC = () => {
  const [image, setImage] = useState<string>("");
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  }, [webcamRef]);

  return (
    <div className="ds-page" style={{ background: 'var(--ds-ink)', paddingTop: 80 }}>
      <DSNav title="Skin Scan" />

      <div style={{
        position: 'fixed', top: '10%', right: '-10%', width: '40vw', height: '40vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,158,140,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 680, margin: '0 auto', padding: '3rem 2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h2 className="font-display ds-gradient-text" style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, margin: '0 0 0.5rem',
          }}>
            Capture Your Skin
          </h2>
          <p style={{ color: 'var(--ds-muted)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7 }}>
            Position your face in good lighting for the most accurate analysis.
          </p>
        </motion.div>

        {/* Camera frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 0 60px rgba(201,168,76,0.03)',
          }}
        >
          {/* Corner accents */}
          {['tl','tr','bl','br'].map((pos) => (
            <div key={pos} style={{
              position: 'absolute', zIndex: 10, width: 24, height: 24,
              top: pos.startsWith('t') ? 12 : 'auto',
              bottom: pos.startsWith('b') ? 12 : 'auto',
              left: pos.endsWith('l') ? 12 : 'auto',
              right: pos.endsWith('r') ? 12 : 'auto',
              borderTop: pos.startsWith('t') ? '2px solid var(--ds-gold)' : 'none',
              borderBottom: pos.startsWith('b') ? '2px solid var(--ds-gold)' : 'none',
              borderLeft: pos.endsWith('l') ? '2px solid var(--ds-gold)' : 'none',
              borderRight: pos.endsWith('r') ? '2px solid var(--ds-gold)' : 'none',
            }} />
          ))}

          {image === "" && <div className="scan-line" style={{ zIndex: 5 }} />}

          {image === "" ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={560}
              height={420}
              videoConstraints={videoConstraints}
              style={{ display: 'block' }}
            />
          ) : (
            <img src={image} alt="Captured" style={{ width: 560, height: 420, objectFit: 'cover', display: 'block' }} />
          )}

          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em',
            color: 'rgba(245,240,235,0.5)', textTransform: 'uppercase',
          }}>
            {image === "" ? "Live · Ready to Capture" : "Image Captured"}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {image !== "" ? (
            <>
              <button
                onClick={() => setImage("")}
                style={{
                  padding: '0.875rem 2rem',
                  border: '1px solid rgba(245,240,235,0.1)',
                  borderRadius: '100px', background: 'transparent',
                  color: 'var(--ds-muted)', fontSize: '0.875rem',
                  letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                Retake
              </button>
              <button
                onClick={() => navigate("/form", { state: dataURLtoFile(image, `photo.jpg`) })}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(138,158,140,0.15))',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '100px', color: 'var(--ds-cream)',
                  fontSize: '0.875rem', letterSpacing: '0.06em',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                Continue →
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(138,158,140,0.15))',
                border: '2px solid rgba(201,168,76,0.5)',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              className="animate-pulse-ring"
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ds-gold)', opacity: 0.9 }} />
            </button>
          )}
        </motion.div>

        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em',
          color: 'var(--ds-muted)', textTransform: 'uppercase', textAlign: 'center',
        }}>
          {image === "" ? "Press to capture" : "Review your image above"}
        </p>
      </div>
    </div>
  );
};

export default CameraPage;
