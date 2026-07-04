import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import * as THREE from 'three';
import { chapters, Chapter, STATUS_LABEL, STATUS_COLOR, ChapterStatus } from '../data/chapters';

// ─── Asset URLs (from public/) ──────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL ?? '/';
const EARTH_URL   = `${BASE}earth.glb`;
const MOON_URL    = `${BASE}moon.glb`;
const SUN_URL     = `${BASE}sun.glb`;
const SATURN_URL  = `${BASE}saturn.glb`;
const JUPITER_URL = `${BASE}jupiter.glb`;

useGLTF.preload(EARTH_URL);
useGLTF.preload(MOON_URL);
useGLTF.preload(SUN_URL);
useGLTF.preload(SATURN_URL);
useGLTF.preload(JUPITER_URL);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const φ = (lat * Math.PI) / 180;
  const λ = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(φ) * Math.sin(λ),
    radius * Math.sin(φ),
    radius * Math.cos(φ) * Math.cos(λ),
  );
}

function boostMaterials(scene: THREE.Object3D, brightness: number) {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.envMapIntensity = brightness;
          if (mat.emissive && mat.emissiveMap) {
            mat.emissiveIntensity = Math.max(mat.emissiveIntensity ?? 0, 0.25);
          }
          mat.needsUpdate = true;
        }
      });
    }
  });
}

// ─── Pin ──────────────────────────────────────────────────────────────────────
const PIN_BASE_SCALE = 0.022;
const PIN_HOVERED_SCALE = 0.042;
// Deep negative offset — pushes pins well inside the transparent atmosphere
// to sit flush on the opaque surface of the globe model
const PIN_SURFACE_OFFSET = -0.32;

function Pin({
  chapter,
  earthRadius,
  onHover,
  onLeave,
  onClick,
  isHovered,
}: {
  chapter: Chapter;
  earthRadius: number;
  onHover: (ch: Chapter) => void;
  onLeave: () => void;
  onClick: (ch: Chapter) => void;
  isHovered: boolean;
}) {
  const pos = latLngToVec3(chapter.lat, chapter.lng, earthRadius + PIN_SURFACE_OFFSET);
  const color = STATUS_COLOR[chapter.status];
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = isHovered ? PIN_HOVERED_SCALE : PIN_BASE_SCALE;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    if (ringRef.current) {
      ringRef.current.scale.lerp(
        new THREE.Vector3(isHovered ? 2.8 : 1.6, isHovered ? 2.8 : 1.6, isHovered ? 2.8 : 1.6),
        0.12
      );
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.5 : 0.2;
    }
  });

  return (
    <group position={pos}>
      {/* Pulse ring */}
      <mesh ref={ringRef} scale={1.6}>
        <torusGeometry args={[PIN_BASE_SCALE, PIN_BASE_SCALE * 0.18, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} toneMapped={false} />
      </mesh>
      {/* Core dot */}
      <mesh
        ref={meshRef}
        scale={PIN_BASE_SCALE}
        onPointerOver={(e) => { e.stopPropagation(); onHover(chapter); }}
        onPointerOut={(e) => { e.stopPropagation(); onLeave(); }}
        onClick={(e) => { e.stopPropagation(); onClick(chapter); }}
      >
        <sphereGeometry args={[1, 14, 14]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 5 : 2.5}
          toneMapped={false}
        />
      </mesh>
      {isHovered && (
        <Html
          distanceFactor={8}
          center
          position={[0, PIN_HOVERED_SCALE * 2.5, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div style={{
            background: 'rgba(6,3,18,0.97)',
            border: `1px solid ${color}66`,
            borderRadius: 14,
            padding: '12px 16px',
            minWidth: 200,
            boxShadow: `0 0 28px ${color}44, 0 12px 40px rgba(0,0,0,0.8)`,
            backdropFilter: 'blur(24px)',
            fontSize: 12,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
          }}>
            <div style={{ fontWeight: 800, color: '#fff', marginBottom: 6, fontSize: 14 }}>
              {chapter.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>
              📍 {chapter.city}, {chapter.country}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                background: color, borderRadius: 4,
                padding: '2px 8px', fontSize: 10,
                fontWeight: 800, color: '#000',
              }}>
                {STATUS_LABEL[chapter.status]}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
                Est. {chapter.founded}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { v: chapter.members, l: 'members' },
                { v: chapter.eventsHosted, l: 'events' },
              ].map(s => (
                <div key={s.l}>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>{s.v}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginLeft: 3 }}>{s.l}</span>
                </div>
              ))}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 8 }}>
              Click to open profile →
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Earth + Pins ─────────────────────────────────────────────────────────────
function EarthGroup({
  hoveredId, onHover, onLeave, onSelect,
}: {
  hoveredId: string | null;
  onHover: (ch: Chapter) => void;
  onLeave: () => void;
  onSelect: (ch: Chapter) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene: earthScene } = useGLTF(EARTH_URL);
  const [earthRadius, setEarthRadius] = useState(1.8);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(earthScene);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const desired = 1.8;
    const factor = desired / (sphere.radius || 1);
    earthScene.scale.setScalar(factor);
    earthScene.position.copy(sphere.center).multiplyScalar(-factor);
    setEarthRadius(desired);

    earthScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.raycast = () => {};
        // Boost Earth brightness
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.envMapIntensity = 2.2;
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [earthScene]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Dedicated fill light for Earth */}
      <pointLight position={[-4, 3, 3]} intensity={1.4} color="#b8d4ff" distance={18} decay={1.5} />
      <primitive object={earthScene} />
      {chapters.map((ch) => (
        <Pin
          key={ch.id}
          chapter={ch}
          earthRadius={earthRadius}
          onHover={onHover}
          onLeave={onLeave}
          onClick={onSelect}
          isHovered={hoveredId === ch.id}
        />
      ))}
    </group>
  );
}

// ─── Planet Label ─────────────────────────────────────────────────────────────
// distanceFactor makes the HTML label scale with camera distance so it stays
// visually tight to the planet surface regardless of zoom level.
function PlanetLabel({ name, offsetY = 0 }: { name: string; offsetY?: number }) {
  return (
    <Html
      center
      position={[0, offsetY, 0]}
      distanceFactor={18}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
      zIndexRange={[50, 0]}
    >
      <div style={{
        color: 'rgba(255,255,255,0.92)',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textAlign: 'center',
        textShadow: '0 0 12px rgba(255,220,100,0.8), 0 0 24px rgba(255,220,100,0.4)',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}>
        {name}
      </div>
    </Html>
  );
}

// ─── Sun ──────────────────────────────────────────────────────────────────────
// Deep behind Earth — enormous backdrop
const SUN_POS = new THREE.Vector3(0, 0, -130);
const SUN_SCALE = 22;

function SunModel() {
  const { scene } = useGLTF(SUN_URL);
  const sunRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    scene.scale.setScalar(SUN_SCALE / (s.radius || 1));
    scene.position.copy(s.center).multiplyScalar(-SUN_SCALE / (s.radius || 1));
    scene.traverse((c) => { if (c instanceof THREE.Mesh) c.raycast = () => {}; });
  }, [scene]);

  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.012;
  });

  return (
    <group ref={sunRef} position={SUN_POS}>
      <primitive object={scene} />
      {/* Strong central light that reaches Earth */}
      <pointLight intensity={8}  distance={300} color="#fff8e0" decay={0.7} />
      <pointLight intensity={3}  distance={200} color="#ffcc44" decay={1.0} />
      <PlanetLabel name="Sun" offsetY={SUN_SCALE * 0.18} />
    </group>
  );
}

// ─── Moon ─────────────────────────────────────────────────────────────────────
// Orbits Earth — Moon is Earth's satellite, sits between Earth and Jupiter visually
function MoonModel() {
  const moonRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MOON_URL);
  const MOON_SIZE = 0.45;
  const MOON_ORBIT = 3.8; // tight orbit around Earth

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    const factor = MOON_SIZE / (s.radius || 1);
    scene.scale.setScalar(factor);
    scene.position.copy(s.center).multiplyScalar(-factor);
    scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.raycast = () => {};
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.envMapIntensity = 2.8;
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.14;
    if (moonRef.current) {
      moonRef.current.position.set(
        Math.sin(t) * MOON_ORBIT,
        Math.sin(t * 0.28) * 0.4,
        Math.cos(t) * MOON_ORBIT,
      );
      moonRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={moonRef}>
      <pointLight intensity={0.7} distance={6} color="#ddd8c0" decay={2} />
      <primitive object={scene} />
      <PlanetLabel name="Moon" offsetY={MOON_SIZE + 0.1} />
    </group>
  );
}

// ─── Jupiter ──────────────────────────────────────────────────────────────────
// 5th planet from Sun — first gas giant. Correct solar-system order: beyond Earth.
// Placed far right and deeper back so it never overlaps Earth or Saturn.
const JUPITER_POS = new THREE.Vector3(75, 4, -55);
const JUPITER_SCALE = 2.25; // half the original size

function JupiterModel({ onFocus }: { onFocus: () => void }) {
  const jupiterRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(JUPITER_URL);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    scene.scale.setScalar(JUPITER_SCALE / (s.radius || 1));
    scene.position.copy(s.center).multiplyScalar(-JUPITER_SCALE / (s.radius || 1));
    scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.raycast = () => {};
        boostMaterials(c, 2.0);
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (jupiterRef.current) jupiterRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={jupiterRef} position={JUPITER_POS}>
      <primitive object={scene} />
      {/* Invisible hit sphere so clicks register anywhere on the planet */}
      <mesh onClick={(e) => { e.stopPropagation(); onFocus(); }}>
        <sphereGeometry args={[JUPITER_SCALE * 1.1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <PlanetLabel name="Jupiter" offsetY={JUPITER_SCALE + 0.3} />
    </group>
  );
}

// ─── Saturn ───────────────────────────────────────────────────────────────────
// 6th planet from Sun — beyond Jupiter, far left and deep back
const SATURN_POS = new THREE.Vector3(-95, -6, -80);
const SATURN_SCALE = 4.0;

function SaturnModel({ onFocus }: { onFocus: () => void }) {
  const saturnRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(SATURN_URL);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    scene.scale.setScalar(SATURN_SCALE / (s.radius || 1));
    scene.position.copy(s.center).multiplyScalar(-SATURN_SCALE / (s.radius || 1));
    scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.raycast = () => {};
        boostMaterials(c, 2.0);
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={saturnRef} position={SATURN_POS}>
      <primitive object={scene} />
      {/* Invisible hit sphere — Saturn rings make bounding box unreliable */}
      <mesh onClick={(e) => { e.stopPropagation(); onFocus(); }}>
        <sphereGeometry args={[SATURN_SCALE * 1.4, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <PlanetLabel name="Saturn" offsetY={SATURN_SCALE + 0.3} />
    </group>
  );
}

// ─── Camera focus state ────────────────────────────────────────────────────────
interface CamFocus {
  target: THREE.Vector3;
  distance: number; // how far from the target to park the camera
}
const EARTH_FOCUS: CamFocus = { target: new THREE.Vector3(0, 0, 0), distance: 8 };

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({
  hoveredId, onHover, onLeave, onSelect, focusedPlanet, setFocusedPlanet,
}: {
  hoveredId: string | null;
  onHover: (ch: Chapter) => void;
  onLeave: () => void;
  onSelect: (ch: Chapter) => void;
  focusedPlanet: string | null;
  setFocusedPlanet: (name: string | null) => void;
}) {
  const controlsRef = useRef<any>(null);
  const [camFocus, setCamFocus] = useState<CamFocus>(EARTH_FOCUS);
  // Only drive the camera while actively transitioning — stops once settled
  // so it never fights user scroll / orbit after arrival
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (focusedPlanet === 'Jupiter') {
      setCamFocus({ target: JUPITER_POS.clone(), distance: JUPITER_SCALE * 7 });
    } else if (focusedPlanet === 'Saturn') {
      setCamFocus({ target: SATURN_POS.clone(), distance: SATURN_SCALE * 7 });
    } else {
      setCamFocus(EARTH_FOCUS);
    }
    isTransitioning.current = true;
  }, [focusedPlanet]);

  useFrame(({ camera }) => {
    if (!controlsRef.current || !isTransitioning.current) return;

    // Lerp orbit target
    controlsRef.current.target.lerp(camFocus.target, 0.06);
    // Lerp camera toward desired standoff distance from the new target
    const dir = camera.position.clone().sub(controlsRef.current.target).normalize();
    const desired = camFocus.target.clone().add(dir.multiplyScalar(camFocus.distance));
    camera.position.lerp(desired, 0.06);
    controlsRef.current.update();

    // Settle check — stop fighting OrbitControls once close enough
    const orbitErr = controlsRef.current.target.distanceTo(camFocus.target);
    const camErr   = camera.position.distanceTo(desired);
    if (orbitErr < 0.08 && camErr < 0.15) {
      isTransitioning.current = false;
    }
  });

  return (
    <>
      <color attach="background" args={['#020010']} />
      <Stars radius={200} depth={80} count={8000} factor={4} saturation={0} fade speed={0.5} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[-6, 2, 4]} intensity={0.4} color="#c8d8ff" />
      <Suspense fallback={null}>
        {/* Solar system order (Sun at back): Sun → Earth → Moon → Jupiter → Saturn */}
        <SunModel />
        <EarthGroup hoveredId={hoveredId} onHover={onHover} onLeave={onLeave} onSelect={onSelect} />
        <MoonModel />
        <JupiterModel onFocus={() => setFocusedPlanet('Jupiter')} />
        <SaturnModel  onFocus={() => setFocusedPlanet('Saturn')} />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={3}
        maxDistance={200}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
      />
    </>
  );
}

// ─── Placeholder helpers ───────────────────────────────────────────────────────
function AvatarPlaceholder({ name, role, color }: { name: string; role: string; color: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `2px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 800, color,
      }}>{initials}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{name}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{role}</div>
      </div>
    </div>
  );
}

function PhotoPlaceholder({ index }: { index: number }) {
  const labels = ['Workshop Highlights', 'Community Event', 'Guest Speaker', 'Team Meetup', 'Awards Night', 'Study Session'];
  return (
    <div style={{
      aspectRatio: '16/10',
      background: 'rgba(255,255,255,0.03)',
      border: '1px dashed rgba(255,255,255,0.12)',
      borderRadius: 10,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: 12,
    }}>
      <div style={{ fontSize: 22, opacity: 0.3 }}>📷</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
        {labels[index % labels.length]}
      </div>
    </div>
  );
}

function EventPlaceholder({ title, date, attendees, color }: { title: string; date: string; attendees: number; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color, lineHeight: 1.2,
      }}>
        <div>{date.split(' ')[0]}</div>
        <div style={{ fontWeight: 400, opacity: 0.7 }}>{date.split(' ')[1]}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{attendees} expected attendees</div>
      </div>
      <div style={{ fontSize: 10, color, fontWeight: 700, whiteSpace: 'nowrap', background: `${color}15`, padding: '4px 10px', borderRadius: 6 }}>
        Register →
      </div>
    </div>
  );
}

// ─── Chapter Profile Modal ─────────────────────────────────────────────────────
function ChapterPanel({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const color = STATUS_COLOR[chapter.status];
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [, navigate] = useLocation();

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${chapter.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [chapter.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) setSubmitted(true);
  };

  // Placeholder team members derived from real data
  const teamMembers = [
    { name: chapter.founder, role: 'Chapter Founder' },
    { name: chapter.lead, role: 'Current Lead' },
    { name: 'Open Position', role: 'Events Coordinator' },
    { name: 'Open Position', role: 'Marketing Lead' },
    { name: 'Open Position', role: 'Finance Officer' },
  ];

  // Placeholder upcoming events
  const upcomingEvents = [
    { title: `${chapter.name} Monthly Meetup`, date: 'AUG 12', attendees: 40 },
    { title: 'Behavioral Finance Workshop', date: 'SEP 3', attendees: 60 },
    { title: 'Investment Basics Bootcamp', date: 'SEP 18', attendees: 35 },
  ];

  return (
    <motion.div
      key={chapter.id}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}
      style={{
        position: 'relative',
        width: '92%',
        maxWidth: 980,
        maxHeight: '90vh',
        zIndex: 200,
        background: 'rgba(5,2,16,0.99)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(48px)',
        borderRadius: 20,
        overflowY: 'auto',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 40px 120px rgba(0,0,0,0.9), 0 0 80px ${color}18`,
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Accent top bar ── */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}00)`, borderRadius: '20px 20px 0 0' }} />

      {/* ── Header ── */}
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Chapter avatar */}
        <div style={{
          width: 56, height: 56, flexShrink: 0, borderRadius: 14,
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          border: `1.5px solid ${color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          🌍
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>{chapter.name}</h2>
            <span style={{
              background: color, borderRadius: 6, padding: '3px 10px',
              fontSize: 10, fontWeight: 800, color: '#000', whiteSpace: 'nowrap',
            }}>
              {STATUS_LABEL[chapter.status]}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', margin: 0, fontSize: 14 }}>
            📍 {chapter.city}, {chapter.country} · Est. {chapter.founded}
          </p>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={() => { onClose(); navigate(`/chapters/${chapter.id}`); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: color, border: 'none',
              borderRadius: 9, padding: '8px 14px',
              color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            View Full Profile →
          </button>
          <button
            onClick={handleCopy}
            title="Copy chapter link"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: copied ? `${color}22` : 'rgba(255,255,255,0.07)',
              border: `1px solid ${copied ? color + '55' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 9, padding: '8px 14px',
              color: copied ? color : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied!' : '🔗 Share'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 9, padding: '8px 14px', color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', margin: '20px 32px', borderRadius: 14, overflow: 'hidden' }}>
        {[
          { label: 'Members', value: chapter.members, icon: '👥' },
          { label: 'Events Hosted', value: chapter.eventsHosted, icon: '📅' },
          { label: 'Students Educated', value: chapter.studentsEducated.toLocaleString(), icon: '🎓' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(5,2,16,0.95)', padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Content grid ── */}
      <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* About */}
          <section>
            <SectionLabel>About</SectionLabel>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{chapter.about}</p>
          </section>

          {/* Details */}
          <section>
            <SectionLabel>Details</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Founded', value: String(chapter.founded) },
                { label: 'Location', value: `${chapter.city}, ${chapter.country}` },
                { label: 'Contact', value: chapter.contact },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <SectionLabel>Team</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 16 }}>
              {teamMembers.map((m, i) => (
                <AvatarPlaceholder
                  key={i}
                  name={m.name}
                  role={m.role}
                  color={m.name === 'Open Position' ? 'rgba(255,255,255,0.3)' : color}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Photo Gallery */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <SectionLabel noMargin>Photo Gallery</SectionLabel>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 5 }}>
                Photos coming soon
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[0, 1, 2, 3].map(i => <PhotoPlaceholder key={i} index={i} />)}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <SectionLabel noMargin>Upcoming Events</SectionLabel>
              <span style={{ fontSize: 10, color: color, fontWeight: 700, cursor: 'pointer' }}>View all →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcomingEvents.map((ev, i) => (
                <EventPlaceholder key={i} {...ev} color={color} />
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* ── Registration ── */}
      <div style={{
        margin: '0 32px 32px',
        padding: '28px',
        background: `linear-gradient(135deg, ${color}0f, rgba(255,255,255,0.02))`,
        border: `1px solid ${color}2a`,
        borderRadius: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              Join {chapter.name}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Register your interest — the chapter lead will reach out within 3 days.
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, color,
            background: `${color}18`, border: `1px solid ${color}33`,
            borderRadius: 8, padding: '4px 12px',
          }}>
            {chapter.members} members
          </div>
        </div>

        {submitted ? (
          <div style={{
            padding: '20px', textAlign: 'center',
            background: `${color}12`, borderRadius: 12,
            border: `1px solid ${color}33`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Application Received!</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {chapter.lead} from {chapter.name} will be in touch soon.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Full Name *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9, padding: '10px 14px',
                    color: '#fff', fontSize: 13, outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Email *
                </label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  type="email"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 9, padding: '10px 14px',
                    color: '#fff', fontSize: 13, outline: 'none',
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Why do you want to join?
              </label>
              <textarea
                value={form.motivation}
                onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                placeholder="Tell us a bit about yourself and your interest in financial literacy…"
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 9, padding: '10px 14px',
                  color: '#fff', fontSize: 13, outline: 'none',
                  resize: 'vertical', fontFamily: 'inherit',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%', padding: '13px',
                background: color, borderRadius: 10, border: 'none',
                fontSize: 14, fontWeight: 800, color: '#000', cursor: 'pointer',
                boxShadow: `0 4px 24px ${color}44`,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Apply to Join {chapter.name} →
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

// ─── Small helper component ───────────────────────────────────────────────────
function SectionLabel({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
      marginBottom: noMargin ? 0 : 12,
    }}>
      {children}
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────
function ChapterCard({ chapter, onSelect }: { chapter: Chapter; onSelect: (ch: Chapter) => void }) {
  const color = STATUS_COLOR[chapter.status];
  const [, navigate] = useLocation();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        borderRadius: 22, overflow: 'hidden',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        border: `1px solid ${hovered ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered ? `0 24px 64px ${color}28, 0 0 0 1px ${color}20` : '0 4px 24px rgba(0,0,0,0.4)',
        background: '#0a0718',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* ── COVER (top 44% of card) ── */}
      <div style={{
        position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0,
        background: `linear-gradient(135deg, ${color}28 0%, ${color}08 50%, rgba(10,7,24,0) 100%)`,
      }}>
        {/* Noise texture via repeating gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${color}30 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
        }} />
        {/* Diagonal line accent */}
        <div style={{
          position: 'absolute', top: -20, right: 40, width: 1, height: '200%',
          background: `linear-gradient(to bottom, transparent, ${color}40, transparent)`,
          transform: 'rotate(20deg)',
        }} />
        <div style={{
          position: 'absolute', top: -20, right: 80, width: 1, height: '200%',
          background: `linear-gradient(to bottom, transparent, ${color}15, transparent)`,
          transform: 'rotate(20deg)',
        }} />

        {/* Status pill — top left */}
        <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            border: `1px solid ${color}50`,
            borderRadius: 99, padding: '5px 12px',
            fontSize: 9, fontWeight: 800, color, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
            {STATUS_LABEL[chapter.status]}
          </span>
        </div>

        {/* Est. year — top right */}
        <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', padding: '5px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.08)' }}>
          Est. {chapter.founded}
        </div>

        {/* Flag — centered, massive */}
        <div style={{
          position: 'absolute', bottom: 8, left: 20,
          fontSize: 72, lineHeight: 1,
          filter: hovered ? `drop-shadow(0 0 24px ${color}80)` : `drop-shadow(0 4px 12px rgba(0,0,0,0.5))`,
          transition: 'filter 0.4s',
          userSelect: 'none',
        }}>
          {chapter.flagEmoji}
        </div>

        {/* Chapter city label — bottom right of cover */}
        <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.04em' }}>{chapter.city}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{chapter.country}</div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>

        {/* Name */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {chapter.name}
          </h3>
          {chapter.university && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ opacity: 0.6 }}>🎓</span> {chapter.university}
            </div>
          )}
        </div>

        {/* About snippet */}
        <p style={{
          fontSize: 12, color: 'rgba(255,255,255,0.48)', margin: 0, lineHeight: 1.65,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {chapter.about}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {chapter.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 700, padding: '4px 9px',
              background: `${color}12`, border: `1px solid ${color}25`,
              borderRadius: 99, color, letterSpacing: '0.05em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats — horizontal pill-style */}
        <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { v: chapter.members, l: 'Members' },
            { v: chapter.eventsHosted, l: 'Events' },
            { v: chapter.studentsEducated >= 1000 ? `${(chapter.studentsEducated / 1000).toFixed(1)}k` : chapter.studentsEducated, l: 'Students' },
          ].map((s, i) => (
            <div key={s.l} style={{
              flex: 1, padding: '10px 8px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
          <button
            onClick={e => { e.stopPropagation(); onSelect(chapter); }}
            style={{
              flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            Quick View
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/chapters/${chapter.id}`); }}
            style={{
              flex: 2, padding: '10px', borderRadius: 10, border: 'none',
              background: color, color: '#000',
              fontSize: 12, fontWeight: 800, cursor: 'pointer',
              boxShadow: `0 4px 16px ${color}40`,
              transition: 'opacity 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Explore Chapter →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Chapters() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Chapter | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChapterStatus | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'largest' | 'active'>('active');
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);

  const filtered = chapters
    .filter(ch => {
      const q = search.toLowerCase();
      const matchesQ = !q || ch.name.toLowerCase().includes(q) || ch.city.toLowerCase().includes(q) || ch.country.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || ch.status === statusFilter;
      return matchesQ && matchesStatus;
    })
    .sort((a, b) => {
      if (sort === 'newest') return b.founded - a.founded;
      if (sort === 'oldest') return a.founded - b.founded;
      if (sort === 'largest') return b.members - a.members;
      const rank: Record<ChapterStatus, number> = { active: 0, growing: 1, new: 2, dormant: 3 };
      return rank[a.status] - rank[b.status];
    });

  return (
    <div style={{ color: '#fff', backgroundColor: '#020010' }}>

      {/* ── Hero: 3D Space Globe ── */}
      <div style={{ position: 'relative', height: '100vh' }}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          style={{ position: 'absolute', inset: 0 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
        >
          <Scene
            hoveredId={hoveredId}
            onHover={(ch) => setHoveredId(ch.id)}
            onLeave={() => setHoveredId(null)}
            onSelect={(ch) => setSelected(ch)}
            focusedPlanet={focusedPlanet}
            setFocusedPlanet={setFocusedPlanet}
          />
        </Canvas>

        {/* Overlay text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 100, pointerEvents: 'none', textAlign: 'center',
        }}>
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(100,200,255,0.8)', marginBottom: 12 }}>
              Our Reach
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, margin: 0, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              Explore the GCL Network
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.7 }}>
              Every chapter begins on Earth. Every mission reaches beyond it.
            </p>
          </motion.div>
        </div>

        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 32, left: 32,
          display: 'flex', flexDirection: 'column', gap: 8,
          background: 'rgba(8,5,22,0.75)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px',
        }}>
          {(['active', 'growing', 'new', 'dormant'] as ChapterStatus[]).map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: STATUS_COLOR[s], boxShadow: `0 0 8px ${STATUS_COLOR[s]}` }} />
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{STATUS_LABEL[s]}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ position: 'absolute', bottom: 32, right: 32, display: 'flex', gap: 12 }}>
          {[
            { value: chapters.length, label: 'Chapters' },
            { value: chapters.reduce((a, c) => a + c.members, 0), label: 'Members' },
            { value: chapters.reduce((a, c) => a + c.studentsEducated, 0).toLocaleString(), label: 'Students Educated' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(8,5,22,0.75)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
              padding: '12px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Back to Earth button — appears when zoomed to a planet */}
        <AnimatePresence>
          {focusedPlanet && (
            <motion.button
              key="back-to-earth"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              onClick={() => setFocusedPlanet(null)}
              style={{
                position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(8,5,22,0.85)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(100,180,255,0.35)', borderRadius: 20,
                padding: '10px 20px', color: 'rgba(100,200,255,0.9)',
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                boxShadow: '0 0 24px rgba(100,180,255,0.15)',
              }}
            >
              ← Back to Earth
            </motion.button>
          )}
        </AnimatePresence>

        {!focusedPlanet && (
          <div style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            fontSize: 11, color: 'rgba(255,255,255,0.28)', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Drag to rotate · Scroll to zoom · Click pin to open chapter · Click planet to fly to it
          </div>
        )}
      </div>

      {/* ── Chapter List ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(100,200,255,0.6)', marginBottom: 8 }}>
            Global Directory
          </div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            All Chapters
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
            {chapters.length} chapters across {new Set(chapters.map(c => c.country)).size} countries
          </p>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, country…"
            style={{
              flex: 1, minWidth: 240,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
              padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none',
            }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ChapterStatus | 'all')}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="growing">Growing</option>
            <option value="new">Newly Founded</option>
            <option value="dormant">Dormant</option>
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none',
            }}
          >
            <option value="active">Most Active</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="largest">Largest Team</option>
          </select>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(ch => <ChapterCard key={ch.id} chapter={ch} onSelect={setSelected} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
            No chapters match your search.
          </div>
        )}
      </div>

      {/* ── Start a Chapter ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(100,200,255,0.7)', marginBottom: 12 }}>
            Grow the Network
          </div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Start a Chapter
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Every chapter on this globe started with one person who decided their city deserved better financial education. No cap.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
            {[
              { step: '01', text: 'Register your interest' },
              { step: '02', text: 'Organise your first financial literacy event' },
              { step: '03', text: 'Successfully host with 10+ verified attendees' },
              { step: '04', text: 'Earn your permanent spot on the GCL map as Chapter Founder' },
            ].map(s => (
              <div key={s.step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'rgba(100,200,255,0.5)', marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <button style={{
            background: 'rgba(100,200,255,0.15)', border: '1px solid rgba(100,200,255,0.35)',
            borderRadius: 12, padding: '14px 36px', color: 'rgba(100,200,255,1)',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 0 32px rgba(100,200,255,0.12)',
          }}>
            Apply to Start a Chapter
          </button>
        </div>
      </div>

      {/* ── Beyond Earth ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🌌</div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,38px)', fontWeight: 800, margin: '0 0 14px', lineHeight: 1.1 }}>
            The Next Chapter is Yours to Build.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            Before humanity builds cities on Mars, help us build financial literacy on Earth.
            Saturn, Jupiter, and the Moon are up there to remind us — our ambition has no ceiling.
          </p>
        </div>
      </div>

      {/* ── Chapter Profile Modal ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(6px)',
                zIndex: 199,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChapterPanel chapter={selected} onClose={() => setSelected(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
