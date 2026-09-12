'use client';

import React, { useState } from 'react';
import {
  formatIndianCurrency,
  formatCompactIndian,
  calculateAll,
  calculateSheetalCost,
  DEFAULT_INPUTS,
} from '@/lib/calculations';
import { CalculationInputs } from '@/lib/types';
import {
  Terminal,
  Zap,
  Cpu,
  Layers,
  Check,
  Copy,
  ChevronRight,
  Shield,
  ArrowRight,
  Sparkles,
  Command,
  FileCode2,
  Share2,
  Sliders,
  ExternalLink,
  Code2,
  Box,
  Server,
  Lock,
  BarChart3,
  Flame,
} from 'lucide-react';

/* Hallmark · genre: modern-minimal · macrostructure: workbench · theme: cobalt · enrichment: live-interactive · nav: n5 · footer: ft2 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

interface SaaSProductLandingProps {
  onLaunchApp: () => void;
}

export const SaaSProductLanding: React.FC<SaaSProductLandingProps> = ({ onLaunchApp }) => {
  // Live Simulator state
  const [activeTab, setActiveTab] = useState<'calculator' | 'api' | 'cli'>('calculator');
  const [carpetArea, setCarpetArea] = useState<number>(690);
  const [ratePsf, setRatePsf] = useState<number>(30500);
  const [brokerageRate, setBrokerageRate] = useState<number>(3.5);
  const [copiedCode, setCopiedCode] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Compute live deal figures
  const agv = carpetArea * ratePsf;
  const gst = Math.round(agv * 0.05);
  const stampDuty = Math.round(agv * 0.06);
  const regLegal = 50000;
  const devCharges = carpetArea < 700 ? 555000 : Math.round(carpetArea * 800);
  const parking = 1200000;
  const grandTotal = agv + gst + stampDuty + regLegal + devCharges + parking;

  const baseBrokerage = Math.round(agv * (brokerageRate / 100));
  const brokerageGst = Math.round(baseBrokerage * 0.18);
  const totalBrokerage = baseBrokerage + brokerageGst;

  const apiSamplePayload = JSON.stringify(
    {
      project: 'Sheetal Sangam',
      unit: {
        carpetAreaSqFt: carpetArea,
        ratePsf: ratePsf,
      },
      breakdown: {
        agreementValue: agv,
        stampDuty: stampDuty,
        gst5Percent: gst,
        registrationAndLegal: regLegal,
        developmentCharges: devCharges,
        carParking: parking,
        grandTotal: grandTotal,
      },
      channelPartner: {
        ratePercent: brokerageRate,
        baseBrokerage: baseBrokerage,
        gst18Percent: brokerageGst,
        totalGrossPayout: totalBrokerage,
      },
    },
    null,
    2
  );

  const cliCommand = `curl -X POST https://api.propcalc.io/v1/quote \\
  -H "Authorization: Bearer prop_live_key" \\
  -d '{"area": ${carpetArea}, "rate": ${ratePsf}, "cpRate": ${brokerageRate}}'`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTab === 'api' ? apiSamplePayload : cliCommand);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', color: '#090d16' }}>
      {/* ── 1. Hero Section (Two-column Linear/Stripe modern-minimal style) ── */}
      <section style={{ paddingTop: '16px', paddingBottom: '36px' }}>
        {/* Release Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, color: '#1d4ed8', marginBottom: '18px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />
          <span>PROPCALC ENGINE v2.4 · 100% OFFLINE CAPABLE</span>
          <ChevronRight size={12} />
        </div>

        {/* Hero Title & Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, lineHeight: '1.08', letterSpacing: '-0.035em', color: '#090d16', marginBottom: '16px' }}>
              Financial modeling for real estate deals.
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '1.55', color: '#475569', fontWeight: 500, marginBottom: '24px', maxWidth: '480px' }}>
              Deterministic agreement values, statutory taxes, milestone payment plans, and Channel Partner gross payouts with 18% GST. Offline-first PWA and developer API.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                className="btn-main"
                style={{
                  background: '#090d16',
                  color: '#ffffff',
                  padding: '13px 22px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(9, 13, 22, 0.15)',
                }}
                onClick={onLaunchApp}
              >
                <span>Launch Interactive Sheet</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn-sub"
                style={{
                  padding: '13px 18px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                }}
                onClick={() => {
                  const el = document.getElementById('workbench-demo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Live Workbench</span>
              </button>
            </div>

            {/* Micro Feature Proof */}
            <div style={{ display: 'flex', gap: '18px', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                <Check size={14} color="#16a34a" />
                <span>Zero Latency Calculations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                <Check size={14} color="#16a34a" />
                <span>ServiceWorker Offline Cache</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Glance Box */}
          <div
            style={{
              background: '#090d16',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
              border: '1px solid #1e293b',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                SAMPLE DEAL BENCHMARK
              </div>
              <span style={{ fontSize: '11px', background: '#1e293b', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                690 sq.ft @ ₹30.5k
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Agreement Value (AGV)</div>
                <div style={{ fontSize: '19px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                  ₹ 2,10,45,000
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Grand Total Cost</div>
                <div style={{ fontSize: '19px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  ₹ 2,51,64,950
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>10% Booking Milestone</div>
                <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#4ade80' }}>
                  ₹ 21,04,500 <span style={{ fontSize: '10px', color: '#94a3b8' }}>+ GST</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>CP Brokerage (+18% GST)</div>
                <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                  ₹ 8,69,159 <span style={{ fontSize: '10px', color: '#94a3b8' }}>(3.5%)</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '10px 12px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Development Charges Rule Applied:</span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>Fixed Flat ₹5,55,000 (&lt; 700 sq.ft)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Interactive Workbench Section ── */}
      <section id="workbench-demo" style={{ marginBottom: '48px' }}>
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #090d16',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(9, 13, 22, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Workbench Header Bar */}
          <div
            style={{
              background: '#090d16',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                PropCalc Deal Workbench
              </span>
            </div>

            {/* Workbench Segmented Tab Switcher */}
            <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '6px' }}>
              <button
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  background: activeTab === 'calculator' ? '#ffffff' : 'transparent',
                  color: activeTab === 'calculator' ? '#090d16' : '#94a3b8',
                }}
                onClick={() => setActiveTab('calculator')}
              >
                Deal Simulator
              </button>
              <button
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  background: activeTab === 'api' ? '#ffffff' : 'transparent',
                  color: activeTab === 'api' ? '#090d16' : '#94a3b8',
                }}
                onClick={() => setActiveTab('api')}
              >
                JSON Payload
              </button>
              <button
                style={{
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  background: activeTab === 'cli' ? '#ffffff' : 'transparent',
                  color: activeTab === 'cli' ? '#090d16' : '#94a3b8',
                }}
                onClick={() => setActiveTab('cli')}
              >
                cURL / CLI
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          <div style={{ padding: '20px' }}>
            {activeTab === 'calculator' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Controls Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#090d16' }}>
                    Adjust Deal Parameters
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Carpet Area:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{carpetArea} sq.ft</strong>
                    </label>
                    <input
                      type="range"
                      min="400"
                      max="1500"
                      step="5"
                      style={{ width: '100%', accentColor: '#090d16' }}
                      value={carpetArea}
                      onChange={(e) => setCarpetArea(Number(e.target.value))}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {[585, 690, 710, 950].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className="rate-badge-btn"
                          style={{ margin: 0, padding: '3px 8px', fontSize: '11px', fontWeight: 700, background: carpetArea === preset ? '#090d16' : '#f1f5f9', color: carpetArea === preset ? '#ffffff' : '#334155' }}
                          onClick={() => setCarpetArea(preset)}
                        >
                          {preset} sqft
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Base Rate (PSF):</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{ratePsf.toLocaleString('en-IN')}/sqft</strong>
                    </label>
                    <input
                      type="range"
                      min="15000"
                      max="50000"
                      step="500"
                      style={{ width: '100%', accentColor: '#090d16' }}
                      value={ratePsf}
                      onChange={(e) => setRatePsf(Number(e.target.value))}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {[25000, 30500, 32500, 35000].map((r) => (
                        <button
                          key={r}
                          type="button"
                          className="rate-badge-btn"
                          style={{ margin: 0, padding: '3px 8px', fontSize: '11px', fontWeight: 700, background: ratePsf === r ? '#090d16' : '#f1f5f9', color: ratePsf === r ? '#ffffff' : '#334155' }}
                          onClick={() => setRatePsf(r)}
                        >
                          ₹{(r / 1000).toFixed(1)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Channel Partner Slabs:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{brokerageRate}%</strong>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                      {[3.5, 4.0, 4.5, 5.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className="rate-badge-btn"
                          style={{ margin: 0, padding: '6px 2px', textAlign: 'center', fontSize: '11px', fontWeight: 800, background: brokerageRate === pct ? '#090d16' : '#f1f5f9', color: brokerageRate === pct ? '#ffffff' : '#334155' }}
                          onClick={() => setBrokerageRate(pct)}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Real-time Ledger Right Column */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    REAL-TIME LEDGER
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px dashed #cbd5e1' }}>
                      <span>Agreement Value (AGV)</span>
                      <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(agv)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Stamp Duty (6%)</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(stampDuty)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>GST (5%)</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(gst)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Reg &amp; Legal Charges</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(regLegal)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Development Charges</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(devCharges)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Car Parking</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(parking)}</span>
                    </div>

                    {/* Total Band */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '2px solid #090d16', marginTop: '4px' }}>
                      <strong style={{ fontSize: '14px', textTransform: 'uppercase' }}>Grand Total</strong>
                      <strong style={{ fontSize: '17px', fontFamily: 'var(--font-mono)', color: '#090d16' }}>
                        {formatIndianCurrency(grandTotal)}
                      </strong>
                    </div>

                    {/* CP Brokerage Band */}
                    <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '6px', padding: '8px 10px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
                        <span>CP Payout ({brokerageRate}% + 18% GST)</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{formatIndianCurrency(totalBrokerage)}</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#b45309', marginTop: '2px' }}>
                        Base: {formatIndianCurrency(baseBrokerage)} + GST: {formatIndianCurrency(brokerageGst)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    {activeTab === 'api' ? 'JSON Response Output' : 'cURL Command'}
                  </span>
                  <button
                    className="rate-badge-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    background: '#090d16',
                    color: '#e2e8f0',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: '1.45',
                    overflowX: 'auto',
                    maxHeight: '280px',
                  }}
                >
                  <code>{activeTab === 'api' ? apiSamplePayload : cliCommand}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Feature Stack (Stripe / Linear 3-Pillar Architecture) ── */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '1px' }}>
            ENGINE CAPABILITIES
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginTop: '4px' }}>
            Engineered for speed, precision &amp; compliance.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Pillar 1 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '14px' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Deterministic Rule Engine</h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Threshold-aware development charge rules ($&lt; 700$ sq.ft flat lump sum vs PSF rates), slab-based registration, and accurate Indian currency formatting in Rupees and Words.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '14px' }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Channel Partner Invoicing</h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Strict Agreement Value (AGV) brokerage calculation with automated 18% GST tax invoicing, tiered performance ladder slabs (3.5% to 5.0%), and instant payout estimation.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', marginBottom: '14px' }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>Zero-Latency Offline PWA</h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Built with Next.js 15 static export and pre-caching Service Worker. Add to home screen on iOS and Android to generate quotations offline on construction sites.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Pricing Matrix Tiers ── */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '1px' }}>
            TRANSPARENT PRICING
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginTop: '4px' }}>
            Simple, predictable plans.
          </h2>

          {/* Annual Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '14px', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '9999px',
                background: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                color: billingCycle === 'monthly' ? '#090d16' : '#64748b',
                boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '9999px',
                background: billingCycle === 'annual' ? '#090d16' : 'transparent',
                color: billingCycle === 'annual' ? '#ffffff' : '#64748b',
                boxShadow: billingCycle === 'annual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setBillingCycle('annual')}
            >
              Annual (20% Off)
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Free Tier */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#090d16' }}>Individual Broker</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>For independent Channel Partners</div>
            <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '16px 0 8px 0' }}>
              ₹0 <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', fontFamily: 'var(--font-sans)' }}>/ lifetime</span>
            </div>
            <button className="btn-sub" style={{ width: '100%', marginBottom: '16px', borderRadius: '6px' }} onClick={onLaunchApp}>
              Launch Free App
            </button>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> Offline PWA Cost Sheet</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> Sheetal Sangam Matrix</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> WhatsApp Quotation Export</li>
            </ul>
          </div>

          {/* Pro Tier (Featured) */}
          <div style={{ background: '#090d16', color: '#ffffff', border: '2px solid #2563eb', borderRadius: '12px', padding: '24px', position: 'relative', boxShadow: '0 8px 28px rgba(37, 99, 235, 0.15)' }}>
            <div style={{ position: 'absolute', top: '-11px', right: '18px', background: '#2563eb', color: '#ffffff', padding: '2px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Sales Team &amp; Agency</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>For property sales offices &amp; CP networks</div>
            <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '16px 0 8px 0', color: '#ffffff' }}>
              {billingCycle === 'annual' ? '₹ 1,999' : '₹ 2,499'}
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', fontFamily: 'var(--font-sans)' }}> / month</span>
            </div>
            <button className="btn-main" style={{ width: '100%', marginBottom: '16px', borderRadius: '6px', background: '#2563eb', color: '#ffffff' }} onClick={onLaunchApp}>
              Get Started with Pro
            </button>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#38bdf8" /> Unlimited Saved Quotes &amp; History</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#38bdf8" /> Multi-Project Cost Sheet Presets</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#38bdf8" /> PDF Quotation Branding &amp; Logo</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#38bdf8" /> Custom CP Commission Rules</li>
            </ul>
          </div>

          {/* Enterprise Tier */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#090d16' }}>Developer &amp; Enterprise</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Custom ERP integration &amp; API access</div>
            <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)', margin: '16px 0 8px 0' }}>
              Custom
            </div>
            <button className="btn-sub" style={{ width: '100%', marginBottom: '16px', borderRadius: '6px' }} onClick={onLaunchApp}>
              Contact Sales
            </button>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> Dedicated REST API &amp; Webhooks</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> Custom Inventory &amp; CRM Sync</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#16a34a" /> SLA Guarantee &amp; Dedicated Rep</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. Statement Footer (Ft2 / Ft5 modern-minimal) ── */}
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px',
          paddingBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: '#090d16' }}>PropCalc Engine</strong>
          <span>— Precision Real Estate Pricing Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }} onClick={onLaunchApp}>
            Open Cost Sheet
          </button>
          <span>MIT License</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};
