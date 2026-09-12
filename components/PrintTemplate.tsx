'use client';

import React, { useState, useEffect } from 'react';
import { CalculationInputs, CalculationResult, SheetalCostBreakdown, SheetalPaymentScheme } from '@/lib/types';
import { formatIndianCurrency, SHEETAL_SANGAM_UNITS, calculateSheetalCost } from '@/lib/calculations';

interface PrintTemplateProps {
  mode: 'custom' | 'sheetal_sangam';
  customInputs?: CalculationInputs;
  customResult?: CalculationResult;
  sheetalScheme?: SheetalPaymentScheme;
  projectName?: string;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({
  mode,
  customInputs,
  customResult,
  sheetalScheme = 'CLP',
}) => {
  const [formattedDateTime, setFormattedDateTime] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const dt = `${now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
    setFormattedDateTime(dt);
  }, []);

  if (mode === 'sheetal_sangam') {
    const unitCalcs: Record<number, SheetalCostBreakdown> = {
      585: calculateSheetalCost(585, sheetalScheme),
      690: calculateSheetalCost(690, sheetalScheme),
      710: calculateSheetalCost(710, sheetalScheme),
    };

    return (
      <div className="print-only-container">
        {/* Cost Sheet Title + Date & Time ONLY */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingBottom: '8px',
            marginBottom: '10px',
            borderBottom: '2px solid #000000',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              color: '#000000',
            }}
          >
            COST SHEET
          </div>
          <div
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#000000',
            }}
          >
            {formattedDateTime}
          </div>
        </div>

        {/* Clean Matrix Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            border: '2px solid #000000',
          }}
        >
          <thead>
            <tr style={{ background: '#ffffff', color: '#000000', borderBottom: '1.5px solid #000000' }}>
              <th style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 800, border: '1px solid #000000' }}>
                CARPET AREA
              </th>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <th key={u.id} style={{ padding: '8px', textAlign: 'right', fontSize: '13px', fontWeight: 800, border: '1px solid #000000' }}>
                  {u.carpetArea} sq.ft
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, border: '1px solid #000000' }}>RATE</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', fontWeight: 700, border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].ratePerSqFt)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>AGREEMENT VALUE</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', fontWeight: 800, border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].agreementValue)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>STAMP DUTY (6%)</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].stampDutyAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>REGISTRATION</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].registrationAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>LEGAL CHARGES</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].legalChargesAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>GST 5%</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].gstAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>CAR PARKING</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].carParkingAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1.5px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>DEVELOPMENT CHARGES</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].devChargesAmount)}
                </td>
              ))}
            </tr>

            {/* Total Row */}
            <tr style={{ borderBottom: '2px solid #000000', fontWeight: 900 }}>
              <td style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 900, border: '1.5px solid #000000' }}>
                TOTAL
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '10px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 900, border: '1.5px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].grandTotal)}
                </td>
              ))}
            </tr>

            {/* Payment Schedule Headers */}
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>
                PAYMENT SCHEDULE
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>
                  GST 5%
                </td>
              ))}
            </tr>

            {/* 10% NOW or 30% NOW */}
            <tr style={{ borderBottom: '1px solid #000000' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>
                {sheetalScheme === 'CLP' ? '10% NOW' : '30% NOW'}
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => {
                const c = unitCalcs[u.carpetArea];
                return (
                  <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                    <div><strong>{formatIndianCurrency(c.schedule.nowAmount)}</strong></div>
                    <div style={{ fontSize: '11px' }}>{formatIndianCurrency(c.schedule.nowGst)}</div>
                  </td>
                );
              })}
            </tr>

            {/* 70% ON POSSESSION (for 30:70 scheme) */}
            {sheetalScheme === '30_70' && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>
                  70% ON POSSESSION
                </td>
                {SHEETAL_SANGAM_UNITS.map((u) => {
                  const c = unitCalcs[u.carpetArea];
                  return (
                    <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #000000' }}>
                      <div><strong>{formatIndianCurrency(c.schedule.possessionAmount || 0)}</strong></div>
                      <div style={{ fontSize: '11px' }}>{formatIndianCurrency(c.schedule.possessionGst || 0)}</div>
                    </td>
                  );
                })}
              </tr>
            )}

            {/* REST AS PER CLP */}
            {sheetalScheme === 'CLP' && (
              <tr style={{ borderBottom: '1px solid #000000' }}>
                <td colSpan={4} style={{ padding: '10px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '13px', border: '1px solid #000000' }}>
                  REST AS PER CLP
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Custom Cost Sheet Print Template
  if (!customResult || !customInputs) return null;

  return (
    <div className="print-only-container">
      {/* Cost Sheet Title + Date & Time ONLY */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingBottom: '8px',
          marginBottom: '10px',
          borderBottom: '2px solid #000000',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontWeight: 900,
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '-0.3px',
            color: '#000000',
          }}
        >
          COST SHEET
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#000000',
          }}
        >
          {formattedDateTime}
        </div>
      </div>

      {/* Pure Table ONLY */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          border: '2px solid #000000',
        }}
      >
        <tbody>
          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, border: '1px solid #000000' }}>
              CARPET AREA
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, border: '1px solid #000000' }}>
              {customResult.carpetArea} sq.ft
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 700, border: '1px solid #000000' }}>
              RATE (PSF)
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.ratePerSqFt)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #000000' }}>
              A G V
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.agreementValue)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>
              GST {customResult.gstPercent}%
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.gstAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>
              STAMP DUTY {customResult.stampDutyPercent}%
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.stampDutyAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>
              REG &amp; LEGAL CHARGES
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.regLegalCharges)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>
              DEVELOPMENT CHARGES
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.devChargesAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1.5px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #000000' }}>
              CAR PARKING
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #000000' }}>
              {formatIndianCurrency(customResult.carParkingAmount)}
            </td>
          </tr>

          {/* Total */}
          <tr style={{ borderBottom: '2px solid #000000', fontWeight: 900 }}>
            <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 900, border: '1.5px solid #000000' }}>
              TOTAL
            </td>
            <td style={{ padding: '12px', textAlign: 'right', fontSize: '16px', fontWeight: 900, border: '1.5px solid #000000' }}>
              {formatIndianCurrency(customResult.grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

