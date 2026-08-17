'use client';

import React from 'react';
import { CalculationInputs, CalculationResult } from '@/lib/types';
import { formatIndianCurrency, formatCompactIndian } from '@/lib/calculations';
import { ChevronRight } from 'lucide-react';

interface TableCalculatorProps {
  inputs: CalculationInputs;
  result: CalculationResult;
  onChange: (inputs: CalculationInputs) => void;
  activeField: string | null;
  onSelectField: (field: string) => void;
  onOpenLadderPage?: () => void;
}

export const TableCalculator: React.FC<TableCalculatorProps> = ({
  inputs,
  result,
  onChange,
  activeField,
  onSelectField,
  onOpenLadderPage,
}) => {
  const updateInput = (key: keyof CalculationInputs, value: any) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  const handleCarpetChange = (val: string) => {
    const num = Number(val.replace(/[^0-9]/g, '')) || 0;
    updateInput('carpetArea', num);
  };

  const handleRateChange = (val: string) => {
    const num = Number(val.replace(/[^0-9]/g, '')) || 0;
    updateInput('ratePerSqFt', num);
  };

  const handleLegalChange = (val: string) => {
    const num = Number(val.replace(/[^0-9]/g, '')) || 0;
    updateInput('regLegalCharges', num);
  };

  const handleParkingChange = (val: string) => {
    const num = Number(val.replace(/[^0-9]/g, '')) || 0;
    updateInput('useCustomParking', true);
    updateInput('carParkingCustomAmount', num);
  };

  const handleBrokerageChange = (val: string) => {
    const num = parseFloat(val) || 0;
    updateInput('brokeragePercent', num);
  };

  return (
    <div style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Primary Cost Sheet Table (Exact Clean Match to Handwritten Note) */}
      <div className="sheet-card">
        {/* Sheet Header */}
        <div className="sheet-header">
          <span className="sheet-title">Agreement &amp; Cost Sheet</span>
          <span className="sheet-date">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Main Table */}
        <div className="cost-table">
          {/* Carpet Area Row */}
          <div
            className={`table-row ${activeField === 'carpetArea' ? 'active-row' : ''}`}
            onClick={() => onSelectField('carpetArea')}
          >
            <div className="row-label-col">
              <span>Carpet Area</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <input
                type="text"
                inputMode="numeric"
                className="table-input-pill"
                value={inputs.carpetArea || ''}
                onChange={(e) => handleCarpetChange(e.target.value)}
                onFocus={() => onSelectField('carpetArea')}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>sq.ft</span>
            </div>
          </div>

          {/* Rate PSF Row */}
          <div
            className={`table-row ${activeField === 'ratePerSqFt' ? 'active-row' : ''}`}
            onClick={() => onSelectField('ratePerSqFt')}
          >
            <div className="row-label-col">
              <span>Rate (PSF)</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹</span>
              <input
                type="text"
                inputMode="numeric"
                className="table-input-pill"
                style={{ width: '110px' }}
                value={inputs.ratePerSqFt ? inputs.ratePerSqFt.toLocaleString('en-IN') : ''}
                onChange={(e) => handleRateChange(e.target.value)}
                onFocus={() => onSelectField('ratePerSqFt')}
              />
            </div>
          </div>

          {/* Agreement Value (AGV) Row */}
          <div className="table-row" style={{ background: '#f8fafc' }}>
            <div className="row-label-col">
              <strong style={{ letterSpacing: '1px' }}>A G V</strong>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span className="row-calc-agv">{formatIndianCurrency(result.agreementValue)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="table-divider-subtle" />

          {/* GST Row (Clean without inline chips, configured in settings) */}
          <div className="table-row">
            <div className="row-label-col">
              <span>GST {inputs.gstPercent}%</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span className="row-calc-value">{formatIndianCurrency(result.gstAmount)}</span>
            </div>
          </div>

          {/* Stamp Duty Row (Clean without inline chips, configured in settings) */}
          <div className="table-row">
            <div className="row-label-col">
              <span>Stamp Duty {inputs.stampDutyPercent}%</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span className="row-calc-value">{formatIndianCurrency(result.stampDutyAmount)}</span>
            </div>
          </div>

          {/* Reg & Legal Charges Row */}
          <div
            className={`table-row ${activeField === 'regLegalCharges' ? 'active-row' : ''}`}
            onClick={() => onSelectField('regLegalCharges')}
          >
            <div className="row-label-col">
              <span>Reg &amp; Legal charges</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹</span>
              <input
                type="text"
                inputMode="numeric"
                className="table-input-pill"
                style={{ width: '100px' }}
                value={inputs.regLegalCharges ? inputs.regLegalCharges.toLocaleString('en-IN') : ''}
                onChange={(e) => handleLegalChange(e.target.value)}
                onFocus={() => onSelectField('regLegalCharges')}
              />
            </div>
          </div>

          {/* Development Charges Row (Auto Calculated by threshold) */}
          <div className="table-row">
            <div className="row-label-col">
              <div>
                <span>Development charges</span>
                <span className="row-subnote">
                  {inputs.carpetArea < inputs.devChargesThreshold
                    ? `Fixed (< ${inputs.devChargesThreshold} sq.ft)`
                    : `₹${inputs.devChargesPsfRate}/sq.ft (${inputs.carpetArea} sq.ft)`}
                </span>
              </div>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span className="row-calc-value">{formatIndianCurrency(result.devChargesAmount)}</span>
            </div>
          </div>

          {/* Car Parking Row */}
          <div
            className={`table-row ${activeField === 'carParking' ? 'active-row' : ''}`}
            onClick={() => onSelectField('carParking')}
          >
            <div className="row-label-col">
              <span>Car Parking</span>
            </div>
            <div className="row-dash-col">—</div>
            <div className="row-value-col">
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹</span>
              <input
                type="text"
                inputMode="numeric"
                className="table-input-pill"
                style={{ width: '120px' }}
                value={result.carParkingAmount ? result.carParkingAmount.toLocaleString('en-IN') : '0'}
                onChange={(e) => handleParkingChange(e.target.value)}
                onFocus={() => onSelectField('carParking')}
              />
            </div>
          </div>

          {/* Total Solid Divider */}
          <div className="table-divider-solid" />

          {/* Total Row */}
          <div className="total-row">
            <div className="total-label-text">Total</div>
            <div className="total-equal-sign">=</div>
            <div className="total-number-display">{formatIndianCurrency(result.grandTotal)}</div>
          </div>

          {/* Total in Words */}
          <div className="total-words-box" style={{ marginBottom: 0, borderBottom: 'none' }}>
            {result.amountInWords}
          </div>
        </div>
      </div>

      {/* Channel Partner (CP) Brokerage Section (Separate Card, strictly calculated on AGV) */}
      <div
        className="sheet-card"
        style={{
          border: '1.5px solid #0f172a',
          background: '#ffffff',
          boxShadow: 'var(--shadow-sheet)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)' }}>
              Channel Partner (CP) Brokerage
            </span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Commission calculated strictly on Agreement Value (AGV)
            </div>
          </div>

          {onOpenLadderPage && (
            <button
              className="rate-badge-btn active"
              style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}
              onClick={onOpenLadderPage}
            >
              <span>View Ladder</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* Brokerage Calculation Box */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-label)' }}>
                Base AGV: <strong>{formatIndianCurrency(result.agreementValue)}</strong>
              </span>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                (Calculated exclusively on AGV)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Rate:</span>
              <input
                type="number"
                step="0.1"
                style={{
                  width: '60px',
                  textAlign: 'right',
                  padding: '4px 6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  background: '#ffffff',
                }}
                value={inputs.brokeragePercent}
                onChange={(e) => updateInput('brokeragePercent', parseFloat(e.target.value) || 0)}
              />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>%</span>
            </div>
          </div>

          {/* Quick Brokerage Ladder Rate Chips */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            <button
              type="button"
              className={`rate-badge-btn ${inputs.brokeragePercent === 3.5 ? 'active' : ''}`}
              style={{ flex: 1, margin: 0, padding: '4px 2px', textAlign: 'center' }}
              onClick={() => updateInput('brokeragePercent', 3.5)}
            >
              3.5% (0-5k sqft)
            </button>
            <button
              type="button"
              className={`rate-badge-btn ${inputs.brokeragePercent === 4.0 ? 'active' : ''}`}
              style={{ flex: 1, margin: 0, padding: '4px 2px', textAlign: 'center' }}
              onClick={() => updateInput('brokeragePercent', 4.0)}
            >
              4.0% (5k-10k)
            </button>
            <button
              type="button"
              className={`rate-badge-btn ${inputs.brokeragePercent === 4.5 ? 'active' : ''}`}
              style={{ flex: 1, margin: 0, padding: '4px 2px', textAlign: 'center' }}
              onClick={() => updateInput('brokeragePercent', 4.5)}
            >
              4.5% (10k-15k)
            </button>
            <button
              type="button"
              className={`rate-badge-btn ${inputs.brokeragePercent === 5.0 ? 'active' : ''}`}
              style={{ flex: 1, margin: 0, padding: '4px 2px', textAlign: 'center' }}
              onClick={() => updateInput('brokeragePercent', 5.0)}
            >
              5.0% (15k+)
            </button>
          </div>

          {/* Brokerage Result Display */}
          <div
            style={{
              borderTop: '1px dashed var(--border-light)',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Total CP Brokerage Payout
              </div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                {result.brokerageInWords}
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '20px',
                fontWeight: 900,
                color: '#16a34a',
              }}
            >
              {formatIndianCurrency(result.brokerageAmount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
