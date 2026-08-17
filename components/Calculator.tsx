'use client';

import React, { useState } from 'react';
import { CalculationInputs, CalculationResult } from '@/lib/types';
import { formatIndianCurrency, formatCompactIndian } from '@/lib/calculations';
import { NumericKeypad } from './NumericKeypad';
import {
  Maximize2,
  TrendingUp,
  Percent,
  FileCheck,
  Wrench,
  Car,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';

interface CalculatorProps {
  inputs: CalculationInputs;
  result: CalculationResult;
  onChange: (inputs: CalculationInputs) => void;
}

type ActiveField = 'carpetArea' | 'ratePerSqFt' | 'regLegalCharges' | 'customParking';

export const Calculator: React.FC<CalculatorProps> = ({
  inputs,
  result,
  onChange,
}) => {
  const [activeField, setActiveField] = useState<ActiveField | null>('carpetArea');
  const [showKeypad, setShowKeypad] = useState<boolean>(true);

  const updateInput = (key: keyof CalculationInputs, value: any) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  // Steppers for Carpet Area
  const stepCarpetArea = (delta: number) => {
    const current = Number(inputs.carpetArea) || 0;
    const next = Math.max(50, current + delta);
    updateInput('carpetArea', next);
  };

  // Steppers for Rate PSF
  const stepRate = (delta: number) => {
    const current = Number(inputs.ratePerSqFt) || 0;
    const next = Math.max(100, current + delta);
    updateInput('ratePerSqFt', next);
  };

  // Keypad Handlers
  const handleKeypadPress = (key: string) => {
    if (!activeField) return;

    let currentValStr = '';
    if (activeField === 'carpetArea') currentValStr = inputs.carpetArea ? inputs.carpetArea.toString() : '';
    if (activeField === 'ratePerSqFt') currentValStr = inputs.ratePerSqFt ? inputs.ratePerSqFt.toString() : '';
    if (activeField === 'regLegalCharges') currentValStr = inputs.regLegalCharges ? inputs.regLegalCharges.toString() : '';
    if (activeField === 'customParking') currentValStr = inputs.carParkingCustomAmount ? inputs.carParkingCustomAmount.toString() : '';

    const nextValStr = currentValStr + key;
    const num = Number(nextValStr);

    if (activeField === 'carpetArea') updateInput('carpetArea', num);
    if (activeField === 'ratePerSqFt') updateInput('ratePerSqFt', num);
    if (activeField === 'regLegalCharges') updateInput('regLegalCharges', num);
    if (activeField === 'customParking') updateInput('carParkingCustomAmount', num);
  };

  const handleKeypadBackspace = () => {
    if (!activeField) return;

    let currentValStr = '';
    if (activeField === 'carpetArea') currentValStr = inputs.carpetArea ? inputs.carpetArea.toString() : '';
    if (activeField === 'ratePerSqFt') currentValStr = inputs.ratePerSqFt ? inputs.ratePerSqFt.toString() : '';
    if (activeField === 'regLegalCharges') currentValStr = inputs.regLegalCharges ? inputs.regLegalCharges.toString() : '';
    if (activeField === 'customParking') currentValStr = inputs.carParkingCustomAmount ? inputs.carParkingCustomAmount.toString() : '';

    const nextValStr = currentValStr.slice(0, -1);
    const num = nextValStr === '' ? 0 : Number(nextValStr);

    if (activeField === 'carpetArea') updateInput('carpetArea', num);
    if (activeField === 'ratePerSqFt') updateInput('ratePerSqFt', num);
    if (activeField === 'regLegalCharges') updateInput('regLegalCharges', num);
    if (activeField === 'customParking') updateInput('carParkingCustomAmount', num);
  };

  const handleKeypadClear = () => {
    if (!activeField) return;
    if (activeField === 'carpetArea') updateInput('carpetArea', 0);
    if (activeField === 'ratePerSqFt') updateInput('ratePerSqFt', 0);
    if (activeField === 'regLegalCharges') updateInput('regLegalCharges', 0);
    if (activeField === 'customParking') updateInput('carParkingCustomAmount', 0);
  };

  const handleKeypadQuickAdd = (amount: number) => {
    if (!activeField) return;
    if (activeField === 'carpetArea') stepCarpetArea(amount);
    if (activeField === 'ratePerSqFt') stepRate(amount);
    if (activeField === 'regLegalCharges') updateInput('regLegalCharges', (inputs.regLegalCharges || 0) + amount);
    if (activeField === 'customParking') updateInput('carParkingCustomAmount', (inputs.carParkingCustomAmount || 0) + amount);
  };

  const handleNextField = () => {
    if (activeField === 'carpetArea') setActiveField('ratePerSqFt');
    else if (activeField === 'ratePerSqFt') setActiveField('regLegalCharges');
    else if (activeField === 'regLegalCharges') {
      if (inputs.useCustomParking) setActiveField('customParking');
      else setShowKeypad(false);
    } else {
      setShowKeypad(false);
    }
  };

  const getActiveFieldLabel = (): string => {
    if (activeField === 'carpetArea') return 'Carpet Area (sq.ft)';
    if (activeField === 'ratePerSqFt') return 'Rate per Sq.Ft (₹)';
    if (activeField === 'regLegalCharges') return 'Reg & Legal Charges (₹)';
    if (activeField === 'customParking') return 'Custom Parking Amount (₹)';
    return 'Select Field';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Primary Calculator Inputs Card */}
      <div className="card-section">
        <div className="section-header">
          <div className="section-title">
            <Maximize2 className="section-icon" size={18} />
            <span>Property Dimensions & Pricing</span>
          </div>
          <button
            className="chip-btn"
            style={{ fontSize: '10px' }}
            onClick={() => setShowKeypad(!showKeypad)}
          >
            {showKeypad ? 'Hide Keypad' : 'Show Keypad'}
          </button>
        </div>

        <div className="input-grid">
          {/* Carpet Area Input */}
          <div className="input-wrapper">
            <div className="input-label-row">
              <span className="input-label">Carpet Area</span>
              {activeField === 'carpetArea' && <span className="active-field-indicator">Active Keypad</span>}
            </div>

            <div
              className={`input-box ${activeField === 'carpetArea' ? 'focused' : ''}`}
              onClick={() => {
                setActiveField('carpetArea');
                setShowKeypad(true);
              }}
            >
              <input
                type="number"
                inputMode="numeric"
                className="input-field"
                value={inputs.carpetArea || ''}
                onChange={(e) => updateInput('carpetArea', Number(e.target.value) || 0)}
                placeholder="668"
              />
              <span className="input-suffix">sq.ft</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                <button
                  className="icon-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepCarpetArea(-10);
                  }}
                >
                  <Minus size={14} />
                </button>
                <button
                  className="icon-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepCarpetArea(10);
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Quick BHK Presets */}
            <div className="chips-row">
              <button
                className={`chip-btn ${inputs.carpetArea === 450 ? 'active' : ''}`}
                onClick={() => updateInput('carpetArea', 450)}
              >
                1 BHK (450)
              </button>
              <button
                className={`chip-btn ${inputs.carpetArea === 668 ? 'active' : ''}`}
                onClick={() => updateInput('carpetArea', 668)}
              >
                2 BHK (668)
              </button>
              <button
                className={`chip-btn ${inputs.carpetArea === 750 ? 'active' : ''}`}
                onClick={() => updateInput('carpetArea', 750)}
              >
                2 BHK (750)
              </button>
              <button
                className={`chip-btn ${inputs.carpetArea === 950 ? 'active' : ''}`}
                onClick={() => updateInput('carpetArea', 950)}
              >
                3 BHK (950)
              </button>
              <button
                className={`chip-btn ${inputs.carpetArea === 1450 ? 'active' : ''}`}
                onClick={() => updateInput('carpetArea', 1450)}
              >
                4 BHK (1450)
              </button>
            </div>
          </div>

          {/* Rate PSF Input */}
          <div className="input-wrapper">
            <div className="input-label-row">
              <span className="input-label">Rate Per Sq.Ft (PSF)</span>
              {activeField === 'ratePerSqFt' && <span className="active-field-indicator">Active Keypad</span>}
            </div>

            <div
              className={`input-box ${activeField === 'ratePerSqFt' ? 'focused' : ''}`}
              onClick={() => {
                setActiveField('ratePerSqFt');
                setShowKeypad(true);
              }}
            >
              <span className="input-prefix">₹</span>
              <input
                type="number"
                inputMode="numeric"
                className="input-field"
                value={inputs.ratePerSqFt || ''}
                onChange={(e) => updateInput('ratePerSqFt', Number(e.target.value) || 0)}
                placeholder="25,000"
              />
              <span className="input-suffix">/ sq.ft</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                <button
                  className="icon-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepRate(-500);
                  }}
                >
                  <Minus size={14} />
                </button>
                <button
                  className="icon-btn"
                  style={{ width: '28px', height: '28px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    stepRate(500);
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Quick Rate PSF Chips */}
            <div className="chips-row">
              <button
                className={`chip-btn ${inputs.ratePerSqFt === 18000 ? 'active' : ''}`}
                onClick={() => updateInput('ratePerSqFt', 18000)}
              >
                ₹18,000
              </button>
              <button
                className={`chip-btn ${inputs.ratePerSqFt === 22000 ? 'active' : ''}`}
                onClick={() => updateInput('ratePerSqFt', 22000)}
              >
                ₹22,000
              </button>
              <button
                className={`chip-btn ${inputs.ratePerSqFt === 25000 ? 'active' : ''}`}
                onClick={() => updateInput('ratePerSqFt', 25000)}
              >
                ₹25,000
              </button>
              <button
                className={`chip-btn ${inputs.ratePerSqFt === 30000 ? 'active' : ''}`}
                onClick={() => updateInput('ratePerSqFt', 30000)}
              >
                ₹30,000
              </button>
              <button
                className={`chip-btn ${inputs.ratePerSqFt === 35000 ? 'active' : ''}`}
                onClick={() => updateInput('ratePerSqFt', 35000)}
              >
                ₹35,000
              </button>
            </div>
          </div>
        </div>

        {/* Agreement Value (AGV) Calculated Banner */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Base Agreement Value (AGV)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginTop: '2px', fontWeight: 600 }}>
              {formatCompactIndian(result.agreementValue)}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
            {formatIndianCurrency(result.agreementValue)}
          </div>
        </div>
      </div>

      {/* Statutory Duties, Legal & Development Charges */}
      <div className="card-section">
        <div className="section-header">
          <div className="section-title">
            <Percent className="section-icon" size={18} />
            <span>Government Taxes & Statutory Duties</span>
          </div>
        </div>

        {/* GST Selector */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="input-label">GST Rate ({inputs.gstPercent}%)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#60a5fa' }}>
              {formatIndianCurrency(result.gstAmount)}
            </span>
          </div>
          <div className="chips-row">
            <button
              className={`chip-btn ${inputs.gstPercent === 12 ? 'active' : ''}`}
              onClick={() => updateInput('gstPercent', 12)}
            >
              12% (Standard / Sample)
            </button>
            <button
              className={`chip-btn ${inputs.gstPercent === 5 ? 'active' : ''}`}
              onClick={() => updateInput('gstPercent', 5)}
            >
              5% (Under Construction)
            </button>
            <button
              className={`chip-btn ${inputs.gstPercent === 1 ? 'active' : ''}`}
              onClick={() => updateInput('gstPercent', 1)}
            >
              1% (Affordable)
            </button>
            <button
              className={`chip-btn ${inputs.gstPercent === 0 ? 'active' : ''}`}
              onClick={() => updateInput('gstPercent', 0)}
            >
              0% (Ready OC / Resale)
            </button>
          </div>
        </div>

        {/* Stamp Duty Selector */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="input-label">Stamp Duty ({inputs.stampDutyPercent}%)</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#60a5fa' }}>
              {formatIndianCurrency(result.stampDutyAmount)}
            </span>
          </div>
          <div className="chips-row">
            <button
              className={`chip-btn ${inputs.stampDutyPercent === 6 ? 'active' : ''}`}
              onClick={() => updateInput('stampDutyPercent', 6)}
            >
              6% (Standard / Sample)
            </button>
            <button
              className={`chip-btn ${inputs.stampDutyPercent === 5 ? 'active' : ''}`}
              onClick={() => updateInput('stampDutyPercent', 5)}
            >
              5% (Female / Concession)
            </button>
            <button
              className={`chip-btn ${inputs.stampDutyPercent === 7 ? 'active' : ''}`}
              onClick={() => updateInput('stampDutyPercent', 7)}
            >
              7% (Metro Cess Zone)
            </button>
          </div>
        </div>

        {/* Registration & Legal Charges */}
        <div style={{ marginBottom: '14px' }}>
          <div className="input-label-row">
            <span className="input-label">Registration & Legal Charges</span>
            {activeField === 'regLegalCharges' && <span className="active-field-indicator">Active Keypad</span>}
          </div>
          <div
            className={`input-box ${activeField === 'regLegalCharges' ? 'focused' : ''}`}
            style={{ height: '46px', marginTop: '6px' }}
            onClick={() => {
              setActiveField('regLegalCharges');
              setShowKeypad(true);
            }}
          >
            <span className="input-prefix">₹</span>
            <input
              type="number"
              className="input-field"
              value={inputs.regLegalCharges || ''}
              onChange={(e) => updateInput('regLegalCharges', Number(e.target.value) || 0)}
              placeholder="50,000"
            />
          </div>
          <div className="chips-row">
            <button
              className={`chip-btn ${inputs.regLegalCharges === 50000 ? 'active' : ''}`}
              onClick={() => updateInput('regLegalCharges', 50000)}
            >
              ₹50,000 (Default)
            </button>
            <button
              className={`chip-btn ${inputs.regLegalCharges === 30000 ? 'active' : ''}`}
              onClick={() => updateInput('regLegalCharges', 30000)}
            >
              ₹30,000
            </button>
            <button
              className={`chip-btn ${inputs.regLegalCharges === 75000 ? 'active' : ''}`}
              onClick={() => updateInput('regLegalCharges', 75000)}
            >
              ₹75,000
            </button>
            <button
              className={`chip-btn ${inputs.regLegalCharges === 100000 ? 'active' : ''}`}
              onClick={() => updateInput('regLegalCharges', 100000)}
            >
              ₹1,00,000
            </button>
          </div>
        </div>

        {/* Development Charges (Automated by rule) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="input-label">Development Charges (Automated)</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {formatIndianCurrency(result.devChargesAmount)}
            </span>
          </div>

          <div className={`rule-pill ${inputs.carpetArea < inputs.devChargesThreshold ? '' : 'rule-pill-warning'}`}>
            <Sparkles size={14} style={{ flexShrink: 0 }} />
            <span>
              <strong>Rule:</strong>{' '}
              {inputs.carpetArea < inputs.devChargesThreshold
                ? `Carpet Area (${inputs.carpetArea} sq.ft) < ${inputs.devChargesThreshold} sq.ft ➔ Fixed ${formatIndianCurrency(inputs.devChargesFlatRate)}`
                : `Carpet Area (${inputs.carpetArea} sq.ft) ≥ ${inputs.devChargesThreshold} sq.ft ➔ ₹${inputs.devChargesPsfRate}/sq.ft (${formatIndianCurrency(result.devChargesAmount)})`}
            </span>
          </div>
        </div>
      </div>

      {/* Car Parking & Amenities */}
      <div className="card-section">
        <div className="section-header">
          <div className="section-title">
            <Car className="section-icon" size={18} />
            <span>Car Parking</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>
            {formatIndianCurrency(result.carParkingAmount)}
          </span>
        </div>

        <div className="chips-row" style={{ marginBottom: '12px' }}>
          <button
            className={`chip-btn ${!inputs.useCustomParking && inputs.carParkingSlots === 1 ? 'active' : ''}`}
            onClick={() => {
              updateInput('useCustomParking', false);
              updateInput('carParkingSlots', 1);
            }}
          >
            1 Car Slot (₹12L)
          </button>
          <button
            className={`chip-btn ${!inputs.useCustomParking && inputs.carParkingSlots === 2 ? 'active' : ''}`}
            onClick={() => {
              updateInput('useCustomParking', false);
              updateInput('carParkingSlots', 2);
            }}
          >
            2 Car Slots (₹24L)
          </button>
          <button
            className={`chip-btn ${!inputs.useCustomParking && inputs.carParkingSlots === 0 ? 'active' : ''}`}
            onClick={() => {
              updateInput('useCustomParking', false);
              updateInput('carParkingSlots', 0);
            }}
          >
            No Parking (₹0)
          </button>
          <button
            className={`chip-btn ${inputs.useCustomParking ? 'active' : ''}`}
            onClick={() => {
              updateInput('useCustomParking', true);
              setActiveField('customParking');
              setShowKeypad(true);
            }}
          >
            Custom Amount
          </button>
        </div>

        {inputs.useCustomParking && (
          <div className="input-wrapper">
            <div className="input-label-row">
              <span className="input-label">Custom Parking Cost</span>
              {activeField === 'customParking' && <span className="active-field-indicator">Active Keypad</span>}
            </div>
            <div
              className={`input-box ${activeField === 'customParking' ? 'focused' : ''}`}
              style={{ height: '46px', marginTop: '6px' }}
              onClick={() => {
                setActiveField('customParking');
                setShowKeypad(true);
              }}
            >
              <span className="input-prefix">₹</span>
              <input
                type="number"
                className="input-field"
                value={inputs.carParkingCustomAmount ?? ''}
                onChange={(e) => updateInput('carParkingCustomAmount', Number(e.target.value) || 0)}
                placeholder="12,00,000"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tactile Mobile Keypad */}
      {showKeypad && (
        <NumericKeypad
          activeFieldLabel={getActiveFieldLabel()}
          onKeyPress={handleKeypadPress}
          onBackspace={handleKeypadBackspace}
          onClear={handleKeypadClear}
          onQuickAdd={handleKeypadQuickAdd}
          onClose={() => setShowKeypad(false)}
          onNextField={handleNextField}
        />
      )}
    </div>
  );
};
