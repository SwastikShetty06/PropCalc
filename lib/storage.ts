import { SavedQuote, ReceivedDocument, CalculationInputs } from './types';
import { DEFAULT_INPUTS } from './calculations';

const STORAGE_KEYS = {
  SAVED_QUOTES: 'propcalc_saved_quotes_v3',
  LAST_INPUTS: 'propcalc_last_inputs_v3',
  RECEIVED_DOCS: 'propcalc_received_docs_v3',
};

export const DEFAULT_RECEIVED_DOCUMENTS: ReceivedDocument[] = [
  {
    id: 'dev_agreement',
    title: 'Developer Agreement',
    codeName: 'DA',
    category: 'Legal',
    status: 'Received',
    dateReceived: 'Available on Record',
    description: 'Original Registered Joint Development Agreement executed between Landowner and Developer.',
    notes: 'Clear marketable title and development rights assigned.',
  },
  {
    id: 'nocs',
    title: "NOC's (No Objection Certificates)",
    codeName: 'NOC',
    category: 'Statutory',
    status: 'Received',
    dateReceived: 'Available on Record',
    description: 'Statutory approvals from Fire Department, Airport Authority (AAI), Pollution Board & Water Supply.',
    notes: 'All requisite environment and safety NOCs obtained.',
  },
  {
    id: 'poa',
    title: 'Power of Attorney',
    codeName: 'POA',
    category: 'Legal',
    status: 'Received',
    dateReceived: 'Available on Record',
    description: 'Registered Irrevocable General Power of Attorney granting full authority to sell and register units.',
    notes: 'Registered with Sub-Registrar.',
  },
  {
    id: 'loi',
    title: 'LOI (Letter of Intent)',
    codeName: 'LOI',
    category: 'Authority',
    status: 'Received',
    dateReceived: 'Available on Record',
    description: 'Formal sanction and Letter of Intent issued by local Planning & Municipal Authority.',
    notes: 'Terms acknowledged and project sanctioned.',
  },
  {
    id: 'iod',
    title: 'IOD (Intimation of Disapproval)',
    codeName: 'IOD',
    category: 'Technical',
    status: 'Received',
    dateReceived: 'Available on Record',
    description: 'Municipal Corporation Intimation of Disapproval with full compliance criteria and building plan sanction.',
    notes: 'Sanctioned architectural and structural plans on file.',
  },
];

export function getSavedQuotes(): SavedQuote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_QUOTES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveQuote(quote: SavedQuote): SavedQuote[] {
  if (typeof window === 'undefined') return [];
  try {
    const quotes = getSavedQuotes();
    const existingIndex = quotes.findIndex((q) => q.id === quote.id);
    let updated: SavedQuote[];
    if (existingIndex >= 0) {
      updated = [...quotes];
      updated[existingIndex] = quote;
    } else {
      updated = [quote, ...quotes];
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_QUOTES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteSavedQuote(id: string): SavedQuote[] {
  if (typeof window === 'undefined') return [];
  try {
    const quotes = getSavedQuotes();
    const filtered = quotes.filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_QUOTES, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    return [];
  }
}

export function getLastInputs(): CalculationInputs {
  if (typeof window === 'undefined') return DEFAULT_INPUTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_INPUTS);
    return raw ? { ...DEFAULT_INPUTS, ...JSON.parse(raw) } : DEFAULT_INPUTS;
  } catch (e) {
    return DEFAULT_INPUTS;
  }
}

export function saveLastInputs(inputs: CalculationInputs): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_INPUTS, JSON.stringify(inputs));
  } catch (e) {
    console.error('Error storing last inputs', e);
  }
}

export function getReceivedDocuments(): ReceivedDocument[] {
  if (typeof window === 'undefined') return DEFAULT_RECEIVED_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIVED_DOCS);
    return raw ? JSON.parse(raw) : DEFAULT_RECEIVED_DOCUMENTS;
  } catch (e) {
    return DEFAULT_RECEIVED_DOCUMENTS;
  }
}

export function saveReceivedDocuments(docs: ReceivedDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.RECEIVED_DOCS, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving received documents', e);
  }
}
