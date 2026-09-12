'use client';

import React from 'react';
import { CalculationInputs } from '@/lib/types';
import { formatIndianCurrency } from '@/lib/calculations';
import { Sliders, RotateCcw, X, Check } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculationInputs;
  onUpdateInputs: (updated: Partial<CalculationInputs>) => void;
  onResetDefaults: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  inputs,
  onUpdateInputs,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Settings &amp; Default Rates</span>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* GST % Input */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Property GST Percentage
                </label>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Default is 12% (5% for Sheetal Sangam)
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  step="0.1"
                  style={{ width: '70px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '14px', textAlign: 'right', fontWeight: 700 }}
                  value={inputs.gstPercent}
                  onChange={(e) => onUpdateInputs({ gstPercent: Number(e.target.value) || 0 })}
                />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>%</span>
              </div>
            </div>
          </div>

          {/* Stamp Duty % Input */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Stamp Duty Percentage
                </label>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Default is 6%
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  step="0.1"
                  style={{ width: '70px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '14px', textAlign: 'right', fontWeight: 700 }}
                  value={inputs.stampDutyPercent}
                  onChange={(e) => onUpdateInputs({ stampDutyPercent: Number(e.target.value) || 0 })}
                />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>%</span>
              </div>
            </div>
          </div>

          {/* GST on Brokerage % Input */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                  GST on Brokerage (Invoice)
                </label>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Standard is 18%
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="number"
                  step="1"
                  style={{ width: '70px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '14px', textAlign: 'right', fontWeight: 700 }}
                  value={inputs.brokerageGstPercent ?? 18}
                  onChange={(e) => onUpdateInputs({ brokerageGstPercent: Number(e.target.value) || 0 })}
                />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>%</span>
              </div>
            </div>
          </div>

          {/* Development Charges Rule */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Development Charges Rule
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
              Fixed flat amount below threshold, or rate per sq.ft when equal or above.
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Threshold (sq.ft)
                </label>
                <input
                  type="number"
                  style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                  value={inputs.devChargesThreshold}
                  onChange={(e) => onUpdateInputs({ devChargesThreshold: Number(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Rate if ≥ {inputs.devChargesThreshold} (₹/sqft)
                </label>
                <input
                  type="number"
                  style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                  value={inputs.devChargesPsfRate}
                  onChange={(e) => onUpdateInputs({ devChargesPsfRate: Number(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                Fixed Flat Amount if &lt; {inputs.devChargesThreshold} sq.ft (₹)
              </label>
              <input
                type="number"
                style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                value={inputs.devChargesFlatRate}
                onChange={(e) => onUpdateInputs({ devChargesFlatRate: Number(e.target.value) || 0 })}
              />
              <span style={{ fontSize: '11px', color: '#16a34a', marginTop: '3px', display: 'block', fontFamily: 'var(--font-mono)' }}>
                {formatIndianCurrency(inputs.devChargesFlatRate)}
              </span>
            </div>
          </div>

          {/* Legal Charges Default */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Default Reg &amp; Legal Charges (₹)
            </label>
            <input
              type="number"
              style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              value={inputs.regLegalCharges}
              onChange={(e) => onUpdateInputs({ regLegalCharges: Number(e.target.value) || 0 })}
            />
          </div>

          {/* Standard Car Parking Base */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Cost Per Parking Slot (₹)
            </label>
            <input
              type="number"
              style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '6px 8px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              value={inputs.carParkingCostPerSlot}
              onChange={(e) => onUpdateInputs({ carParkingCostPerSlot: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-main" style={{ flex: 1 }} onClick={onClose}>
            <Check size={16} />
            <span>Save Settings</span>
          </button>
          <button className="btn-sub" style={{ width: 'auto' }} onClick={onResetDefaults}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
