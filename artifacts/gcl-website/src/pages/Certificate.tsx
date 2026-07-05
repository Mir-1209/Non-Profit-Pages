import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { useCertificates } from '../context/CertificateContext';
import { useAppAuth } from '../context/AuthContext';
import logoImg from '@assets/Untitled_design-9_1783003171841.png';

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

export function CertificatePage() {
  const { token } = useParams<{ token: string }>();
  const { getCertByToken, recordCertView } = useCertificates();
  const { user } = useAppAuth();
  const [copied, setCopied] = useState(false);

  const cert = getCertByToken(token ?? '');

  useEffect(() => {
    if (cert && !cert.revoked) {
      recordCertView(token ?? '', user?.id);
    }
  }, [token]);

  const shareUrl = `${window.location.origin}${BASE}/certificate/${token}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff&color=15132c&margin=6`;

  if (!cert) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-[var(--paper-alt)]">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-8" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3">Certificate Not Found</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-6">This certificate link is invalid or no longer available.</p>
          <Link href={`${BASE}/verify`} className="inline-block px-6 py-3 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[12px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">
            Go to Verification
          </Link>
        </div>
      </main>
    );
  }

  if (cert.revoked) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-[var(--paper-alt)]">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-8" />
        <div className="border-[2.5px] border-red-300 shadow-[8px_8px_0px_#fca5a5] bg-white p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3 text-red-600">Certificate Revoked</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-2">This certificate has been revoked by the issuing organization.</p>
          {cert.revokedAt && <p className="text-[12px] text-[var(--ink-faint)]">Revoked: {cert.revokedAt}</p>}
        </div>
      </main>
    );
  }

  if (cert.visibility === 'private' && user?.id !== cert.memberId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-[var(--paper-alt)]">
        <img src={logoImg} alt="GCL" className="h-9 object-contain mb-8" />
        <div className="border-[2.5px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-white p-10 max-w-[440px] w-full text-center">
          <div className="font-[800] text-[22px] uppercase tracking-[-0.02em] mb-3">Private Certificate</div>
          <p className="text-[14px] text-[var(--ink-soft)] mb-6">This certificate is set to private. Only the recipient can view it.</p>
          <Link href={`${BASE}/signin`} className="inline-block px-6 py-3 border-[2px] border-[var(--ink)] bg-[var(--ink)] text-white font-[800] text-[12px] uppercase tracking-wider hover:bg-transparent hover:text-[var(--ink)] transition-colors">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper-alt)] py-12 px-4 print:bg-white print:py-0 print:px-0">
      {/* Back nav — hidden on print */}
      <div className="max-w-[820px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href={`${BASE}/`} className="flex items-center gap-2">
          <img src={logoImg} alt="GCL" className="h-7 object-contain" />
        </Link>
        <Link href={`${BASE}/verify`} className="text-[12px] font-[700] uppercase tracking-wider text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
          Verify Certificate
        </Link>
      </div>

      {/* Certificate card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[820px] mx-auto border-[3px] border-[var(--ink)] shadow-[12px_12px_0px_var(--ink)] bg-white print:shadow-none print:border-[1.5px]"
      >
        {/* Header strip */}
        <div className="px-12 py-8 border-b-[3px] border-[var(--ink)] flex items-center justify-between gap-6" style={{ background: 'var(--brutal-bg)' }}>
          <div>
            <img src={logoImg} alt="GCL" className="h-9 object-contain mb-3 brightness-0 invert" />
            <div className="text-[9px] font-[800] uppercase tracking-[0.24em] text-white/40">Global Capital League</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-[800] uppercase tracking-[0.2em] text-white/40 mb-1">Certificate of</div>
            <div className="font-[800] text-[22px] uppercase tracking-[0.06em] text-white leading-none">Completion</div>
          </div>
        </div>

        {/* Body */}
        <div className="px-12 py-10">
          <div className="text-[12px] font-[600] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-5">This certifies that</div>

          <div className="font-[800] text-[clamp(36px,5vw,56px)] leading-[1] tracking-[-0.03em] text-[var(--ink)] mb-5">
            {cert.recipientName}
          </div>

          <div className="text-[14px] font-[500] text-[var(--ink-soft)] mb-2">has successfully completed the program</div>

          <div className="font-[800] text-[clamp(20px,2.5vw,28px)] tracking-[-0.02em] text-[var(--ink)] mb-10 pb-10 border-b-[2px] border-[var(--line)]">
            {cert.programName}
          </div>

          {/* Meta + QR */}
          <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
            <div className="space-y-5">
              <div>
                <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-1">Issue Date</div>
                <div className="font-[700] text-[15px] text-[var(--ink)]">{cert.issueDate}</div>
              </div>
              <div>
                <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-1">Certificate ID</div>
                <div className="font-[800] text-[16px] tracking-wider text-[var(--ink)] font-mono">{cert.id}</div>
              </div>
              <div>
                <div className="text-[10px] font-[800] uppercase tracking-[0.16em] text-[var(--ink-faint)] mb-2">Verification Status</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 border-[2px] border-green-400 bg-green-50">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="font-[800] text-[12px] uppercase tracking-wider text-green-700">Verified · Active</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="border-[2px] border-[var(--ink)] p-2">
                <img
                  src={qrUrl}
                  alt="Certificate QR code"
                  className="w-[110px] h-[110px] block"
                  loading="lazy"
                />
              </div>
              <div className="text-[9px] font-[700] uppercase tracking-wider text-[var(--ink-faint)] text-center">Scan to verify</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-12 py-5 border-t-[2px] border-[var(--line)] bg-[var(--paper-alt)] flex items-center justify-between gap-4 flex-wrap print:hidden">
          <div className="text-[11px] text-[var(--ink-faint)] font-[600]">
            {cert.visibility === 'link' ? '🔗 Shareable via link' : '🔒 Private — only you can view'}
            <span className="mx-2 opacity-40">·</span>
            Viewed {cert.viewCount} {cert.viewCount === 1 ? 'time' : 'times'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className={`px-4 py-2.5 border-[2px] font-[800] text-[11px] uppercase tracking-wider transition-all ${copied ? 'border-green-400 bg-green-50 text-green-700' : 'border-[var(--ink)] bg-[var(--ink)] text-white hover:bg-transparent hover:text-[var(--ink)]'}`}
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 border-[2px] border-[var(--line)] font-[800] text-[11px] uppercase tracking-wider text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-all"
            >
              🖨 Print / PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Visibility notice for owner */}
      {user?.id === cert.memberId && cert.visibility === 'private' && (
        <div className="max-w-[820px] mx-auto mt-4 px-5 py-3 border-[2px] border-amber-300 bg-amber-50 text-[12px] font-[600] text-amber-800 print:hidden">
          🔒 This certificate is set to <strong>Private</strong>. Only you can see it. Change visibility in your dashboard to share it.
        </div>
      )}
    </main>
  );
}
