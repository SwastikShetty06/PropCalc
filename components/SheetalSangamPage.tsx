'use client';

import React, { useState } from 'react';
import {
  SHEETAL_SANGAM_UNITS,
  calculateSheetalCost,
  formatIndianCurrency,
  formatCompactIndian,
} from '@/lib/calculations';
import { SheetalPaymentScheme, SheetalCostBreakdown, CalculationInputs } from '@/lib/types';
import { Building, Sparkles, SlidersHorizontal, CheckCircle2, Share2, Copy, Check, Send, Printer } from 'lucide-react';

interface SheetalSangamPageProps {
  onLoadIntoCustomCalculator: (inputs: CalculationInputs, projectName: string) => void;
  onOpenShareModal: (customText: string) => void;
}

export const SheetalSangamPage: React.FC<SheetalSangamPageProps> = ({
  onLoadIntoCustomCalculator,
  onOpenShareModal,
}) => {
  const [scheme, setScheme] = useState<SheetalPaymentScheme>('CLP');
  const [selectedUnitArea, setSelectedUnitArea] = useState<number>(585);
  
  // Custom adjustments state
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<number>(scheme === 'CLP' ? 30500 : 32500);
  const [customParking, setCustomParking] = useState<number>(1200000);
  const [customDevCharges, setCustomDevCharges] = useState<number>(555000);
  const [brokeragePercent, setBrokeragePercent] = useState<number>(3.5);
  const [brokerageGstPercent, setBrokerageGstPercent] = useState<number>(18);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Sync custom rate on scheme switch if not explicitly modified
  const handleSchemeChange = (newScheme: SheetalPaymentScheme) => {
    setScheme(newScheme);
    if (!isCustomizing) {
      setCustomRate(newScheme === 'CLP' ? 30500 : 32500);
    }
  };

  // Pre-calculated default units for comparison matrix
  const unitCalculations: Record<number, SheetalCostBreakdown> = {
    585: calculateSheetalCost(585, scheme, isCustomizing ? customRate : undefined, customParking, customDevCharges, brokeragePercent, brokerageGstPercent),
    690: calculateSheetalCost(690, scheme, isCustomizing ? customRate : undefined, customParking, customDevCharges, brokeragePercent, brokerageGstPercent),
    710: calculateSheetalCost(710, scheme, isCustomizing ? customRate : undefined, customParking, customDevCharges, brokeragePercent, brokerageGstPercent),
  };

  const activeCalculation = unitCalculations[selectedUnitArea] || unitCalculations[585];

  const generateWhatsAppShareText = (calc: SheetalCostBreakdown): string => {
    let text = `🏢 *SHEETAL SANGAM - RESIDENTIAL COST SHEET*\n`;
    text += `📐 *Carpet Area:* ${calc.carpetArea} sq.ft\n`;
    text += `🏷️ *Rate (PSF):* ₹${calc.ratePerSqFt.toLocaleString('en-IN')}/sq.ft\n`;
    text += `📋 *Payment Scheme:* ${calc.scheme === 'CLP' ? 'Construction Linked Plan (CLP)' : '30:70 Possession Scheme'}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *Agreement Value (AGV):* ${formatIndianCurrency(calc.agreementValue)}\n`;
    text += `▪️ *Stamp Duty (6%):* ${formatIndianCurrency(calc.stampDutyAmount)}\n`;
    text += `▪️ *Registration:* ${formatIndianCurrency(calc.registrationAmount)}\n`;
    text += `▪️ *Legal Charges:* ${formatIndianCurrency(calc.legalChargesAmount)}\n`;
    text += `▪️ *GST (5%):* ${formatIndianCurrency(calc.gstAmount)}\n`;
    text += `▪️ *Car Parking:* ${formatIndianCurrency(calc.carParkingAmount)}\n`;
    text += `▪️ *Development Charges:* ${formatIndianCurrency(calc.devChargesAmount)}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🏆 *TOTAL COST:* ${formatIndianCurrency(calc.grandTotal)}\n`;
    text += `🗣️ *In Words:* ${calc.amountInWords}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💳 *PAYMENT SCHEDULE:*\n`;
    if (calc.scheme === 'CLP') {
      text += `• 10% NOW: ${formatIndianCurrency(calc.schedule.nowAmount)} + GST 5%: ${formatIndianCurrency(calc.schedule.nowGst)} = *${formatIndianCurrency(calc.schedule.nowTotal)}*\n`;
      text += `• REST AS PER CLP MILESTONES\n`;
    } else {
      text += `• 30% NOW: ${formatIndianCurrency(calc.schedule.nowAmount)} + GST 5%: ${formatIndianCurrency(calc.schedule.nowGst)} = *${formatIndianCurrency(calc.schedule.nowTotal)}*\n`;
      text += `• 70% ON POSSESSION: ${formatIndianCurrency(calc.schedule.possessionAmount || 0)} + GST 5%: ${formatIndianCurrency(calc.schedule.possessionGst || 0)} = *${formatIndianCurrency(calc.schedule.possessionTotal || 0)}*\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🤝 *CP BROKERAGE SUMMARY:*\n`;
    text += `• Base Brokerage (${calc.brokeragePercent}% on AGV): ${formatIndianCurrency(calc.brokerageAmount)}\n`;
    text += `• GST on Brokerage (${calc.brokerageGstPercent}%): ${formatIndianCurrency(calc.brokerageGstAmount)}\n`;
    text += `• *Total Brokerage Payout:* ${formatIndianCurrency(calc.brokerageTotalPayout)}\n`;
    text += `_Generated via PropCalc App_`;
    return text;
  };

  const handleShareUnit = (calc: SheetalCostBreakdown) => {
    const text = generateWhatsAppShareText(calc);
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyText = (calc: SheetalCostBreakdown, key: string) => {
    const text = generateWhatsAppShareText(calc);
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCustomizeInMainCalculator = (calc: SheetalCostBreakdown) => {
    const inputs: CalculationInputs = {
      carpetArea: calc.carpetArea,
      ratePerSqFt: calc.ratePerSqFt,
      gstPercent: 5,
      stampDutyPercent: 6,
      regCharges: 30000,
      legalCharges: 20000,
      regLegalCharges: 50000,
      carParkingSlots: 1,
      carParkingCostPerSlot: calc.carParkingAmount,
      carParkingCustomAmount: calc.carParkingAmount,
      useCustomParking: true,
      devChargesThreshold: 700,
      devChargesFlatRate: calc.devChargesAmount,
      devChargesPsfRate: 800,
      brokeragePercent: calc.brokeragePercent,
      brokerageGstPercent: calc.brokerageGstPercent,
      cumulativeSoldSqFt: calc.carpetArea,
    };
    onLoadIntoCustomCalculator(inputs, 'Sheetal Sangam');
  };

  return (
    <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Project Banner Card */}
      <div
        className="sheet-card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '20px 18px',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '1px' }}>
              Residential Project
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', marginTop: '2px', color: '#ffffff' }}>
              Sheetal Sangam
            </h2>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
              Official Residential Cost Sheets, Payment Plans &amp; Configurations
            </p>
          </div>

          <button
            className="rate-badge-btn"
            style={{
              background: isCustomizing ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
              color: isCustomizing ? '#000000' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '6px 12px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontWeight: 700,
            }}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <SlidersHorizontal size={13} />
            <span>{isCustomizing ? 'Custom Mode ON' : 'Customize Rates'}</span>
          </button>
        </div>

        {/* Scheme Selector Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            className={`rate-badge-btn ${scheme === 'CLP' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '10px 12px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 800,
              background: scheme === 'CLP' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              color: scheme === 'CLP' ? '#0f172a' : '#cbd5e1',
              border: scheme === 'CLP' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
            }}
            onClick={() => handleSchemeChange('CLP')}
          >
            <div>CLP Scheme</div>
            <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85, marginTop: '2px' }}>
              Rate: ₹ 30,500 / sq.ft (10% Now)
            </div>
          </button>

          <button
            className={`rate-badge-btn ${scheme === '30_70' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '10px 12px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 800,
              background: scheme === '30_70' ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              color: scheme === '30_70' ? '#0f172a' : '#cbd5e1',
              border: scheme === '30_70' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
            }}
            onClick={() => handleSchemeChange('30_70')}
          >
            <div>30:70 Scheme</div>
            <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85, marginTop: '2px' }}>
              Rate: ₹ 32,500 / sq.ft (Possession Plan)
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Customizer Panel */}
      {isCustomizing && (
        <div
          className="sheet-card"
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', marginBottom: '8px' }}>
            Adjust Sheetal Sangam Default Parameters
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '2px' }}>
                Base Rate (PSF)
              </label>
              <input
                type="number"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fcd34d', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '2px' }}>
                Car Parking (₹)
              </label>
              <input
                type="number"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fcd34d', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}
                value={customParking}
                onChange={(e) => setCustomParking(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '2px' }}>
                CP Brokerage (%)
              </label>
              <input
                type="number"
                step="0.1"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fcd34d', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}
                value={brokeragePercent}
                onChange={(e) => setBrokeragePercent(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '2px' }}>
                GST on Brokerage (%)
              </label>
              <input
                type="number"
                step="1"
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fcd34d', background: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700 }}
                value={brokerageGstPercent}
                onChange={(e) => setBrokerageGstPercent(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Official 3-Column Cost Sheet Comparison Matrix (Matching PDF!) */}
      <div className="sheet-card" style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-main)' }}>
              COST SHEET ({scheme === 'CLP' ? 'CLP @ ₹30,500' : '30:70 @ ₹32,500'})
            </span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              All 3 configurations side-by-side as per official project sheet
            </div>
          </div>
          <button
            className="rate-badge-btn"
            style={{ fontSize: '11px' }}
            onClick={() => window.print()}
          >
            <Printer size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Print Sheet
          </button>
        </div>

        {/* Matrix Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            textAlign: 'right',
          }}
        >
          <thead>
            <tr style={{ background: '#0f172a', color: '#ffffff' }}>
              <th style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 800 }}>
                COMPONENT
              </th>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <th key={u.id} style={{ padding: '10px 8px', fontSize: '13px', fontWeight: 800 }}>
                  {u.carpetArea} sq.ft
                  <div style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8', fontFamily: 'var(--font-sans)' }}>
                    {u.bhkLabel}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* CARPET AREA */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                CARPET AREA
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', fontWeight: 700 }}>
                  {u.carpetArea}
                </td>
              ))}
            </tr>

            {/* RATE */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                RATE
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', fontWeight: 700 }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].ratePerSqFt)}
                </td>
              ))}
            </tr>

            {/* AGREEMENT VALUE */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', background: '#f8fafc' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--text-main)' }}>
                AGREEMENT VALUE
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', fontWeight: 800, color: '#0f172a' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].agreementValue)}
                </td>
              ))}
            </tr>

            {/* STAMP DUTY (6%) */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                STAMP DUTY (6%)
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].stampDutyAmount)}
                </td>
              ))}
            </tr>

            {/* REGISTRATION */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                REGISTRATION
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].registrationAmount)}
                </td>
              ))}
            </tr>

            {/* LEGAL CHARGES */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                LEGAL CHARGES
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].legalChargesAmount)}
                </td>
              ))}
            </tr>

            {/* GST 5% */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                GST 5%
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].gstAmount)}
                </td>
              ))}
            </tr>

            {/* CAR PARKING */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                CAR PARKING
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].carParkingAmount)}
                </td>
              ))}
            </tr>

            {/* DEVELOPMENT CHARGES */}
            <tr style={{ borderBottom: '2px solid #0f172a' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-label)' }}>
                DEVELOPMENT CHARGES
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].devChargesAmount)}
                </td>
              ))}
            </tr>

            {/* TOTAL ROW */}
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #0f172a' }}>
              <td style={{ padding: '12px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>
                TOTAL
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>
                  {formatIndianCurrency(unitCalculations[u.carpetArea].grandTotal)}
                </td>
              ))}
            </tr>

            {/* PAYMENT SCHEDULE SECTION HEADER */}
            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid var(--border-light)' }}>
              <td colSpan={4} style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#334155' }}>
                PAYMENT SCHEDULE &amp; GST BREAKDOWN
              </td>
            </tr>

            {/* PAYMENT SCHEDULE ROW (10% NOW or 30% NOW) */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#16a34a' }}>
                {scheme === 'CLP' ? '10% NOW' : '30% NOW'}
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => {
                const c = unitCalculations[u.carpetArea];
                return (
                  <td key={u.id} style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#15803d' }}>
                      {formatIndianCurrency(c.schedule.nowAmount)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      + GST 5%: {formatIndianCurrency(c.schedule.nowGst)}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 70% ON POSSESSION (for 30:70 scheme) */}
            {scheme === '30_70' && (
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#2563eb' }}>
                  70% ON POSSESSION
                </td>
                {SHEETAL_SANGAM_UNITS.map((u) => {
                  const c = unitCalculations[u.carpetArea];
                  return (
                    <td key={u.id} style={{ padding: '8px' }}>
                      <div style={{ fontWeight: 700, color: '#1d4ed8' }}>
                        {formatIndianCurrency(c.schedule.possessionAmount || 0)}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        + GST 5%: {formatIndianCurrency(c.schedule.possessionGst || 0)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* REST AS PER CLP (for CLP scheme) */}
            {scheme === 'CLP' && (
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--text-muted)' }}>
                  REST
                </td>
                <td colSpan={3} style={{ padding: '8px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '12px' }}>
                  REST AS PER CONSTRUCTION LINKED PLAN (CLP)
                </td>
              </tr>
            )}

            {/* CP BROKERAGE SECTION WITH 18% GST */}
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#d97706' }}>
                CP BROKERAGE ({brokeragePercent}%)
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  + 18% GST on Invoice
                </div>
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => {
                const c = unitCalculations[u.carpetArea];
                return (
                  <td key={u.id} style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#d97706' }}>
                      {formatIndianCurrency(c.brokerageTotalPayout)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Base: {formatIndianCurrency(c.brokerageAmount)} + GST: {formatIndianCurrency(c.brokerageGstAmount)}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ACTIONS ROW */}
            <tr>
              <td style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '12px' }}>
                QUICK ACTIONS
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => {
                const c = unitCalculations[u.carpetArea];
                return (
                  <td key={u.id} style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button
                        className="rate-badge-btn"
                        style={{ margin: 0, padding: '4px 6px', background: '#16a34a', color: '#ffffff', border: 'none' }}
                        onClick={() => handleShareUnit(c)}
                        title="Send via WhatsApp"
                      >
                        <Send size={11} />
                      </button>
                      <button
                        className="rate-badge-btn"
                        style={{ margin: 0, padding: '4px 6px' }}
                        onClick={() => handleCopyText(c, u.id)}
                        title="Copy Quote Text"
                      >
                        {copiedIndex === u.id ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                      </button>
                      <button
                        className="rate-badge-btn active"
                        style={{ margin: 0, padding: '4px 6px', fontSize: '10px' }}
                        onClick={() => handleCustomizeInMainCalculator(c)}
                        title="Edit in Main Calculator"
                      >
                        Customize
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
