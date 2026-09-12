'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function ServiceWorkerManager() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Register Service Worker silently in background
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (isOnline) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#ef4444',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          padding: '3px 8px',
          borderRadius: '4px',
        }}
      >
        <WifiOff size={12} />
        Offline
      </span>
    </div>
  );
}
