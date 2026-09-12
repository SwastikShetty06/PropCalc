export interface CalculationInputs {
  carpetArea: number;
  ratePerSqFt: number;
  gstPercent: number;
  stampDutyPercent: number;
  regCharges?: number;        // e.g. 30000
  legalCharges?: number;      // e.g. 20000
  regLegalCharges: number;    // combined 50000
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
  brokerageGstPercent?: number; // default 18%
  cumulativeSoldSqFt?: number; // for ladder tier detection
}

export type SheetalPaymentScheme = 'CLP' | '30_70';

export interface SheetalUnitConfig {
  id: string;
  carpetArea: number;
  bhkLabel: string;
  rates: {
    CLP: number;    // 30,500
    '30_70': number; // 32,500
  };
}

export interface SheetalCostBreakdown {
  carpetArea: number;
  ratePerSqFt: number;
  scheme: SheetalPaymentScheme;
  agreementValue: number;
  stampDutyPercent: number;
  stampDutyAmount: number;
  registrationAmount: number;
  legalChargesAmount: number;
  gstPercent: number;
  gstAmount: number;
  carParkingAmount: number;
  devChargesAmount: number;
  grandTotal: number;
  amountInWords: string;
  
  // Payment schedule breakdown
  schedule: {
    nowPercent: number;
    nowAmount: number;
    nowGst: number;
    nowTotal: number;
    possessionPercent?: number;
    possessionAmount?: number;
    possessionGst?: number;
    possessionTotal?: number;
    notes: string;
  };
  
  // CP Brokerage & GST on Brokerage
  brokeragePercent: number;
  brokerageAmount: number;
  brokerageGstPercent: number; // 18%
  brokerageGstAmount: number;
  brokerageTotalPayout: number;
  brokerageTotalInWords: string;
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

  // Channel Partner Brokerage details & GST on Brokerage (18%)
  brokeragePercent: number;
  brokerageAmount: number;
  brokerageGstPercent: number;
  brokerageGstAmount: number;
  brokerageTotalPayout: number;
  brokerageInWords: string;
  brokerageTotalInWords: string;
  applicableTier: BrokerageLadderTier;
}

export interface SavedQuote {
  id: string;
  projectName?: string;
  unitNumber?: string;
  clientName?: string;
  clientPhone?: string;
  cpName?: string;
  scheme?: string;
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
