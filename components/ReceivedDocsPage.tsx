'use client';

import React, { useState } from 'react';
import { ReceivedDocument } from '@/lib/types';
import { DEFAULT_RECEIVED_DOCUMENTS } from '@/lib/storage';
import { FileCheck, ShieldCheck, CheckCircle2, Clock, FileText, Info } from 'lucide-react';

interface ReceivedDocsPageProps {
  documents?: ReceivedDocument[];
}

export const ReceivedDocsPage: React.FC<ReceivedDocsPageProps> = ({
  documents = DEFAULT_RECEIVED_DOCUMENTS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = documents.filter((doc) => {
    if (selectedCategory === 'all') return true;
    return doc.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="sheet-card" style={{ padding: '20px' }}>
      <div className="sheet-header">
        <div>
          <span className="sheet-title">Project Legal Documents</span>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            List of title documents, clearances &amp; approvals on record
          </div>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#16a34a',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          {documents.length} Available
        </span>
      </div>

      {/* Category Chips */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          className={`rate-badge-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          style={{ margin: 0, padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setSelectedCategory('all')}
        >
          All ({documents.length})
        </button>
        <button
          className={`rate-badge-btn ${selectedCategory === 'legal' ? 'active' : ''}`}
          style={{ margin: 0, padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setSelectedCategory('legal')}
        >
          Legal
        </button>
        <button
          className={`rate-badge-btn ${selectedCategory === 'statutory' ? 'active' : ''}`}
          style={{ margin: 0, padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setSelectedCategory('statutory')}
        >
          Statutory
        </button>
        <button
          className={`rate-badge-btn ${selectedCategory === 'authority' ? 'active' : ''}`}
          style={{ margin: 0, padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setSelectedCategory('authority')}
        >
          Authority
        </button>
      </div>

      {/* Document Records */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {doc.title}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                    color: '#475569',
                  }}
                >
                  {doc.codeName}
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#15803d',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={12} />
                {doc.status}
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {doc.description}
            </p>

            {doc.notes && (
              <div
                style={{
                  marginTop: '4px',
                  fontSize: '11px',
                  color: '#1e293b',
                  background: '#f8fafc',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  borderLeft: '3px solid #0f172a',
                }}
              >
                <strong>Status Note:</strong> {doc.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Clear Title Notice */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <ShieldCheck size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
          <strong>Clear Title Assured:</strong> All primary developer agreements, statutory NOCs, power of attorney, LOI, and IOD sanctions have been duly verified and are securely on record.
        </div>
      </div>
    </div>
  );
};
