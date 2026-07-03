import React, { useRef, useState, useEffect, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { chapters, Chapter, STATUS_LABEL, STATUS_COLOR, ChapterStatus } from '../data/chapters';

// ─── Asset URLs (from public/) ──────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL ?? '/';
const EARTH_URL = `${BASE}earth.glb`;
const MOON_URL  = `${BASE}moon.glb`;
const SUN_URL   = `${BASE}sun.glb`;

// Preload all models
useGLTF.preload(EARTH_URL);
useGLTF.preload(MOON_URL);
useGLTF.preload(SUN_URL);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const φ = (lat * Math.PI) / 180;
  const λ = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(φ) * Math.sin(λ),
    radius * Math.sin(φ),
    radius * Math.cos(φ) * Math.cos(λ),
  );
}

// ─── Individual Pin ──────────────────────────────────────────────────────────
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
  const pos = latLngToVec3(chapter.lat, chapter.lng, earthRadius + 0.06);
  const color = STATUS_COLOR[chapter.status];
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isHovered ? 0.045 : 0.025;
    const current = (meshRef.current.scale.x - target) * 0.15;
    meshRef.current.scale.setScalar(meshRef.current.scale.x - current);
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      scale={0.025}
      onPointerOver={(e) => { e.stopPropagation(); onHover(chapter); }}
      onPointerOut={(e) => { e.stopPropagation(); onLeave(); }}
      onClick={(e) => { e.stopPropagation(); onClick(chapter); }}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered ? 4 : 1.8}
        toneMapped={false}
      />
      {isHovered && (
        <Html
          distanceFactor={8}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: 'rgba(8,5,22,0.95)',
              border: `1px solid ${color}55`,
              borderRadius: 12,
              padding: '10px 14px',
              minWidth: 180,
              boxShadow: `0 0 20px ${color}33, 0 8px 32px rgba(0,0,0,0.7)`,
              backdropFilter: 'blur(20px)',
              fontSize: 12,
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 800, color: '#fff', marginBottom: 6, fontSize: 13 }}>
              {chapter.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>
              📍 {chapter.city}, {chapter.country}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                background: color, borderRadius: 4,
                padding: '1px 6px', fontSize: 10,
                fontWeight: 700, color: '#000',
              }}>
                {STATUS_LABEL[chapter.status]}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                Est. {chapter.founded}
              </span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 6 }}>
              Click to open profile →
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Earth + Pins ────────────────────────────────────────────────────────────
function EarthGroup({
  hoveredId,
  onHover,
  onLeave,
  onSelect,
}: {
  hoveredId: string | null;
  onHover: (ch: Chapter) => void;
  onLeave: () => void;
  onSelect: (ch: Chapter) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene: earthScene } = useGLTF(EARTH_URL);
  const [earthRadius, setEarthRadius] = useState(1.8);

  // Normalise Earth model scale and disable its raycasting
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(earthScene);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const desired = 1.8;
    const factor = desired / (sphere.radius || 1);
    earthScene.scale.setScalar(factor);
    // Centre model at origin
    earthScene.position.copy(sphere.center).multiplyScalar(-factor);
    setEarthRadius(desired);

    // Disable raycasting on Earth mesh so pins are hittable
    earthScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.raycast = () => {};
      }
    });
  }, [earthScene]);

  // Slow auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
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

// ─── Moon ────────────────────────────────────────────────────────────────────
function MoonModel() {
  const moonRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MOON_URL);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    scene.scale.setScalar(0.5 / (s.radius || 1));
    scene.position.copy(s.center).multiplyScalar(-0.5 / (s.radius || 1));
    scene.traverse((c) => { if (c instanceof THREE.Mesh) c.raycast = () => {}; });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.12;
    if (moonRef.current) {
      moonRef.current.position.set(Math.sin(t) * 5.5, Math.sin(t * 0.3) * 0.5, Math.cos(t) * 5.5);
      moonRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={moonRef}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Sun ─────────────────────────────────────────────────────────────────────
function SunModel() {
  const { scene } = useGLTF(SUN_URL);
  const sunRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const s = new THREE.Sphere();
    box.getBoundingSphere(s);
    scene.scale.setScalar(3.5 / (s.radius || 1));
    scene.position.copy(s.center).multiplyScalar(-3.5 / (s.radius || 1));
    scene.traverse((c) => { if (c instanceof THREE.Mesh) c.raycast = () => {}; });
  }, [scene]);

  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={sunRef} position={[22, 6, -18]}>
      <primitive object={scene} />
      <pointLight intensity={3} distance={120} color="#fff5d6" decay={1} />
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function Scene({
  hoveredId,
  onHover,
  onLeave,
  onSelect,
}: {
  hoveredId: string | null;
  onHover: (ch: Chapter) => void;
  onLeave: () => void;
  onSelect: (ch: Chapter) => void;
}) {
  return (
    <>
      <color attach="background" args={['#020010']} />
      <Stars radius={120} depth={60} count={7000} factor={4} saturation={0} fade speed={0.6} />
      <ambientLight intensity={0.18} />
      <Suspense fallback={null}>
        <SunModel />
        <EarthGroup
          hoveredId={hoveredId}
          onHover={onHover}
          onLeave={onLeave}
          onSelect={onSelect}
        />
        <MoonModel />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={14}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
      />
    </>
  );
}

// ─── Chapter Profile Panel ────────────────────────────────────────────────────
function ChapterPanel({ chapter, onClose }: { chapter: Chapter; onClose: () => void }) {
  const color = STATUS_COLOR[chapter.status];
  return (
    <motion.div
      key={chapter.id}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '90%', maxWidth: 560, zIndex: 200,
        background: 'rgba(6,3,18,0.98)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(40px)',
        overflowY: 'auto',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.7)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '6px 12px', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: 13,
            }}
          >
            ← Back
          </button>
          <span style={{
            background: color, borderRadius: 6, padding: '3px 10px',
            fontSize: 11, fontWeight: 800, color: '#000',
          }}>
            {STATUS_LABEL[chapter.status]}
          </span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.1 }}>
          {chapter.name}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', fontSize: 15 }}>
          {chapter.city}, {chapter.country}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 32px', borderRadius: 12, overflow: 'hidden' }}>
        {[
          { label: 'Members', value: chapter.members },
          { label: 'Events', value: chapter.eventsHosted },
          { label: 'Students', value: `${chapter.studentsEducated.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(6,3,18,0.9)', padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* About */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>About</div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{chapter.about}</p>
        </div>

        {/* Leadership */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Leadership</div>
          {[
            { role: 'Chapter Founder', name: chapter.founder },
            { role: 'Current Lead', name: chapter.lead },
          ].map(l => (
            <div key={l.role} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{l.role}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{l.name}</span>
            </div>
          ))}
        </div>

        {/* Info rows */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Details</div>
          {[
            { label: 'Founded', value: chapter.founded },
            { label: 'Location', value: `${chapter.city}, ${chapter.country}` },
            { label: 'Contact', value: chapter.contact },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Join */}
        <button
          style={{
            marginTop: 8, marginBottom: 32,
            width: '100%', padding: '14px',
            background: color, borderRadius: 12, border: 'none',
            fontSize: 15, fontWeight: 800, color: '#000', cursor: 'pointer',
            boxShadow: `0 4px 24px ${color}55`,
          }}
        >
          Join {chapter.name}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Chapter Card (grid) ──────────────────────────────────────────────────────
function ChapterCard({ chapter, onSelect }: { chapter: Chapter; onSelect: (ch: Chapter) => void }) {
  const color = STATUS_COLOR[chapter.status];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onSelect(chapter)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '18px 20px',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = color + '55')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{chapter.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{chapter.city}, {chapter.country}</div>
        </div>
        <span style={{
          background: color + '22', border: `1px solid ${color}55`,
          borderRadius: 6, padding: '2px 8px',
          fontSize: 10, fontWeight: 700, color, whiteSpace: 'nowrap',
        }}>
          {STATUS_LABEL[chapter.status]}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { v: chapter.members, l: 'members' },
          { v: chapter.eventsHosted, l: 'events' },
          { v: chapter.studentsEducated, l: 'students' },
        ].map(s => (
          <div key={s.l}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {chapter.about}
      </p>
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
      // active: active first, then growing, then new, then dormant
      const rank: Record<ChapterStatus, number> = { active: 0, growing: 1, new: 2, dormant: 3 };
      return rank[a.status] - rank[b.status];
    });

  return (
    <div style={{ background: '#020010', minHeight: '100vh', color: '#fff' }}>

      {/* ── Hero: 3D Space Globe ── */}
      <div style={{ position: 'relative', height: '100vh' }}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          style={{ position: 'absolute', inset: 0 }}
          gl={{ antialias: true }}
        >
          <Scene
            hoveredId={hoveredId}
            onHover={(ch) => setHoveredId(ch.id)}
            onLeave={() => setHoveredId(null)}
            onSelect={(ch) => setSelected(ch)}
          />
        </Canvas>

        {/* Overlay text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 100, pointerEvents: 'none', textAlign: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
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
          background: 'rgba(8,5,22,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, padding: '12px 16px',
        }}>
          {(['active', 'growing', 'new', 'dormant'] as ChapterStatus[]).map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s], boxShadow: `0 0 6px ${STATUS_COLOR[s]}` }} />
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{STATUS_LABEL[s]}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          position: 'absolute', bottom: 32, right: 32,
          display: 'flex', gap: 16,
        }}>
          {[
            { value: chapters.length, label: 'Chapters' },
            { value: chapters.reduce((a, c) => a + c.members, 0), label: 'Members' },
            { value: chapters.reduce((a, c) => a + c.studentsEducated, 0).toLocaleString(), label: 'Students Educated' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(8,5,22,0.7)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
              padding: '12px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Drag to rotate · Scroll to zoom
        </div>
      </div>

      {/* ── Chapter List ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 32px' }}>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, country…"
            style={{
              flex: 1, minWidth: 240, background: 'rgba(255,255,255,0.05)',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(ch => (
            <ChapterCard key={ch.id} chapter={ch} onSelect={setSelected} />
          ))}
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
            borderRadius: 12, padding: '14px 32px', color: 'rgba(100,200,255,1)',
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
            The Moon and Sun are there to remind us — our ambition has no ceiling.
          </p>
        </div>
      </div>

      {/* ── Chapter Profile Panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }}
            />
            <ChapterPanel chapter={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
