'use client';

import React, { useState } from 'react';
import { CalculationResult, CalculationInputs } from '@/lib/types';
import { formatIndianCurrency } from '@/lib/calculations';
import { Share2, Copy, Check, Printer, X, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  inputs: CalculationInputs;
  projectName?: string;
  unitNumber?: string;
  clientName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  result,
  inputs,
  projectName = '',
  unitNumber = '',
  clientName = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [targetPhone, setTargetPhone] = useState('');

  if (!isOpen) return null;

  const generateShareText = (): string => {
    let text = `📄 *PROPERTY COST SHEET*\n`;
    if (projectName) text += `📌 Project: ${projectName}\n`;
    if (unitNumber) text += `🚪 Unit No: ${unitNumber}\n`;
    if (clientName) text += `👤 Client: ${clientName}\n`;
    text += `─────────────────────────\n`;
    text += `Carpet Area            —    ${result.carpetArea} sq.ft\n`;
    text += `Rate (PSF)             —    ₹${result.ratePerSqFt.toLocaleString('en-IN')}\n`;
    text += `A G V                  —    ${formatIndianCurrency(result.agreementValue)}\n`;
    text += `\n`;
    text += `GST ${result.gstPercent}%                —    ${formatIndianCurrency(result.gstAmount)}\n`;
    text += `Stamp Duty ${result.stampDutyPercent}%         —    ${formatIndianCurrency(result.stampDutyAmount)}\n`;
    text += `Reg & Legal charges    —    ${formatIndianCurrency(result.regLegalCharges)}\n`;
    text += `Development charges    —    ${formatIndianCurrency(result.devChargesAmount)}\n`;
    text += `Car Parking            —    ${formatIndianCurrency(result.carParkingAmount)}\n`;
    text += `─────────────────────────\n`;
    text += `*Total                  =    ${formatIndianCurrency(result.grandTotal)}*\n`;
    text += `_${result.amountInWords}_\n`;
    text += `─────────────────────────\n`;
    text += `🤝 *CP BROKERAGE SUMMARY:*\n`;
    text += `• Base Commission (${result.brokeragePercent}% on AGV): ${formatIndianCurrency(result.brokerageAmount)}\n`;
    text += `• GST on Brokerage (${result.brokerageGstPercent}%): ${formatIndianCurrency(result.brokerageGstAmount)}\n`;
    text += `• *Total Brokerage Payout:* ${formatIndianCurrency(result.brokerageTotalPayout)}\n`;
    text += `_${result.brokerageTotalInWords}_\n`;
    text += `─────────────────────────\n`;
    text += `Documents Checklist:\n`;
    text += `• Developer Agreement\n• NOC's\n• Power of Attorney\n• LOI\n• IOD\n`;
    return text;
  };

  const shareText = generateShareText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const handleWhatsApp = () => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(shareText);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Share Cost Sheet</span>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* WhatsApp Quick Send Input */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-label)', marginBottom: '4px', display: 'block' }}>
            Client WhatsApp Number (Optional)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0 10px', height: '42px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '6px' }}>+91</span>
            <input
              type="tel"
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '14px' }}
              placeholder="9876543210"
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <button className="btn-main" style={{ background: '#16a34a', color: '#ffffff' }} onClick={handleWhatsApp}>
            <Send size={15} />
            <span>WhatsApp</span>
          </button>
          <button className="btn-sub" onClick={handleCopy}>
            {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <button className="btn-sub" onClick={handlePrint} style={{ width: '100%', marginBottom: '14px' }}>
          <Printer size={15} />
          <span>Print / PDF Document</span>
        </button>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
            Preview
          </label>
          <pre
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              maxHeight: '140px',
              overflowY: 'auto',
            }}
          >
            {shareText}
          </pre>
        </div>
      </div>
    </div>
  );
};
