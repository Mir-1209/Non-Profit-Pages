import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../context/CertificateContext';
import { Certificate } from '../context/CertificateContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

export function VerifyPage() {
  const { getCertById, certificates } = useCertificates();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Certificate | 'not_found' | null>(null);
  const [tried, setTried] = useState(false);

  const doVerify = (q: string) => {
    const trimmed = q.trim().toUpperCase();
    if (!trimmed) return;
    setTried(true);
    const cert = certificates.find(c => c.id.toUpperCase() === trimmed);
    setResult(cert ?? 'not_found');
  };

  return (
    <main className="min-h-screen bg-[var(--paper-alt)] flex flex-col">
      {/* Header */}
      <div style={{ background: 'var(--brutal-bg)' }} className="border-b-[3px] border-white/10">
        <div className="max-w-[900px] mx-auto px-6 py-5 flex items-center justify-between">
          <Link href={`${BASE}/`}>
            <img src={logoImg} alt="GCL" className="h-8 object-contain" />
          </Link>
          <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--neon-cyan)]">Certificate Verification</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--brutal-bg)' }} className="pb-12">
        <div className="max-w-[900px] mx-auto px-6 pt-10">
          <div className="text-[10px] font-[800] uppercase tracking-[0.2em] text-white/40 mb-3">Global Capital League</div>
          <h1 className="font-[800] text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-[-0.04em] text-white uppercase mb-4">
            Verify Certificate
          </h1>
          <p className="text-[14px] text-white/40 font-[500] max-w-[480px]">
            Enter a Certificate ID to confirm authenticity. This page only shows verification data — no private information is exposed.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 py-12">
        <div className="max-w-[900px] mx-auto px-6">

          {/* Search */}
          <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-8 mb-6">
            <div className="font-[800] text-[13px] uppercase tracking-wider mb-5 border-b-[2px] border-[var(--ink)] pb-4">
              Enter Certificate ID
            </div>
            <div className="flex gap-0">
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setTried(false); setResult(null); }}
                onKeyDown={e => e.key === 'Enter' && doVerify(query)}
                placeholder="e.g. GCL-2026-4821"
                className="flex-1 px-5 py-4 border-[2.5px] border-r-0 border-[var(--ink)] text-[15px] font-[700] tracking-wider outline-none font-mono placeholder:font-sans placeholder:font-[400] placeholder:text-[var(--ink-faint)] focus:bg-[var(--paper-alt)]"
              />
              <button
                onClick={() => doVerify(query)}
                className="px-8 py-4 border-[2.5px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[12px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors shrink-0"
              >
                Verify
              </button>
            </div>
            <p className="text-[11.5px] text-[var(--ink-faint)] mt-3 font-[500]">
              The Certificate ID is printed on the certificate (format: GCL-YYYY-NNNN). You can also scan the QR code on the certificate to verify instantly.
            </p>
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {result === 'not_found' ? (
                  <div className="border-[2.5px] border-red-300 shadow-[6px_6px_0px_#fca5a5] bg-white p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border-[2px] border-red-300 bg-red-50 flex items-center justify-center shrink-0">
                        <span className="text-red-500 font-[800] text-[16px]">✕</span>
                      </div>
                      <div>
                        <div className="font-[800] text-[17px] uppercase tracking-[-0.01em] text-red-600">Certificate Not Found</div>
                        <div className="text-[12.5px] text-[var(--ink-soft)] mt-0.5">No certificate matching "{query.trim()}" was found in our records.</div>
                      </div>
                    </div>
                    <div className="border-l-[3px] border-red-200 pl-4 text-[12.5px] text-[var(--ink-soft)]">
                      If you believe this is an error, please contact the issuing organization directly.
                    </div>
                  </div>
                ) : result.revoked ? (
                  <div className="border-[2.5px] border-red-300 shadow-[6px_6px_0px_#fca5a5] bg-white p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border-[2px] border-red-300 bg-red-50 flex items-center justify-center shrink-0">
                        <span className="text-red-500 font-[800] text-[16px]">✕</span>
                      </div>
                      <div>
                        <div className="font-[800] text-[17px] uppercase tracking-[-0.01em] text-red-600">Certificate Revoked</div>
                        <div className="text-[12.5px] text-[var(--ink-soft)] mt-0.5">This certificate has been revoked by the issuing organization.</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 pt-6 border-t-[2px] border-[var(--line)]">
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">Certificate ID</div><div className="font-[800] font-mono text-[14px]">{result.id}</div></div>
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">Recipient</div><div className="font-[700] text-[14px]">{result.recipientName}</div></div>
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1">Revoked</div><div className="font-[700] text-[14px]">{result.revokedAt ?? '—'}</div></div>
                    </div>
                  </div>
                ) : (
                  <div className="border-[2.5px] border-green-400 shadow-[6px_6px_0px_#86efac] bg-white p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 border-[2px] border-green-400 bg-green-50 flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-[800] text-[18px]">✓</span>
                      </div>
                      <div>
                        <div className="font-[800] text-[17px] uppercase tracking-[-0.01em] text-green-700">Certificate Valid</div>
                        <div className="text-[12.5px] text-[var(--ink-soft)] mt-0.5">This is an authentic certificate issued by Global Capital League.</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6 border-t-[2px] border-[var(--line)]">
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">Certificate ID</div><div className="font-[800] font-mono text-[14px]">{result.id}</div></div>
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">Recipient</div><div className="font-[700] text-[15px]">{result.recipientName}</div></div>
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">Program</div><div className="font-[700] text-[14px]">{result.programName}</div></div>
                      <div><div className="text-[10px] font-[800] uppercase tracking-wider text-[var(--ink-faint)] mb-1.5">Issue Date</div><div className="font-[700] text-[14px]">{result.issueDate}</div></div>
                    </div>
                    {result.visibility === 'link' && (
                      <div className="mt-5 pt-5 border-t-[2px] border-[var(--line)] flex items-center justify-between flex-wrap gap-3">
                        <p className="text-[12px] text-[var(--ink-soft)] font-[500]">This recipient has enabled certificate sharing.</p>
                        <Link href={`${BASE}/certificate/${result.token}`}
                          className="px-5 py-2.5 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[11px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">
                          View Certificate →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info footer */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🔒', title: 'Privacy Protected', desc: 'Only verification data is shown — no private account details.' },
              { icon: '🤖', title: 'Tamper Evident', desc: 'Each certificate has a unique cryptographic ID that cannot be duplicated.' },
              { icon: '📋', title: 'Issued by GCL', desc: 'All certificates are issued and verified by Global Capital League.' },
            ].map(item => (
              <div key={item.title} className="border-[2px] border-[var(--line)] bg-white p-5 hover:border-[var(--ink)] transition-colors">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-[800] text-[13px] mb-1">{item.title}</div>
                <div className="text-[12px] text-[var(--ink-soft)]">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
