import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Certificate {
  id: string;
  token: string;
  memberId: string;
  recipientName: string;
  programName: string;
  issueDate: string;
  visibility: 'private' | 'link';
  revoked: boolean;
  revokedAt?: string;
  viewCount: number;
  viewLog: { timestamp: string; viewer?: string }[];
  createdAt: string;
  createdBy: string;
}

export interface CongratPage {
  id: string;
  token: string;
  memberId: string;
  recipientName: string;
  programName: string;
  message: string;
  accessMode: 'login' | 'link';
  expiresAt?: string;
  revoked: boolean;
  revokedAt?: string;
  viewCount: number;
  viewLog: { timestamp: string; viewer?: string }[];
  certificateId?: string;
  createdAt: string;
  createdBy: string;
}

interface CertificateContextType {
  certificates: Certificate[];
  addCertificate: (c: Certificate) => void;
  updateCertificate: (c: Certificate) => void;
  deleteCertificate: (id: string) => void;
  revokeCertificate: (id: string) => void;
  regenerateCertToken: (id: string) => string;
  recordCertView: (token: string, viewer?: string) => void;
  getCertByToken: (token: string) => Certificate | undefined;
  getCertById: (id: string) => Certificate | undefined;
  getMyCertificates: (memberId: string) => Certificate[];

  congratPages: CongratPage[];
  addCongratPage: (p: CongratPage) => void;
  updateCongratPage: (p: CongratPage) => void;
  deleteCongratPage: (id: string) => void;
  revokeCongratPage: (id: string) => void;
  regenerateCongratToken: (id: string) => string;
  recordCongratView: (token: string, viewer?: string) => void;
  getCongratByToken: (token: string) => CongratPage | undefined;
  getMyCongratPages: (memberId: string) => CongratPage[];

  generateToken: () => string;
  generateCertId: () => string;
}

const CertificateContext = createContext<CertificateContextType | null>(null);

export function generateToken(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => chars[b % chars.length]).join('');
}

export function generateCertId(): string {
  const year = new Date().getFullYear();
  const arr = new Uint8Array(2);
  crypto.getRandomValues(arr);
  const num = ((arr[0] << 8) | arr[1]) % 9000 + 1000;
  return `GCL-${year}-${num}`;
}

function now() {
  return new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch {}
  return fallback;
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const INITIAL_CERTS: Certificate[] = [
  {
    id: 'GCL-2026-4821',
    token: 'demoKsLmQ8hF29rP',
    memberId: 'Mirzo10',
    recipientName: 'Mirzo',
    programName: "GCL Summer '26 Team",
    issueDate: 'July 4, 2026',
    visibility: 'link',
    revoked: false,
    viewCount: 3,
    viewLog: [{ timestamp: 'Jul 4, 2026 · 14:23' }, { timestamp: 'Jul 5, 2026 · 09:11' }],
    createdAt: '2026-07-04',
    createdBy: 'Mirzo12',
  },
];

const INITIAL_CONGRATS: CongratPage[] = [
  {
    id: 'cg1',
    token: 'congF9Gh28LmPxQwR',
    memberId: 'Mirzo10',
    recipientName: 'Mirzo',
    programName: "GCL Summer '26 Team",
    message: "We are thrilled to welcome you to the GCL Summer '26 Team. Your application stood out among hundreds of talented candidates, and we cannot wait to work alongside you this summer. This is just the beginning of something remarkable.",
    accessMode: 'link',
    revoked: false,
    viewCount: 1,
    viewLog: [{ timestamp: 'Jul 4, 2026 · 14:05' }],
    certificateId: 'GCL-2026-4821',
    createdAt: '2026-07-04',
    createdBy: 'Mirzo12',
  },
];

export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>(() => load('gcl_certificates', INITIAL_CERTS));
  const [congratPages, setCongratPages] = useState<CongratPage[]>(() => load('gcl_congrat_pages', INITIAL_CONGRATS));

  useEffect(() => { save('gcl_certificates', certificates); }, [certificates]);
  useEffect(() => { save('gcl_congrat_pages', congratPages); }, [congratPages]);

  const addCertificate = (c: Certificate) => setCertificates(p => [c, ...p]);
  const updateCertificate = (c: Certificate) => setCertificates(p => p.map(x => x.id === c.id ? c : x));
  const deleteCertificate = (id: string) => setCertificates(p => p.filter(x => x.id !== id));
  const revokeCertificate = (id: string) => setCertificates(p => p.map(x => x.id === id ? { ...x, revoked: true, revokedAt: now() } : x));
  const regenerateCertToken = (id: string) => {
    const token = generateToken();
    setCertificates(p => p.map(x => x.id === id ? { ...x, token } : x));
    return token;
  };
  const recordCertView = (token: string, viewer?: string) => {
    setCertificates(p => p.map(x => x.token === token ? { ...x, viewCount: x.viewCount + 1, viewLog: [{ timestamp: now(), viewer }, ...x.viewLog].slice(0, 50) } : x));
  };
  const getCertByToken = (token: string) => certificates.find(c => c.token === token);
  const getCertById = (id: string) => certificates.find(c => c.id === id);
  const getMyCertificates = (memberId: string) => certificates.filter(c => c.memberId === memberId);

  const addCongratPage = (p: CongratPage) => setCongratPages(prev => [p, ...prev]);
  const updateCongratPage = (p: CongratPage) => setCongratPages(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteCongratPage = (id: string) => setCongratPages(p => p.filter(x => x.id !== id));
  const revokeCongratPage = (id: string) => setCongratPages(p => p.map(x => x.id === id ? { ...x, revoked: true, revokedAt: now() } : x));
  const regenerateCongratToken = (id: string) => {
    const token = generateToken();
    setCongratPages(p => p.map(x => x.id === id ? { ...x, token } : x));
    return token;
  };
  const recordCongratView = (token: string, viewer?: string) => {
    setCongratPages(p => p.map(x => x.token === token ? { ...x, viewCount: x.viewCount + 1, viewLog: [{ timestamp: now(), viewer }, ...x.viewLog].slice(0, 50) } : x));
  };
  const getCongratByToken = (token: string) => congratPages.find(p => p.token === token);
  const getMyCongratPages = (memberId: string) => congratPages.filter(p => p.memberId === memberId);

  return (
    <CertificateContext.Provider value={{
      certificates, addCertificate, updateCertificate, deleteCertificate, revokeCertificate, regenerateCertToken, recordCertView, getCertByToken, getCertById, getMyCertificates,
      congratPages, addCongratPage, updateCongratPage, deleteCongratPage, revokeCongratPage, regenerateCongratToken, recordCongratView, getCongratByToken, getMyCongratPages,
      generateToken, generateCertId,
    }}>
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const ctx = useContext(CertificateContext);
  if (!ctx) throw new Error('useCertificates must be used within CertificateProvider');
  return ctx;
}
