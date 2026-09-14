import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  visible: boolean;
}

const css = `
@keyframes vet-bounce {
  0% {
    top: 56px;
    height: 5px;
    border-radius: 50px 50px 25px 25px;
    transform: scaleX(1.7);
  }
  40% {
    height: 20px;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 0%;
  }
}

@keyframes vet-shadow {
  0% { transform: scaleX(1.5); }
  40% { transform: scaleX(1); opacity: 0.7; }
  100% { transform: scaleX(0.2); opacity: 0.4; }
}

.vet-loader-wrapper {
  width: 200px;
  height: 60px;
  position: relative;
}

.vet-circle {
  width: 20px;
  height: 20px;
  position: absolute;
  border-radius: 50%;
  background-color: #0D7C84;
  left: 15%;
  transform-origin: 50%;
  animation: vet-bounce 0.6s alternate infinite ease;
}

.vet-circle:nth-child(2) {
  left: 45%;
  animation-delay: 0.2s;
  background-color: #F59E0B;
}

.vet-circle:nth-child(3) {
  left: auto;
  right: 15%;
  animation-delay: 0.3s;
  background-color: #0D7C84;
}

.vet-shadow {
  width: 20px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(13, 124, 132, 0.25);
  position: absolute;
  top: 58px;
  transform-origin: 50%;
  z-index: -1;
  left: 15%;
  filter: blur(1px);
  animation: vet-shadow 0.6s alternate infinite ease;
}

.vet-shadow:nth-child(4) {
  left: 45%;
  animation-delay: 0.2s;
}

.vet-shadow:nth-child(5) {
  left: auto;
  right: 15%;
  animation-delay: 0.3s;
}
`;

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <>
      <style>{css}</style>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 text-3xl font-black tracking-tight text-slate-900"
            >
              Vet<span className="text-[#F59E0B]">HD</span>
            </motion.div>

            {/* Bouncing balls */}
            <div className="vet-loader-wrapper">
              <div className="vet-circle" />
              <div className="vet-circle" />
              <div className="vet-circle" />
              <div className="vet-shadow" />
              <div className="vet-shadow" />
              <div className="vet-shadow" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-sm text-slate-400 font-medium tracking-wide"
            >
              Ingresando al sistema...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
