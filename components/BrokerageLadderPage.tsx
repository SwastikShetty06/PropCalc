'use client';

import React, { useState } from 'react';
import { CalculationInputs, CalculationResult } from '@/lib/types';
import { BROKERAGE_LADDER_TIERS, formatIndianCurrency, formatCompactIndian } from '@/lib/calculations';
import { TrendingUp, Award, ShieldCheck, Zap, ArrowUpRight, CheckCircle2, Building, DollarSign } from 'lucide-react';

interface BrokerageLadderPageProps {
  inputs: CalculationInputs;
  result: CalculationResult;
  onUpdateBrokerage: (percent: number) => void;
}

export const BrokerageLadderPage: React.FC<BrokerageLadderPageProps> = ({
  inputs,
  result,
  onUpdateBrokerage,
}) => {
  const [testArea, setTestArea] = useState<number>(inputs.cumulativeSoldSqFt || inputs.carpetArea);

  const calculateTierEarnings = (ratePsf: number, area: number, percent: number) => {
    const agv = area * ratePsf;
    return Math.round(agv * (percent / 100));
  };

  return (
    <div className="sheet-card" style={{ padding: '20px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-sm)',
          padding: '18px 16px',
          marginBottom: '18px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '1px', marginBottom: '4px' }}>
          Channel Partner Program
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '4px' }}>
          BOOST YOUR <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>Earnings</span>
        </h2>
        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
          Maximize your brokerage with every square foot sold. Earn up to 5.0% commission on Agreement Value (AGV).
        </p>

        <div
          style={{
            marginTop: '12px',
            padding: '8px 10px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Award size={14} color="#f59e0b" />
          <span>
            Current Unit AGV: <strong>{formatIndianCurrency(result.agreementValue)}</strong> (Brokerage applies only on AGV)
          </span>
        </div>
      </div>

      {/* Slabs Ladder Stepper */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)', marginBottom: '10px' }}>
          Commission Slabs Ladder
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {BROKERAGE_LADDER_TIERS.map((tier) => {
            const isSelected = inputs.brokeragePercent === tier.percent;
            const payoutForCurrentUnit = Math.round(result.agreementValue * (tier.percent / 100));

            return (
              <div
                key={tier.id}
                onClick={() => onUpdateBrokerage(tier.percent)}
                style={{
                  border: isSelected ? '2px solid #0f172a' : '1px solid var(--border-light)',
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '20px',
                      fontWeight: 900,
                      color: isSelected ? '#0f172a' : '#475569',
                      minWidth: '55px',
                    }}
                  >
                    {tier.percent.toFixed(1)}%
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {tier.rangeLabel}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {tier.description}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: isSelected ? '#16a34a' : '#0f172a' }}>
                    {formatIndianCurrency(payoutForCurrentUnit)}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Payout for this unit
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Partner With Us Banner (Directly from poster) */}
      <div
        style={{
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          background: '#ffffff',
          marginBottom: '14px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)', marginBottom: '12px', textAlign: 'center' }}>
          WHY PARTNER WITH US ?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>TIMELY PAYOUTS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>EXCLUSIVE PROJECTS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>TRANSPARENT TRACKING</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>PERSONALIZED SUPPORT</span>
          </div>
        </div>
      </div>

      {/* Terms footnote */}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
        *Terms &amp; conditions applicable. Brokerage is calculated exclusively on Agreement Value (AGV).
      </div>
    </div>
  );
};
