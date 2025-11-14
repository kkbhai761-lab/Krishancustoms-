import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const RotatingDumbbell: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Left weight */}
      <mesh position={[-1.5, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Bar */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#00d9ff" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Right weight */}
      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const LoadingPage: React.FC<{ onLoadingComplete: () => void }> = ({ onLoadingComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gym-black"
    >
      {/* 3D Canvas */}
      <div className="w-full h-64 mb-8">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
          <RotatingDumbbell />
        </Canvas>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-white">GYM</span>
          <span className="text-gym-red">FIT</span>
          <span className="text-gym-blue">PRO</span>
        </h1>
        <p className="text-gray-400 text-lg mb-6">Your Ultimate Training Companion</p>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gym-dark rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-gym-red via-gym-blue to-gym-red"
          />
        </div>
        
        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gym-blue"
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -50,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-gym-blue rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingPage;
