"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import Link from "next/link";

// Porsche 911 Model Component
function Porsche911() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/porsche/scene.gltf");
  
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  
  const leftHeadlightRef = useRef<THREE.PointLight>(null);
  const rightHeadlightRef = useRef<THREE.PointLight>(null);
  const leftGlowRef = useRef<THREE.PointLight>(null);
  const rightGlowRef = useRef<THREE.PointLight>(null);

  // Responsive scale
  const [carScale, setCarScale] = useState(2.8);

  useEffect(() => {
    const handleResize = () => {
      setCarScale(window.innerWidth < 768 ? 1.8 : 2.8);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.position.set(25, -0.5, -1);
    groupRef.current.rotation.y = -Math.PI / 1.5;

    const tl = gsap.timeline();

    tl.to(groupRef.current.position, {
      x: 0,
      y: -0.5,
      z: -1,
      duration: 4.5,
      ease: "power2.out",
    });

    tl.to([leftHeadlightRef.current, rightHeadlightRef.current], {
      intensity: 10,
      duration: 1.2,
      ease: "power4.out",
    }, "-=1.8");

    tl.to([leftGlowRef.current, rightGlowRef.current], {
      intensity: 3,
      duration: 1,
      ease: "power2.out",
    }, "-=1");

    tl.to(groupRef.current.rotation, {
      y: -Math.PI / 1.5 + 0.08,
      duration: 25,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    }, "+=2");

  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const yOffset = Math.sin(time * 0.25) * 0.02;
      groupRef.current.position.y = -0.5 + yOffset;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Responsive scale: 1.8 on mobile, 2.8 on desktop */}
      <primitive object={clonedScene} scale={carScale} />
      
      <pointLight
        ref={leftHeadlightRef}
        position={[1.5, 0.9, 2.5]}
        intensity={0}
        distance={30}
        decay={1.2}
        color="#FFFFED"
        castShadow
      />
      
      <pointLight
        ref={rightHeadlightRef}
        position={[-1.5, 0.9, 2.5]}
        intensity={0}
        distance={30}
        decay={1.2}
        color="#FFFFED"
        castShadow
      />

      <pointLight
        ref={leftGlowRef}
        position={[1.5, 0.9, 2.8]}
        intensity={0}
        distance={20}
        decay={2}
        color="#FFD700"
      />
      
      <pointLight
        ref={rightGlowRef}
        position={[-1.5, 0.9, 2.8]}
        intensity={0}
        distance={20}
        decay={2}
        color="#FFD700"
      />

      <spotLight
        position={[5, 6, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        castShadow
        color="#ffffff"
      />
    </group>
  );
}

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows 
          frameloop="always"
          dpr={[1, 1.5]}
          performance={{ 
            min: 0.5,
            max: 1,
            debounce: 200 
          }}
          gl={{ 
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[5, 2.5, 7]} fov={58} />
            
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
            
            <directionalLight
              position={[-5, 4, 5]}
              intensity={1}
              color="#ffffff"
            />
            
            <Environment preset="night" />
            
            <Porsche911 />
            
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <shadowMaterial opacity={0.4} />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full flex flex-col">
          
          {/* Top Navigation */}
          <nav className="absolute top-0 left-0 right-0 z-20 p-6 pointer-events-auto">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link 
                href="/"
                className="text-white hover:text-[#FFD700] transition-colors text-lg font-semibold"
              >
                ← Back
              </Link>
              
              <Link 
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                Enter Dashboard
              </Link>
            </div>
          </nav>

          {/* LOGO - Responsive: small mobile, big desktop */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 top-16 md:top-24 pointer-events-none transition-all duration-2000 ease-out z-30 ${
              showContent 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative w-24 h-24 md:w-48 md:h-48 lg:w-56 lg:h-56">
              <img 
                src="/images/lyriona-logo.png" 
                alt="LYRIONA Logo" 
                className="relative w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Text Content - Responsive */}
          <div className="flex-1 flex items-center justify-end px-4 sm:px-8 md:px-16 lg:px-24 pt-16 md:pt-0">
            <div 
              className={`text-right max-w-xs sm:max-w-md md:max-w-lg transition-all duration-2000 ease-out ${
                showContent 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-20'
              }`}
            >
              <div className="space-y-2 md:space-y-3 mb-8 md:mb-12">
                <p 
                  className={`text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white font-light tracking-wider md:tracking-widest uppercase transition-all duration-1500 delay-800 neon-text ${
                    showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
                  }}
                >
                  Discipline in Motion
                </p>
                <p 
                  className={`text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-[#FFD700] font-light tracking-wider md:tracking-widest uppercase transition-all duration-1500 delay-1000 neon-text-gold ${
                    showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.4)',
                  }}
                >
                  Focus in Action
                </p>
              </div>

              <p 
                className={`text-xs sm:text-sm text-white/40 font-light leading-relaxed mb-6 md:mb-10 transition-all duration-1500 delay-1200 ${
                  showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                }}
              >
                Die moderne Plattform für<br />
                ambitionierte Musiker
              </p>

              <div 
                className={`flex items-center justify-end gap-2 mb-8 transition-all duration-1500 delay-1400 ${
                  showContent ? 'opacity-30' : 'opacity-0'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-[#FFD700]" />
                <div className="w-8 md:w-10 h-[1px] bg-gradient-to-l from-[#FFD700]/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Buttons - Mobile optimized positioning */}
          <div 
            className={`absolute bottom-8 sm:bottom-12 md:bottom-16 right-4 sm:right-8 md:right-20 lg:right-28 transition-all duration-2000 delay-1600 pointer-events-auto ${
              showContent 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex flex-col items-end gap-2 sm:gap-3">
              <Link 
                href="/dashboard"
                className="group px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-light rounded-lg transition-all duration-500 hover:scale-105 flex items-center gap-2 text-xs tracking-widest uppercase backdrop-blur-md"
              >
                <span style={{ fontWeight: 300, letterSpacing: '0.15em' }}>Get Started</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link 
                href="/#features"
                className="px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 text-white/50 hover:text-[#FFD700] font-light transition-all duration-500 hover:scale-105 text-xs tracking-widest uppercase"
                style={{ fontWeight: 300, letterSpacing: '0.15em' }}
              >
                Learn More
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#FFA500]/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.8), 
              0 0 20px rgba(255, 255, 255, 0.6), 
              0 0 30px rgba(255, 255, 255, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 15px rgba(255, 255, 255, 1), 
              0 0 25px rgba(255, 255, 255, 0.8), 
              0 0 35px rgba(255, 255, 255, 0.6),
              0 0 45px rgba(255, 255, 255, 0.4);
          }
        }

        @keyframes neon-glow-gold {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(255, 215, 0, 0.9), 
              0 0 20px rgba(255, 215, 0, 0.7), 
              0 0 30px rgba(255, 215, 0, 0.5), 
              0 0 40px rgba(255, 165, 0, 0.4);
          }
          50% { 
            text-shadow: 
              0 0 15px rgba(255, 215, 0, 1), 
              0 0 25px rgba(255, 215, 0, 0.9), 
              0 0 35px rgba(255, 215, 0, 0.7),
              0 0 45px rgba(255, 165, 0, 0.6),
              0 0 55px rgba(255, 165, 0, 0.4);
          }
        }

        .neon-text {
          animation: neon-glow 2s ease-in-out infinite;
        }

        .neon-text-gold {
          animation: neon-glow-gold 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

useGLTF.preload("/models/porsche/scene.gltf");