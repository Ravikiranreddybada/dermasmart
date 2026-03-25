import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DSNav } from "../App";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

interface ImageInfo {
  filename: string;
  content_type: string;
  format: string;
  size: [number, number];
  width: number;
  height: number;
  file_size_kb: number;
}

interface ApiResponse {
  status: "success" | "error";
  message: string;
  user_data?: { name: string; skin_type: string; email: string; age: number; };
  image_data?: ImageInfo;
}

export const CameraPage: React.FC = () => {
  const [image, setImage] = useState<string>("");
  const [name] = useState<string>("");
  const [age] = useState<number>(0);
  const [email] = useState<string>("");
  const [skinType] = useState<string>("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  console.log(status, isLoading, imageInfo);

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) { u8arr[n] = bstr.charCodeAt(n); }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = useCallback(async () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");
      setImage(imageSrc);
      if (!name || !age || !email || !skinType) throw new Error("Please fill in all fields");
      setIsLoading(true);
      const imageFile = dataURLtoFile(imageSrc, `${name}_photo.jpg`);
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name);
      formData.append("age", age.toString());
      formData.append("email", email);
      formData.append("skin_type", skinType);
      const response = await axios.post<ApiResponse>("http://127.0.0.1:8000/userInfo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "success") {
        setStatus({ type: "success", message: response.data.message });
        if (response.data.image_data) setImageInfo(response.data.image_data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  }, [webcamRef, name, age, email, skinType]);

  return (
    <div className="ds-page" style={{ background: 'var(--ds-ink)', paddingTop: 80 }}>
      <DSNav title="Skin Scan" />

      {/* Ambient */}
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
        {/* Header */}
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
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', zIndex: 10, width: 24, height: 24,
              ...(pos.includes('top-0') ? { top: 12 } : { bottom: 12 }),
              ...(pos.includes('left-0') ? { left: 12 } : { right: 12 }),
              borderTop: pos.includes('top') ? '2px solid var(--ds-gold)' : 'none',
              borderBottom: pos.includes('bottom') ? '2px solid var(--ds-gold)' : 'none',
              borderLeft: pos.includes('left') ? '2px solid var(--ds-gold)' : 'none',
              borderRight: pos.includes('right') ? '2px solid var(--ds-gold)' : 'none',
            }} />
          ))}

          {/* Scan line */}
          {image === "" && <div className="scan-line" style={{ zIndex: 5 }} />}

          {image === "" ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={560}
              height={420}
              videoConstraints={videoConstraints}
              className="mirror"
              style={{ display: 'block' }}
            />
          ) : (
            <img src={image} alt="Captured" style={{ width: 560, height: 420, objectFit: 'cover', display: 'block' }} />
          )}

          {/* Overlay label */}
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
                  borderRadius: '100px',
                  background: 'transparent',
                  color: 'var(--ds-muted)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,240,235,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,240,235,0.1)')}
              >
                Retake
              </button>
              <button
                onClick={() => navigate("/form", { state: dataURLtoFile(image, `photo.jpg`) })}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(138,158,140,0.15))',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '100px',
                  color: 'var(--ds-cream)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,168,76,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
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
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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
