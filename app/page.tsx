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
  getReceivedDocuments,
} from '@/lib/storage';
import { TableCalculator } from '@/components/TableCalculator';
import { SheetalSangamPage } from '@/components/SheetalSangamPage';
import { BrokerageLadderPage } from '@/components/BrokerageLadderPage';
import { ReceivedDocsPage } from '@/components/ReceivedDocsPage';
import { ShareModal } from '@/components/ShareModal';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { ServiceWorkerManager } from './sw-register';
import {
  Table as TableIcon,
  Building2,
  TrendingUp,
  FolderCheck,
  Share2,
  Sliders,
  RotateCcw,
  FileText,
} from 'lucide-react';

/* Hallmark · genre: modern-minimal · macrostructure: workbench · theme: cobalt · enrichment: live-interactive · nav: n5 · footer: ft2 */
/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

type TabType = 'sheetal_sangam' | 'costsheet' | 'ladder' | 'documents';

export default function Home() {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [receivedDocs, setReceivedDocs] = useState<ReceivedDocument[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('sheetal_sangam');

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Metadata
  const [meta, setMeta] = useState({
    projectName: 'Sheetal Sangam',
    unitNumber: '',
    clientName: '',
  });

  useEffect(() => {
    setInputs(getLastInputs());
    setReceivedDocs(getReceivedDocuments());
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

  const handleLoadSheetalUnit = (customInputs: CalculationInputs, projectName: string) => {
    setInputs(customInputs);
    saveLastInputs(customInputs);
    setMeta({ ...meta, projectName });
    setCurrentTab('costsheet');
  };

  const result: CalculationResult = useMemo(() => {
    return calculateAll(inputs);
  }, [inputs]);

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
            onClick={() => setIsSettingsOpen(true)}
            title="Settings &amp; Default Rules"
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
            <span>Share Cost Sheet</span>
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
