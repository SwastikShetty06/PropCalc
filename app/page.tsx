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
import { SheetalSangamPage } from '@/components/SheetalSangamPage';
import { BrokerageLadderPage } from '@/components/BrokerageLadderPage';
import { ReceivedDocsPage } from '@/components/ReceivedDocsPage';
import { ShareModal } from '@/components/ShareModal';
import { SavedQuotesModal } from '@/components/SavedQuotesModal';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { ServiceWorkerManager } from './sw-register';
import {
  Table as TableIcon,
  Building2,
  TrendingUp,
  FolderCheck,
  Share2,
  Bookmark,
  Sliders,
  RotateCcw,
  Delete,
  Check,
  ChevronDown,
  FileText,
} from 'lucide-react';

/* Hallmark · genre: modern-minimal · macrostructure: workbench · theme: cobalt · enrichment: live-interactive · nav: n5 · footer: ft2 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

type TabType = 'sheetal_sangam' | 'costsheet' | 'ladder' | 'documents';

export default function Home() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [receivedDocs, setReceivedDocs] = useState<ReceivedDocument[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('sheetal_sangam');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSavedQuotesOpen, setIsSavedQuotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Metadata
  const [meta, setMeta] = useState({
    projectName: 'Sheetal Sangam',
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
    setMeta({ projectName: 'Sheetal Sangam', unitNumber: '', clientName: '' });
  };

  const handleLoadQuote = (
    loadedInputs: CalculationInputs,
    loadedMeta?: { projectName?: string; unitNumber?: string; clientName?: string }
  ) => {
    setInputs(loadedInputs);
    saveLastInputs(loadedInputs);
    if (loadedMeta) {
      setMeta({
        projectName: loadedMeta.projectName || 'Sheetal Sangam',
        unitNumber: loadedMeta.unitNumber || '',
        clientName: loadedMeta.clientName || '',
      });
    }
  };

  const handleLoadSheetalUnit = (customInputs: CalculationInputs, projectName: string) => {
    setInputs(customInputs);
    saveLastInputs(customInputs);
    setMeta({ ...meta, projectName });
    setCurrentTab('costsheet');
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

  const contentMaxWidth = currentTab === 'sheetal_sangam' ? '780px' : '580px';

  return (
    <div className="page-container">
      {/* Top Header Bar */}
      <header className="app-topbar" style={{ maxWidth: contentMaxWidth }}>
        <div className="brand-title">
          <FileText size={18} />
          <span>PropCalc</span>
          <span className="brand-badge">Offline PWA</span>
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

      {/* Modern-Minimal Tactile Navigation Tabs */}
      <nav className="nav-tab-bar" style={{ maxWidth: contentMaxWidth }} aria-label="Page Navigation">
        <button
          className={`nav-tab-btn ${currentTab === 'sheetal_sangam' ? 'active' : ''}`}
          onClick={() => setCurrentTab('sheetal_sangam')}
        >
          <Building2 size={14} />
          <span>Sheetal Sangam</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'costsheet' ? 'active' : ''}`}
          onClick={() => setCurrentTab('costsheet')}
        >
          <TableIcon size={14} />
          <span>Custom Calc</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'ladder' ? 'active' : ''}`}
          onClick={() => setCurrentTab('ladder')}
        >
          <TrendingUp size={14} />
          <span>CP Ladder</span>
        </button>

        <button
          className={`nav-tab-btn ${currentTab === 'documents' ? 'active' : ''}`}
          onClick={() => setCurrentTab('documents')}
        >
          <FolderCheck size={14} />
          <span>Documents</span>
        </button>
      </nav>

      {/* Main Tab Views */}
      {currentTab === 'sheetal_sangam' && (
        <SheetalSangamPage
          onLoadIntoCustomCalculator={handleLoadSheetalUnit}
          onOpenShareModal={() => setIsShareOpen(true)}
        />
      )}

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
      <footer className="bottom-bar">
        <div className="bar-inner" style={{ maxWidth: contentMaxWidth }}>
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
            style={{ width: '44px', height: '44px' }}
            onClick={handleResetToDefaults}
            title="Reset to Defaults"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </footer>

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
              <button className="k-btn" onClick={() => handleKeypadBackspace}>
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
