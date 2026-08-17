'use client';

import React from 'react';
import { Delete, Check, ChevronDown, Sparkles } from 'lucide-react';

interface NumericKeypadProps {
  activeFieldLabel: string;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onQuickAdd: (amount: number) => void;
  onClose: () => void;
  onNextField?: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  activeFieldLabel,
  onKeyPress,
  onBackspace,
  onClear,
  onQuickAdd,
  onClose,
  onNextField,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {
        // Ignore haptic errors
      }
    }
  };

  const handleKey = (key: string) => {
    triggerHaptic();
    onKeyPress(key);
  };

  const handleBack = () => {
    triggerHaptic();
    onBackspace();
  };

  const handleClear = () => {
    triggerHaptic();
    onClear();
  };

  const handleAdd = (num: number) => {
    triggerHaptic();
    onQuickAdd(num);
  };

  return (
    <div className="keypad-container">
      <div className="keypad-header">
        <div className="keypad-target-title">
          Editing: <strong style={{ color: 'var(--accent-emerald)' }}>{activeFieldLabel}</strong>
        </div>
        <button
          className="keypad-mode-switch"
          onClick={onClose}
          title="Minimize Keypad"
        >
          <span>Hide Keypad</span>
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Quick Add Increment Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          className="chip-btn"
          style={{ flex: 1, padding: '8px 4px', textAlign: 'center', background: 'var(--bg-card-hover)' }}
          onClick={() => handleAdd(100)}
        >
          +100
        </button>
        <button
          className="chip-btn"
          style={{ flex: 1, padding: '8px 4px', textAlign: 'center', background: 'var(--bg-card-hover)' }}
          onClick={() => handleAdd(500)}
        >
          +500
        </button>
        <button
          className="chip-btn"
          style={{ flex: 1, padding: '8px 4px', textAlign: 'center', background: 'var(--bg-card-hover)' }}
          onClick={() => handleAdd(1000)}
        >
          +1,000
        </button>
        <button
          className="chip-btn"
          style={{ flex: 1, padding: '8px 4px', textAlign: 'center', background: 'var(--bg-card-hover)', color: 'var(--accent-amber)' }}
          onClick={() => handleAdd(10000)}
        >
          +10,000
        </button>
      </div>

      {/* 3x4 Grid Keypad */}
      <div className="keypad-grid">
        <button className="key-btn" onClick={() => handleKey('1')}>1</button>
        <button className="key-btn" onClick={() => handleKey('2')}>2</button>
        <button className="key-btn" onClick={() => handleKey('3')}>3</button>

        <button className="key-btn" onClick={() => handleKey('4')}>4</button>
        <button className="key-btn" onClick={() => handleKey('5')}>5</button>
        <button className="key-btn" onClick={() => handleKey('6')}>6</button>

        <button className="key-btn" onClick={() => handleKey('7')}>7</button>
        <button className="key-btn" onClick={() => handleKey('8')}>8</button>
        <button className="key-btn" onClick={() => handleKey('9')}>9</button>

        <button className="key-btn action-key" onClick={handleClear} style={{ color: 'var(--accent-rose)', fontWeight: 800 }}>
          C
        </button>
        <button className="key-btn" onClick={() => handleKey('0')}>0</button>
        <button className="key-btn action-key" onClick={handleBack}>
          <Delete size={20} />
        </button>

        <button className="key-btn action-key" onClick={() => handleKey('00')}>00</button>
        <button className="key-btn action-key" onClick={() => handleKey('000')}>000</button>
        <button className="key-btn submit-key" onClick={onNextField || onClose}>
          <Check size={22} />
        </button>
      </div>
    </div>
  );
};
