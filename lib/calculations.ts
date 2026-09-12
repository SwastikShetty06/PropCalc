import {
  CalculationInputs,
  CalculationResult,
  CostBreakdownItem,
  BrokerageLadderTier,
  SheetalPaymentScheme,
  SheetalUnitConfig,
  SheetalCostBreakdown,
} from './types';

export const SHEETAL_SANGAM_UNITS: SheetalUnitConfig[] = [
  {
    id: 'unit_585',
    carpetArea: 585,
    bhkLabel: '2 BHK (Compact)',
    rates: {
      CLP: 30500,
      '30_70': 32500,
    },
  },
  {
    id: 'unit_690',
    carpetArea: 690,
    bhkLabel: '2 BHK (Spacious)',
    rates: {
      CLP: 30500,
      '30_70': 32500,
    },
  },
  {
    id: 'unit_710',
    carpetArea: 710,
    bhkLabel: '3 BHK (Premium)',
    rates: {
      CLP: 30500,
      '30_70': 32500,
    },
  },
];

export const BROKERAGE_LADDER_TIERS: BrokerageLadderTier[] = [
  {
    id: 'tier_1',
    percent: 3.5,
    rangeLabel: '0 to 5,000 sq. ft.',
    minSqFt: 0,
    maxSqFt: 5000,
    description: 'Base Tier Partnership',
    color: '#3b82f6',
  },
  {
    id: 'tier_2',
    percent: 4.0,
    rangeLabel: '5,001 to 10,000 sq. ft.',
    minSqFt: 5001,
    maxSqFt: 10000,
    description: 'Silver Growth Tier',
    color: '#eab308',
  },
  {
    id: 'tier_3',
    percent: 4.5,
    rangeLabel: '10,001 to 15,000 sq. ft.',
    minSqFt: 10001,
    maxSqFt: 15000,
    description: 'Gold Performance Tier',
    color: '#f97316',
  },
  {
    id: 'tier_4',
    percent: 5.0,
    rangeLabel: '15,001 sq. ft. & above',
    minSqFt: 15001,
    maxSqFt: null,
    description: 'Platinum Elite Tier',
    color: '#ef4444',
  },
];

export const DEFAULT_INPUTS: CalculationInputs = {
  carpetArea: 668,
  ratePerSqFt: 25000,
  gstPercent: 12,
  stampDutyPercent: 6,
  regCharges: 30000,
  legalCharges: 20000,
  regLegalCharges: 50000,
  carParkingSlots: 1,
  carParkingCostPerSlot: 1200000,
  carParkingCustomAmount: null,
  useCustomParking: false,
  devChargesThreshold: 700,
  devChargesFlatRate: 555000,
  devChargesPsfRate: 800,
  brokeragePercent: 3.5,
  cumulativeSoldSqFt: 668,
};

/**
 * Format a number into Indian Rupee format (e.g. 2,15,11,000)
 */
export function formatIndianCurrency(amount: number, includeSymbol: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSymbol ? '₹ 0' : '0';
  }
  
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();
  
  let lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const sign = isNegative ? '-' : '';
  
  return includeSymbol ? `${sign}₹ ${formatted}` : `${sign}${formatted}`;
}

/**
 * Format large Indian amounts compactly (e.g. 2.15 Cr, 55.50 L, 50 K)
 */
export function formatCompactIndian(amount: number): string {
  if (!amount || isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);
  
  if (abs >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  } else if (abs >= 1000) {
    return `₹ ${(amount / 1000).toFixed(1)} K`;
  }
  return formatIndianCurrency(amount);
}

/**
 * Convert number to words in Indian Numbering System
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  if (!num || isNaN(num)) return '';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const units = n % 10;
    return b[tens] + (units !== 0 ? ' ' + a[units] : '');
  }

  function convertThreeDigits(n: number): string {
    if (n === 0) return '';
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    let result = '';
    if (hundreds > 0) {
      result += a[hundreds] + ' Hundred';
      if (remainder > 0) result += ' and ';
    }
    if (remainder > 0) {
      result += convertTwoDigits(remainder);
    }
    return result;
  }

  let amount = Math.floor(Math.abs(num));
  let words = '';

  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;
  if (crore > 0) {
    words += convertTwoDigits(crore) + ' Crore ';
  }

  const lakh = Math.floor(amount / 100000);
  amount %= 100000;
  if (lakh > 0) {
    words += convertTwoDigits(lakh) + ' Lakh ';
  }

  const thousand = Math.floor(amount / 1000);
  amount %= 1000;
  if (thousand > 0) {
    words += convertTwoDigits(thousand) + ' Thousand ';
  }

  if (amount > 0) {
    words += convertThreeDigits(amount) + ' ';
  }

  return words.trim() + ' Rupees Only';
}

/**
 * Determine ladder tier based on sold square footage
 */
export function getTierForVolume(sqFt: number): BrokerageLadderTier {
  for (const tier of BROKERAGE_LADDER_TIERS) {
    if (tier.maxSqFt === null) {
      if (sqFt >= tier.minSqFt) return tier;
    } else if (sqFt >= tier.minSqFt && sqFt <= tier.maxSqFt) {
      return tier;
    }
  }
  return BROKERAGE_LADDER_TIERS[0];
}

/**
 * Pure calculation function for all cost sheet and Channel Partner brokerage components
 */
export function calculateAll(inputs: CalculationInputs): CalculationResult {
  const carpetArea = Number(inputs.carpetArea) || 0;
  const ratePerSqFt = Number(inputs.ratePerSqFt) || 0;
  
  // 1. Agreement Value (AGV)
  const agreementValue = Math.round(carpetArea * ratePerSqFt);
  
  // 2. GST (e.g. 12% or 5%)
  const gstPercent = Number(inputs.gstPercent) || 0;
  const gstAmount = Math.round(agreementValue * (gstPercent / 100));
  
  // 3. Stamp Duty (e.g. 6%)
  const stampDutyPercent = Number(inputs.stampDutyPercent) || 0;
  const stampDutyAmount = Math.round(agreementValue * (stampDutyPercent / 100));
  
  // 4. Registration & Legal Charges
  const regLegalCharges = Number(inputs.regLegalCharges) || 0;
  
  // 5. Development Charges based on threshold rule
  const threshold = inputs.devChargesThreshold || 700;
  const flatRate = inputs.devChargesFlatRate || 555000;
  const psfRate = inputs.devChargesPsfRate || 800;
  
  let devChargesAmount = 0;
  let devChargesRuleApplied = '';
  
  if (carpetArea < threshold) {
    devChargesAmount = flatRate;
    devChargesRuleApplied = `Fixed (Area < ${threshold} sq.ft)`;
  } else {
    devChargesAmount = Math.round(carpetArea * psfRate);
    devChargesRuleApplied = `₹${psfRate}/sq.ft (${carpetArea} sq.ft)`;
  }
  
  // 6. Car Parking
  let carParkingAmount = 0;
  if (inputs.useCustomParking && inputs.carParkingCustomAmount !== null) {
    carParkingAmount = Number(inputs.carParkingCustomAmount) || 0;
  } else {
    const slots = Number(inputs.carParkingSlots) || 0;
    const costPerSlot = Number(inputs.carParkingCostPerSlot) || 1200000;
    carParkingAmount = slots * costPerSlot;
  }
  
  // 7. Grand Total
  const grandTotal = agreementValue + gstAmount + stampDutyAmount + regLegalCharges + devChargesAmount + carParkingAmount;

  // 8. Channel Partner Brokerage (STRICTLY ON AGREEMENT VALUE, NOT ON GRAND TOTAL)
  const brokeragePercent = Number(inputs.brokeragePercent) || 3.5;
  const brokerageAmount = Math.round(agreementValue * (brokeragePercent / 100));
  const applicableTier = getTierForVolume(inputs.cumulativeSoldSqFt || carpetArea);

  // Line items
  const items: CostBreakdownItem[] = [
    {
      id: 'agv',
      label: 'Agreement Value (AGV)',
      subLabel: `${carpetArea} sq.ft × ₹${ratePerSqFt.toLocaleString('en-IN')}/sq.ft`,
      amount: agreementValue,
      category: 'base',
      percentageOfTotal: grandTotal > 0 ? (agreementValue / grandTotal) * 100 : 0,
    },
    {
      id: 'gst',
      label: `GST (${gstPercent}%)`,
      subLabel: `${gstPercent}% of Agreement Value`,
      amount: gstAmount,
      category: 'tax',
      percentageOfTotal: grandTotal > 0 ? (gstAmount / grandTotal) * 100 : 0,
      isCustomizable: true,
    },
    {
      id: 'stamp_duty',
      label: `Stamp Duty (${stampDutyPercent}%)`,
      subLabel: `${stampDutyPercent}% of Agreement Value`,
      amount: stampDutyAmount,
      category: 'tax',
      percentageOfTotal: grandTotal > 0 ? (stampDutyAmount / grandTotal) * 100 : 0,
      isCustomizable: true,
    },
    {
      id: 'reg_legal',
      label: 'Reg & Legal Charges',
      subLabel: 'Fixed Government & Legal Documentation',
      amount: regLegalCharges,
      category: 'statutory',
      percentageOfTotal: grandTotal > 0 ? (regLegalCharges / grandTotal) * 100 : 0,
      isCustomizable: true,
    },
    {
      id: 'dev_charges',
      label: 'Development Charges',
      subLabel: devChargesRuleApplied,
      amount: devChargesAmount,
      category: 'development',
      percentageOfTotal: grandTotal > 0 ? (devChargesAmount / grandTotal) * 100 : 0,
    },
    {
      id: 'car_parking',
      label: 'Car Parking',
      subLabel: inputs.useCustomParking ? 'Custom Amount' : `${inputs.carParkingSlots} Slot(s) @ ₹${(inputs.carParkingCostPerSlot / 100000).toFixed(1)}L`,
      amount: carParkingAmount,
      category: 'amenity',
      percentageOfTotal: grandTotal > 0 ? (carParkingAmount / grandTotal) * 100 : 0,
      isCustomizable: true,
    },
  ];
  
  return {
    carpetArea,
    ratePerSqFt,
    agreementValue,
    gstPercent,
    gstAmount,
    stampDutyPercent,
    stampDutyAmount,
    regLegalCharges,
    devChargesThreshold: threshold,
    devChargesAmount,
    devChargesRuleApplied,
    carParkingAmount,
    carParkingSlots: inputs.carParkingSlots,
    grandTotal,
    items,
    amountInWords: numberToIndianWords(grandTotal),
    brokeragePercent,
    brokerageAmount,
    brokerageInWords: numberToIndianWords(brokerageAmount),
    applicableTier,
  };
}

/**
 * Dedicated calculation helper for Sheetal Sangam Residential Project
 */
export function calculateSheetalCost(
  carpetArea: number,
  scheme: SheetalPaymentScheme = 'CLP',
  customRate?: number,
  customParking: number = 1200000,
  customDevCharges: number = 555000,
  brokeragePercent: number = 3.5
): SheetalCostBreakdown {
  const baseRate = customRate ?? (scheme === 'CLP' ? 30500 : 32500);
  const agreementValue = Math.round(carpetArea * baseRate);
  
  const stampDutyPercent = 6;
  const stampDutyAmount = Math.round(agreementValue * 0.06);
  
  const registrationAmount = 30000;
  const legalChargesAmount = 20000;
  
  const gstPercent = 5;
  const gstAmount = Math.round(agreementValue * 0.05);
  
  const carParkingAmount = customParking;
  const devChargesAmount = customDevCharges;
  
  const grandTotal = agreementValue + stampDutyAmount + registrationAmount + legalChargesAmount + gstAmount + carParkingAmount + devChargesAmount;

  // Payment Schedule
  let schedule: SheetalCostBreakdown['schedule'];
  if (scheme === 'CLP') {
    const nowPercent = 10;
    const nowAmount = Math.round(agreementValue * 0.10);
    const nowGst = Math.round(nowAmount * 0.05);
    const nowTotal = nowAmount + nowGst;
    schedule = {
      nowPercent,
      nowAmount,
      nowGst,
      nowTotal,
      notes: 'Rest as per Construction Linked Plan (CLP)',
    };
  } else {
    // 30:70 Scheme
    const nowPercent = 30;
    const nowAmount = Math.round(agreementValue * 0.30);
    const nowGst = Math.round(nowAmount * 0.05);
    const nowTotal = nowAmount + nowGst;
    
    const possessionPercent = 70;
    const possessionAmount = Math.round(agreementValue * 0.70);
    const possessionGst = Math.round(possessionAmount * 0.05);
    const possessionTotal = possessionAmount + possessionGst;
    
    schedule = {
      nowPercent,
      nowAmount,
      nowGst,
      nowTotal,
      possessionPercent,
      possessionAmount,
      possessionGst,
      possessionTotal,
      notes: '30% Now booking & 70% on Possession milestone',
    };
  }

  const brokerageAmount = Math.round(agreementValue * (brokeragePercent / 100));

  return {
    carpetArea,
    ratePerSqFt: baseRate,
    scheme,
    agreementValue,
    stampDutyPercent,
    stampDutyAmount,
    registrationAmount,
    legalChargesAmount,
    gstPercent,
    gstAmount,
    carParkingAmount,
    devChargesAmount,
    grandTotal,
    amountInWords: numberToIndianWords(grandTotal),
    schedule,
    brokeragePercent,
    brokerageAmount,
  };
}
