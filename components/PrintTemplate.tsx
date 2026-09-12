'use client';

import React from 'react';
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
  projectName = 'Sheetal Sangam',
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (mode === 'sheetal_sangam') {
    const unitCalcs: Record<number, SheetalCostBreakdown> = {
      585: calculateSheetalCost(585, sheetalScheme),
      690: calculateSheetalCost(690, sheetalScheme),
      710: calculateSheetalCost(710, sheetalScheme),
    };

    return (
      <div className="print-only-container">
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#000000' }}>
                SHEETAL SANGAM
              </h1>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#333333', marginTop: '2px' }}>
                RESIDENTIAL COST SHEET ({sheetalScheme === 'CLP' ? 'CLP SCHEME @ ₹30,500/SQ.FT' : '30:70 SCHEME @ ₹32,500/SQ.FT'})
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#555555', fontFamily: 'var(--font-mono)' }}>
              <div>Date: {currentDate}</div>
              <div>Status: Official Quote</div>
            </div>
          </div>
        </div>

        {/* 3-Column Matrix Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            border: '1.5px solid #000000',
          }}
        >
          <thead>
            <tr style={{ background: '#000000', color: '#ffffff' }}>
              <th style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 800, border: '1px solid #000000' }}>
                COMPONENT
              </th>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <th key={u.id} style={{ padding: '10px 8px', textAlign: 'right', fontSize: '12px', fontWeight: 800, border: '1px solid #000000' }}>
                  {u.carpetArea} sq.ft ({u.bhkLabel})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, border: '1px solid #cccccc' }}>CARPET AREA</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, border: '1px solid #cccccc' }}>{u.carpetArea} sq.ft</td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600, border: '1px solid #cccccc' }}>RATE (PSF)</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].ratePerSqFt)}
                </td>
              ))}
            </tr>

            <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #cccccc' }}>AGREEMENT VALUE (AGV)</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '8px', textAlign: 'right', fontWeight: 800, border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].agreementValue)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>STAMP DUTY (6%)</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].stampDutyAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>REGISTRATION</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].registrationAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>LEGAL CHARGES</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].legalChargesAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>GST 5%</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].gstAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1px solid #cccccc' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>CAR PARKING</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].carParkingAmount)}
                </td>
              ))}
            </tr>

            <tr style={{ borderBottom: '1.5px solid #000000' }}>
              <td style={{ padding: '7px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', border: '1px solid #cccccc' }}>DEVELOPMENT CHARGES</td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '7px 8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].devChargesAmount)}
                </td>
              ))}
            </tr>

            {/* Total Row */}
            <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #000000' }}>
              <td style={{ padding: '10px 8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 900, border: '1.5px solid #000000' }}>
                TOTAL COST
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => (
                <td key={u.id} style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px', fontWeight: 900, border: '1.5px solid #000000' }}>
                  {formatIndianCurrency(unitCalcs[u.carpetArea].grandTotal)}
                </td>
              ))}
            </tr>

            {/* Payment Schedule */}
            <tr style={{ background: '#fafafa' }}>
              <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #cccccc' }}>
                {sheetalScheme === 'CLP' ? '10% NOW (BOOKING)' : '30% NOW (BOOKING)'}
              </td>
              {SHEETAL_SANGAM_UNITS.map((u) => {
                const c = unitCalcs[u.carpetArea];
                return (
                  <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                    <strong>{formatIndianCurrency(c.schedule.nowAmount)}</strong>
                    <div style={{ fontSize: '10px', color: '#555555' }}>+ 5% GST: {formatIndianCurrency(c.schedule.nowGst)}</div>
                  </td>
                );
              })}
            </tr>

            {sheetalScheme === '30_70' && (
              <tr style={{ background: '#fafafa' }}>
                <td style={{ padding: '8px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800, border: '1px solid #cccccc' }}>
                  70% ON POSSESSION
                </td>
                {SHEETAL_SANGAM_UNITS.map((u) => {
                  const c = unitCalcs[u.carpetArea];
                  return (
                    <td key={u.id} style={{ padding: '8px', textAlign: 'right', border: '1px solid #cccccc' }}>
                      <strong>{formatIndianCurrency(c.schedule.possessionAmount || 0)}</strong>
                      <div style={{ fontSize: '10px', color: '#555555' }}>+ 5% GST: {formatIndianCurrency(c.schedule.possessionGst || 0)}</div>
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Terms */}
        <div style={{ marginTop: '20px', fontSize: '11px', color: '#666666', borderTop: '1px solid #cccccc', paddingTop: '10px' }}>
          <div>* Note: Stamp Duty &amp; Registration charges are subject to prevailing government regulations at the time of registration.</div>
          <div>* GST is applicable on agreement value and milestones as per government norms.</div>
        </div>
      </div>
    );
  }

  // Custom Cost Sheet Template
  if (!customResult || !customInputs) return null;

  return (
    <div className="print-only-container">
      {/* Header */}
      <div style={{ borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>
              PROPERTY COST SHEET
            </h1>
            {projectName && (
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#333333', marginTop: '2px' }}>
                Project: {projectName}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#555555', fontFamily: 'var(--font-mono)' }}>
            <div>Date: {currentDate}</div>
            <div>Quotation ID: PC-{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          border: '1.5px solid #000000',
        }}
      >
        <thead>
          <tr style={{ background: '#000000', color: '#ffffff' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 800 }}>
              PARTICULARS
            </th>
            <th style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 800 }}>
              AMOUNT (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Carpet Area
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              {customResult.carpetArea} sq.ft
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Rate (PSF)
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>
              ₹ {customResult.ratePerSqFt.toLocaleString('en-IN')} / sq.ft
            </td>
          </tr>

          <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>
              Agreement Value (AGV)
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900 }}>
              {formatIndianCurrency(customResult.agreementValue)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              GST ({customResult.gstPercent}%)
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
              {formatIndianCurrency(customResult.gstAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              Stamp Duty ({customResult.stampDutyPercent}%)
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
              {formatIndianCurrency(customResult.stampDutyAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              Registration &amp; Legal Charges
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
              {formatIndianCurrency(customResult.regLegalCharges)}
            </td>
          </tr>

          <tr style={{ borderBottom: '1px solid #cccccc' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              Development Charges ({customResult.devChargesRuleApplied})
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
              {formatIndianCurrency(customResult.devChargesAmount)}
            </td>
          </tr>

          <tr style={{ borderBottom: '2px solid #000000' }}>
            <td style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
              Car Parking
            </td>
            <td style={{ padding: '8px 12px', textAlign: 'right' }}>
              {formatIndianCurrency(customResult.carParkingAmount)}
            </td>
          </tr>

          {/* Total */}
          <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #000000' }}>
            <td style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 900 }}>
              TOTAL COST
            </td>
            <td style={{ padding: '12px', textAlign: 'right', fontSize: '16px', fontWeight: 900 }}>
              {formatIndianCurrency(customResult.grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Amount in words */}
      <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fafafa', border: '1px solid #e0e0e0', fontSize: '12px', fontWeight: 600 }}>
        Amount in Words: {customResult.amountInWords}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', fontSize: '11px', color: '#666666', borderTop: '1px solid #cccccc', paddingTop: '10px' }}>
        <div>* Rates and statutory government levies are subject to change as per government notification.</div>
        <div>* Cheque / Demand Draft to be drawn in favor of the developer's designated escrow account.</div>
      </div>
    </div>
  );
};
