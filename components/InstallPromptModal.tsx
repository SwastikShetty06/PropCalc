'use client';

import React from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isIOS: boolean;
  canPromptNative: boolean;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  canPromptNative,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Smartphone className="section-icon" size={20} />
            <span>Install Offline App</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '8px 0 20px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff' }}>₹</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
            PropCalc Real Estate
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Use this property agreement calculator anytime, even without an internet connection.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>100% Offline calculations</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Instant launch from home screen</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Save quotes locally & share on WhatsApp</span>
          </div>
        </div>

        {isIOS ? (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#60a5fa', marginBottom: '8px' }}>
              How to install on iOS Safari:
            </h4>
            <ol style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                Tap the <strong>Share</strong> button <Share size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in Safari toolbar.
              </li>
              <li>
                Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} />.
              </li>
              <li>
                Tap <strong>&quot;Add&quot;</strong> in the top right corner.
              </li>
            </ol>
          </div>
        ) : canPromptNative ? (
          <button className="btn-primary" onClick={onInstall} style={{ marginBottom: '10px' }}>
            <Download size={18} />
            <span>Install App Now</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={onClose} style={{ marginBottom: '10px' }}>
            <span>Got It</span>
          </button>
        )}

        <button className="btn-secondary" onClick={onClose}>
          <span>Maybe Later</span>
        </button>
      </div>
    </div>
  );
};
