'use client';

import React, { useState } from 'react';
import { SavedQuote, CalculationInputs, CalculationResult } from '@/lib/types';
import { getSavedQuotes, saveQuote, deleteSavedQuote } from '@/lib/storage';
import { formatIndianCurrency, formatCompactIndian } from '@/lib/calculations';
import { Bookmark, Trash2, Plus, X, Calendar } from 'lucide-react';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: CalculationInputs;
  currentResult: CalculationResult;
  onLoadQuote: (inputs: CalculationInputs, meta?: { projectName?: string; unitNumber?: string; clientName?: string }) => void;
}

export const SavedQuotesModal: React.FC<SavedQuotesModalProps> = ({
  isOpen,
  onClose,
  currentInputs,
  currentResult,
  onLoadQuote,
}) => {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [clientName, setClientName] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setQuotes(getSavedQuotes());
      setShowSaveForm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote: SavedQuote = {
      id: 'quote_' + Date.now(),
      projectName: projectName.trim() || 'Property Sheet',
      unitNumber: unitNumber.trim(),
      clientName: clientName.trim(),
      inputs: { ...currentInputs },
      result: { ...currentResult },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = saveQuote(newQuote);
    setQuotes(updated);
    setShowSaveForm(false);
    setProjectName('');
    setUnitNumber('');
    setClientName('');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSavedQuote(id);
    setQuotes(updated);
  };

  const handleSelect = (quote: SavedQuote) => {
    onLoadQuote(quote.inputs, {
      projectName: quote.projectName,
      unitNumber: quote.unitNumber,
      clientName: quote.clientName,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Saved Calculations ({quotes.length})</span>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {!showSaveForm ? (
          <button
            className="btn-main"
            style={{ width: '100%', marginBottom: '14px' }}
            onClick={() => setShowSaveForm(true)}
          >
            <Plus size={16} />
            <span>Save Current ({formatCompactIndian(currentResult.grandTotal)})</span>
          </button>
        ) : (
          <form
            onSubmit={handleSaveCurrent}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '13px',
                }}
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '13px',
                  }}
                  placeholder="Unit / Flat No"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                />
                <input
                  type="text"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '13px',
                  }}
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="submit" className="btn-main" style={{ flex: 1, padding: '8px' }}>
                Save
              </button>
              <button
                type="button"
                className="btn-sub"
                style={{ width: 'auto', padding: '8px 12px' }}
                onClick={() => setShowSaveForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {quotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            No saved quotes on this device yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quotes.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.projectName || 'Property Estimate'}
                    {item.unitNumber ? ` #${item.unitNumber}` : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.inputs.carpetArea} sq.ft @ ₹{item.inputs.ratePerSqFt.toLocaleString('en-IN')}
                    {item.clientName ? ` • ${item.clientName}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800 }}>
                    {formatCompactIndian(item.result.grandTotal)}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="btn-icon"
                    style={{ width: '26px', height: '26px' }}
                  >
                    <Trash2 size={13} color="#e11d48" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
