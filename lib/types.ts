export interface CalculationInputs {
  carpetArea: number;
  ratePerSqFt: number;
  gstPercent: number;
  stampDutyPercent: number;
  regLegalCharges: number;
  carParkingSlots: number;
  carParkingCostPerSlot: number;
  carParkingCustomAmount: number | null;
  useCustomParking: boolean;
  
  // Rules configuration
  devChargesThreshold: number; // default 700
  devChargesFlatRate: number;  // default 555000
  devChargesPsfRate: number;   // default 800

  // Brokerage configuration (Calculated strictly on AGV)
  brokeragePercent: number;    // default 3.5%
  cumulativeSoldSqFt?: number; // for ladder tier detection
}

export interface BrokerageLadderTier {
  id: string;
  percent: number;
  rangeLabel: string;
  minSqFt: number;
  maxSqFt: number | null;
  description: string;
  color: string;
}

export interface CostBreakdownItem {
  id: string;
  label: string;
  subLabel?: string;
  amount: number;
  category: 'base' | 'tax' | 'statutory' | 'development' | 'amenity' | 'other';
  percentageOfTotal: number;
  isCustomizable?: boolean;
}

export interface CalculationResult {
  carpetArea: number;
  ratePerSqFt: number;
  agreementValue: number;
  gstPercent: number;
  gstAmount: number;
  stampDutyPercent: number;
  stampDutyAmount: number;
  regLegalCharges: number;
  devChargesThreshold: number;
  devChargesAmount: number;
  devChargesRuleApplied: string;
  carParkingAmount: number;
  carParkingSlots: number;
  grandTotal: number;
  items: CostBreakdownItem[];
  amountInWords: string;

  // Channel Partner Brokerage details (On AGV)
  brokeragePercent: number;
  brokerageAmount: number;
  brokerageInWords: string;
  applicableTier: BrokerageLadderTier;
}

export interface SavedQuote {
  id: string;
  projectName?: string;
  unitNumber?: string;
  clientName?: string;
  clientPhone?: string;
  cpName?: string;
  inputs: CalculationInputs;
  result: CalculationResult;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceivedDocument {
  id: string;
  title: string;
  codeName: string;
  category: 'Legal' | 'Statutory' | 'Authority' | 'Technical';
  status: 'Received' | 'In Process' | 'Available on Request';
  dateReceived?: string;
  description: string;
  notes?: string;
}

export type PropertyDocument = ReceivedDocument;
