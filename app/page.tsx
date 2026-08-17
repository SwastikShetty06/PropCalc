'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CalculationInputs, CalculationResult, ReceivedDocument } from '@/lib/types';
import {
  DEFAULT_INPUTS,
  calculateAll,
  formatIndianCurrency,
  formatCompactIndian,
} from '@/lib/calculations';
import {
  getLastInputs,
  saveLastInputs,
  getSavedQuotes,
  getReceivedDocuments,
} from '@/lib/storage';
import { TableCalculator } from '@/components/TableCalculator';
import { BrokerageLadderPage } from '@/components/BrokerageLadderPage';
import { ReceivedDocsPage } from '@/components/ReceivedDocsPage';
import { ShareModal } from '@/components/ShareModal';
import { SavedQuotesModal } from '@/components/SavedQuotesModal';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { ServiceWorkerManager } from './sw-register';
import {
  Table as TableIcon,
  TrendingUp,
  FolderCheck,
  Share2,
  Bookmark,
  Sliders,
  RotateCcw,
  Delete,
  Check,
  ChevronDown,
  FileText
} from 'lucide-react';

type TabType = 'costsheet' | 'ladder' | 'documents';

export default function Home() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [receivedDocs, setReceivedDocs] = useState<ReceivedDocument[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('costsheet');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSavedQuotesOpen, setIsSavedQuotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Metadata
  const [meta, setMeta] = useState({
    projectName: '',
    unitNumber: '',
    clientName: '',
  });

  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setInputs(getLastInputs());
    setReceivedDocs(getReceivedDocuments());
    setSavedCount(getSavedQuotes().length);
  }, []);

  const handleInputsChange = (newInputs: CalculationInputs) => {
    setInputs(newInputs);
    saveLastInputs(newInputs);
  };

  const handleResetToDefaults = () => {
    setInputs(DEFAULT_INPUTS);
    saveLastInputs(DEFAULT_INPUTS);
    setMeta({ projectName: '', unitNumber: '', clientName: '' });
  };

  const handleLoadQuote = (
    loadedInputs: CalculationInputs,
    loadedMeta?: { projectName?: string; unitNumber?: string; clientName?: string }
  ) => {
    setInputs(loadedInputs);
    saveLastInputs(loadedInputs);
    if (loadedMeta) {
      setMeta({
        projectName: loadedMeta.projectName || '',
        unitNumber: loadedMeta.unitNumber || '',
        clientName: loadedMeta.clientName || '',
      });
    }
  };

  const result: CalculationResult = useMemo(() => {
    return calculateAll(inputs);
  }, [inputs]);

  // Keypad Handlers
  const handleSelectField = (field: string) => {
    setActiveField(field);
    setShowKeypad(true);
  };

  const handleKeypadPress = (key: string) => {
    if (!activeField) return;

    let currentValStr = '';
    if (activeField === 'carpetArea') currentValStr = inputs.carpetArea ? inputs.carpetArea.toString() : '';
    if (activeField === 'ratePerSqFt') currentValStr = inputs.ratePerSqFt ? inputs.ratePerSqFt.toString() : '';
    if (activeField === 'regLegalCharges') currentValStr = inputs.regLegalCharges ? inputs.regLegalCharges.toString() : '';
    if (activeField === 'carParking') currentValStr = inputs.carParkingCustomAmount !== null ? inputs.carParkingCustomAmount.toString() : (inputs.carParkingSlots * inputs.carParkingCostPerSlot).toString();

    const nextValStr = currentValStr + key;
    const num = Number(nextValStr);

    if (activeField === 'carpetArea') handleInputsChange({ ...inputs, carpetArea: num });
    if (activeField === 'ratePerSqFt') handleInputsChange({ ...inputs, ratePerSqFt: num });
    if (activeField === 'regLegalCharges') handleInputsChange({ ...inputs, regLegalCharges: num });
    if (activeField === 'carParking') handleInputsChange({ ...inputs, useCustomParking: true, carParkingCustomAmount: num });
  };

  const handleKeypadBackspace = () => {
    if (!activeField) return;

    let currentValStr = '';
    if (activeField === 'carpetArea') currentValStr = inputs.carpetArea ? inputs.carpetArea.toString() : '';
    if (activeField === 'ratePerSqFt') currentValStr = inputs.ratePerSqFt ? inputs.ratePerSqFt.toString() : '';
    if (activeField === 'regLegalCharges') currentValStr = inputs.regLegalCharges ? inputs.regLegalCharges.toString() : '';
    if (activeField === 'carParking') currentValStr = inputs.carParkingCustomAmount !== null ? inputs.carParkingCustomAmount.toString() : (inputs.carParkingSlots * inputs.carParkingCostPerSlot).toString();

    const nextValStr = currentValStr.slice(0, -1);
    const num = nextValStr === '' ? 0 : Number(nextValStr);

    if (activeField === 'carpetArea') handleInputsChange({ ...inputs, carpetArea: num });
    if (activeField === 'ratePerSqFt') handleInputsChange({ ...inputs, ratePerSqFt: num });
    if (activeField === 'regLegalCharges') handleInputsChange({ ...inputs, regLegalCharges: num });
    if (activeField === 'carParking') handleInputsChange({ ...inputs, useCustomParking: true, carParkingCustomAmount: num });
  };

  const handleKeypadClear = () => {
    if (!activeField) return;
    if (activeField === 'carpetArea') handleInputsChange({ ...inputs, carpetArea: 0 });
    if (activeField === 'ratePerSqFt') handleInputsChange({ ...inputs, ratePerSqFt: 0 });
    if (activeField === 'regLegalCharges') handleInputsChange({ ...inputs, regLegalCharges: 0 });
    if (activeField === 'carParking') handleInputsChange({ ...inputs, useCustomParking: true, carParkingCustomAmount: 0 });
  };

  const getActiveFieldTitle = (): string => {
    if (activeField === 'carpetArea') return 'Carpet Area (sq.ft)';
    if (activeField === 'ratePerSqFt') return 'Rate per Sq.Ft (PSF)';
    if (activeField === 'regLegalCharges') return 'Reg & Legal Charges (₹)';
    if (activeField === 'carParking') return 'Car Parking Cost (₹)';
    return 'Select an item to type';
  };

  return (
    <div className="page-container">
      {/* Top Header Bar */}
      <header className="app-topbar">
        <div className="brand-title">
          <FileText size={18} />
          <span>PropCalc</span>
          <span className="brand-badge">Offline</span>
        </div>

        <div className="topbar-actions">
          <ServiceWorkerManager />

          <button
            className="btn-icon"
            onClick={() => {
              setSavedCount(getSavedQuotes().length);
              setIsSavedQuotesOpen(true);
            }}
            title="Saved Quotes"
          >
            <Bookmark size={16} />
          </button>

          <button
            className="btn-icon"
            onClick={() => setIsSettingsOpen(true)}
            title="Settings &amp; Rules"
          >
            <Sliders size={16} />
          </button>
        </div>
      </header>

      {/* Menu Bar Tabs */}
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          background: '#ffffff',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
        }}
      >
        <button
          className={`btn-sub ${currentTab === 'costsheet' ? 'btn-main' : ''}`}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: '12px',
            borderRadius: '4px',
            border: currentTab === 'costsheet' ? 'none' : '1px solid transparent',
          }}
          onClick={() => setCurrentTab('costsheet')}
        >
          <TableIcon size={14} />
          <span>Cost Sheet</span>
        </button>

        <button
          className={`btn-sub ${currentTab === 'ladder' ? 'btn-main' : ''}`}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: '12px',
            borderRadius: '4px',
            border: currentTab === 'ladder' ? 'none' : '1px solid transparent',
          }}
          onClick={() => setCurrentTab('ladder')}
        >
          <TrendingUp size={14} />
          <span>CP Ladder</span>
        </button>

        <button
          className={`btn-sub ${currentTab === 'documents' ? 'btn-main' : ''}`}
          style={{
            flex: 1,
            padding: '8px 10px',
            fontSize: '12px',
            borderRadius: '4px',
            border: currentTab === 'documents' ? 'none' : '1px solid transparent',
          }}
          onClick={() => setCurrentTab('documents')}
        >
          <FolderCheck size={14} />
          <span>Documents</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {currentTab === 'costsheet' && (
        <TableCalculator
          inputs={inputs}
          result={result}
          onChange={handleInputsChange}
          activeField={activeField}
          onSelectField={handleSelectField}
          onOpenLadderPage={() => setCurrentTab('ladder')}
        />
      )}

      {currentTab === 'ladder' && (
        <BrokerageLadderPage
          inputs={inputs}
          result={result}
          onUpdateBrokerage={(pct) => {
            handleInputsChange({ ...inputs, brokeragePercent: pct });
            setCurrentTab('costsheet');
          }}
        />
      )}

      {currentTab === 'documents' && (
        <ReceivedDocsPage documents={receivedDocs} />
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="bottom-bar">
        <div className="bar-inner">
          <button className="btn-main" onClick={() => setIsShareOpen(true)}>
            <Share2 size={16} />
            <span>Share Sheet</span>
          </button>

          <button className="btn-sub" onClick={() => setIsSavedQuotesOpen(true)}>
            <Bookmark size={16} />
            <span>Save</span>
          </button>

          <button
            className="btn-icon"
            style={{ width: '42px', height: '42px' }}
            onClick={handleResetToDefaults}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* On-Screen Numeric Keypad Drawer */}
      {showKeypad && currentTab === 'costsheet' && (
        <div className="keypad-drawer">
          <div className="keypad-drawer-inner">
            <div className="keypad-top-info">
              <span className="keypad-target-name">{getActiveFieldTitle()}</span>
              <button
                className="btn-icon"
                style={{ width: '28px', height: '28px', border: 'none' }}
                onClick={() => setShowKeypad(false)}
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="keypad-grid-3x4">
              <button className="k-btn" onClick={() => handleKeypadPress('1')}>1</button>
              <button className="k-btn" onClick={() => handleKeypadPress('2')}>2</button>
              <button className="k-btn" onClick={() => handleKeypadPress('3')}>3</button>

              <button className="k-btn" onClick={() => handleKeypadPress('4')}>4</button>
              <button className="k-btn" onClick={() => handleKeypadPress('5')}>5</button>
              <button className="k-btn" onClick={() => handleKeypadPress('6')}>6</button>

              <button className="k-btn" onClick={() => handleKeypadPress('7')}>7</button>
              <button className="k-btn" onClick={() => handleKeypadPress('8')}>8</button>
              <button className="k-btn" onClick={() => handleKeypadPress('9')}>9</button>

              <button className="k-btn k-btn-action" onClick={handleKeypadClear} style={{ color: '#e11d48' }}>
                CLEAR
              </button>
              <button className="k-btn" onClick={() => handleKeypadPress('0')}>0</button>
              <button className="k-btn k-btn-action" onClick={handleKeypadBackspace}>
                <Delete size={18} />
              </button>

              <button className="k-btn k-btn-action" onClick={() => handleKeypadPress('00')}>00</button>
              <button className="k-btn k-btn-action" onClick={() => handleKeypadPress('000')}>000</button>
              <button className="k-btn k-btn-done" onClick={() => setShowKeypad(false)}>
                <Check size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        result={result}
        inputs={inputs}
        projectName={meta.projectName}
        unitNumber={meta.unitNumber}
        clientName={meta.clientName}
      />

      <SavedQuotesModal
        isOpen={isSavedQuotesOpen}
        onClose={() => {
          setIsSavedQuotesOpen(false);
          setSavedCount(getSavedQuotes().length);
        }}
        currentInputs={inputs}
        currentResult={result}
        onLoadQuote={handleLoadQuote}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inputs={inputs}
        onUpdateInputs={(updated) => handleInputsChange({ ...inputs, ...updated })}
        onResetDefaults={handleResetToDefaults}
      />
    </div>
  );
}
