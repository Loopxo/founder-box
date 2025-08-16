export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceCompany {
  name: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  taxNumber?: string;
  logo?: string;
}

export interface InvoiceClient {
  name: string;
  address: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface InvoiceTax {
  name: string;
  rate: number;
  amount: number;
}

export interface InvoicePaymentTerms {
  dueDate: string;
  paymentMethods: string[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode?: string;
  };
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  
  // Company details
  company: InvoiceCompany;
  
  // Client details
  client: InvoiceClient;
  
  // Invoice items
  items: InvoiceItem[];
  
  // Financial calculations
  subtotal: number;
  taxes: InvoiceTax[];
  totalTax: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  };
  total: number;
  
  // Payment terms
  paymentTerms: InvoicePaymentTerms;
  
  // Additional info
  notes?: string;
  currency: string;
  language: 'en' | 'es' | 'fr' | 'de';
}

export interface InvoicePDFData {
  invoice: Invoice;
  logo?: string;
  theme: 'professional' | 'modern' | 'minimal' | 'colorful';
}

// Tax rates by country/region
export const taxRates = {
  US: [
    { name: 'Sales Tax', rate: 8.25, description: 'Standard sales tax' },
    { name: 'No Tax', rate: 0, description: 'Tax exempt' }
  ],
  CA: [
    { name: 'GST', rate: 5, description: 'Goods and Services Tax' },
    { name: 'HST', rate: 13, description: 'Harmonized Sales Tax' },
    { name: 'PST', rate: 7, description: 'Provincial Sales Tax' },
    { name: 'No Tax', rate: 0, description: 'Tax exempt' }
  ],
  UK: [
    { name: 'VAT Standard', rate: 20, description: 'Standard VAT rate' },
    { name: 'VAT Reduced', rate: 5, description: 'Reduced VAT rate' },
    { name: 'VAT Zero', rate: 0, description: 'Zero VAT rate' }
  ],
  EU: [
    { name: 'VAT Standard', rate: 19, description: 'Standard VAT rate' },
    { name: 'VAT Reduced', rate: 7, description: 'Reduced VAT rate' },
    { name: 'VAT Zero', rate: 0, description: 'Zero VAT rate' }
  ],
  AU: [
    { name: 'GST', rate: 10, description: 'Goods and Services Tax' },
    { name: 'No Tax', rate: 0, description: 'Tax exempt' }
  ]
};

// Currency options
export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' }
];

// Payment method options
export const paymentMethods = [
  'Bank Transfer',
  'Credit Card',
  'PayPal',
  'Stripe',
  'Wire Transfer',
  'Check',
  'Cash',
  'Cryptocurrency',
  'Direct Debit',
  'ACH Transfer'
];

// Payment terms templates
export const paymentTermsTemplates = [
  {
    name: 'Net 30',
    description: 'Payment due in 30 days',
    days: 30,
    notes: 'Payment is due within 30 days of invoice date.'
  },
  {
    name: 'Net 15',
    description: 'Payment due in 15 days',
    days: 15,
    notes: 'Payment is due within 15 days of invoice date.'
  },
  {
    name: 'Net 7',
    description: 'Payment due in 7 days',
    days: 7,
    notes: 'Payment is due within 7 days of invoice date.'
  },
  {
    name: 'Due on Receipt',
    description: 'Payment due immediately',
    days: 0,
    notes: 'Payment is due immediately upon receipt of this invoice.'
  },
  {
    name: 'Net 60',
    description: 'Payment due in 60 days',
    days: 60,
    notes: 'Payment is due within 60 days of invoice date.'
  }
];

// Invoice themes
export const invoiceThemes = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, business-oriented design',
    primaryColor: '#1f2937',
    accentColor: '#3b82f6'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold colors',
    primaryColor: '#7c3aed',
    accentColor: '#06b6d4'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, clean design',
    primaryColor: '#374151',
    accentColor: '#6b7280'
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant, creative design',
    primaryColor: '#dc2626',
    accentColor: '#f59e0b'
  }
];

// Helper functions
export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${year}${month}-${random}`;
};

export const calculateItemAmount = (quantity: number, rate: number): number => {
  return Math.round((quantity * rate) * 100) / 100;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
};

export const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
  return Math.round((subtotal * (taxRate / 100)) * 100) / 100;
};

export const calculateTotal = (
  subtotal: number, 
  totalTax: number, 
  discount?: { type: 'percentage' | 'fixed'; value: number }
): { total: number; discountAmount: number } => {
  let discountAmount = 0;
  
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = Math.round((subtotal * (discount.value / 100)) * 100) / 100;
    } else {
      discountAmount = discount.value;
    }
  }
  
  const total = Math.round((subtotal + totalTax - discountAmount) * 100) / 100;
  return { total, discountAmount };
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return amount.toString();
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const addDaysToDate = (date: string, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
};

// Sample invoice template
export const createSampleInvoice = (): Partial<Invoice> => {
  const invoiceNumber = generateInvoiceNumber();
  const today = new Date().toISOString().split('T')[0];
  const dueDate = addDaysToDate(today, 30);
  
  return {
    invoiceNumber,
    date: today,
    dueDate,
    status: 'draft',
    company: {
      name: '',
      address: '',
      email: '',
      phone: '',
      website: '',
      taxNumber: ''
    },
    client: {
      name: '',
      address: '',
      email: '',
      phone: '',
      company: ''
    },
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    taxes: [],
    totalTax: 0,
    total: 0,
    paymentTerms: {
      dueDate,
      paymentMethods: ['Bank Transfer'],
      notes: 'Payment is due within 30 days of invoice date.'
    },
    currency: 'USD',
    language: 'en'
  };
};