'use client';

import React from 'react';
import { CalculationResult } from '@/lib/types';
import { formatIndianCurrency, formatCompactIndian } from '@/lib/calculations';
import { FileText, Layers, ShieldCheck, Wrench, Car, IndianRupee } from 'lucide-react';

interface CostBreakdownProps {
  result: CalculationResult;
}

const CATEGORY_COLORS: Record<string, string> = {
  base: '#10b981',        // Emerald
  tax: '#3b82f6',         // Blue
  statutory: '#8b5cf6',   // Purple
  development: '#f59e0b', // Amber
  amenity: '#06b6d4',     // Cyan
  other: '#ec4899',       // Pink
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  base: <IndianRupee size={16} color="#10b981" />,
  tax: <ShieldCheck size={16} color="#3b82f6" />,
  statutory: <FileText size={16} color="#8b5cf6" />,
  development: <Wrench size={16} color="#f59e0b" />,
  amenity: <Car size={16} color="#06b6d4" />,
  other: <Layers size={16} color="#ec4899" />,
};

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ result }) => {
  return (
    <div className="card-section">
      <div className="section-header">
        <div className="section-title">
          <Layers className="section-icon" size={18} />
          <span>Itemized Cost Sheet</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {result.carpetArea} sq.ft @ ₹{result.ratePerSqFt.toLocaleString('en-IN')}/sq.ft
        </span>
      </div>

      {/* Visual Cost Distribution Bar */}
      <div className="dist-bar-wrapper">
        <div className="dist-bar">
          {result.items.map((item) => (
            <div
              key={item.id}
              className="dist-segment"
              style={{
                width: `${item.percentageOfTotal}%`,
                backgroundColor: CATEGORY_COLORS[item.category] || '#64748b',
              }}
              title={`${item.label}: ${item.percentageOfTotal.toFixed(1)}%`}
            />
          ))}
        </div>

        <div className="dist-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: CATEGORY_COLORS.base }} />
            <span>AGV ({((result.agreementValue / result.grandTotal) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: CATEGORY_COLORS.tax }} />
            <span>Taxes ({(((result.gstAmount + result.stampDutyAmount) / result.grandTotal) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: CATEGORY_COLORS.development }} />
            <span>Dev ({((result.devChargesAmount / result.grandTotal) * 100 || 0).toFixed(0)}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: CATEGORY_COLORS.amenity }} />
            <span>Parking ({((result.carParkingAmount / result.grandTotal) * 100 || 0).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Itemized Rows */}
      <div className="breakdown-list" style={{ marginTop: '14px' }}>
        {result.items.map((item) => (
          <div key={item.id} className="breakdown-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg-card-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {CATEGORY_ICONS[item.category]}
              </div>
              <div className="breakdown-left">
                <div className="breakdown-label">{item.label}</div>
                {item.subLabel && <div className="breakdown-sublabel">{item.subLabel}</div>}
              </div>
            </div>

            <div className="breakdown-right">
              <div className="breakdown-amount">{formatIndianCurrency(item.amount)}</div>
              <div className="breakdown-pct">{item.percentageOfTotal.toFixed(1)}% of total</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grand Total Summary Box */}
      <div
        style={{
          marginTop: '16px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.04))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Final All-Inclusive Amount
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>
            {formatCompactIndian(result.grandTotal)}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
          {formatIndianCurrency(result.grandTotal)}
        </div>
      </div>
    </div>
  );
};
