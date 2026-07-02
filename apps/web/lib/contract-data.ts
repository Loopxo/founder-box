export interface ContractTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  content: string;
  customizationFields: ContractField[];
  clauses: ContractClause[];
}

export interface ContractField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'number' | 'currency' | 'textarea';
  placeholder: string;
  required: boolean;
  section: string;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  optional: boolean;
  category: string;
}

export const contractCategories = [
  {
    id: 'employment',
    name: 'Employment Contracts',
    icon: '👥',
    description: 'Employment agreements, job contracts, and HR documents'
  },
  {
    id: 'business',
    name: 'Business Agreements',
    icon: '🤝',
    description: 'Service agreements, partnerships, and business contracts'
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    icon: '⚖️',
    description: 'NDAs, legal agreements, and compliance documents'
  },
  {
    id: 'property',
    name: 'Property & Real Estate',
    icon: '🏠',
    description: 'Lease agreements, real estate purchases, and property contracts'
  },
  {
    id: 'financial',
    name: 'Financial Agreements',
    icon: '💰',
    description: 'Loan agreements, investment contracts, and financial documents'
  },
  {
    id: 'construction',
    name: 'Construction & Trade',
    icon: '🏗️',
    description: 'Construction contracts, contractor agreements, and trade documents'
  }
];

export const contractTemplates: ContractTemplate[] = [
  // Employment Contracts
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    category: 'employment',
    description: 'Comprehensive employment agreement with terms, conditions, and benefits',
    icon: '👤',
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on [START_DATE] between [COMPANY_NAME], a [COMPANY_STATE] corporation ("Company"), and [EMPLOYEE_NAME] ("Employee").

1. POSITION AND DUTIES
Employee is hired for the position of [JOB_TITLE]. Employee will report to [SUPERVISOR_NAME] and will perform the following duties:
[JOB_DUTIES]

2. COMPENSATION
Employee will receive an annual salary of [ANNUAL_SALARY], payable in [PAY_FREQUENCY] installments. Employee will also be eligible for:
- Health insurance coverage
- [BENEFITS_LIST]
- [VACATION_DAYS] vacation days per year

3. TERM OF EMPLOYMENT
This agreement begins on [START_DATE] and continues until terminated by either party with [NOTICE_PERIOD] notice.

4. CONFIDENTIALITY
Employee agrees to maintain the confidentiality of all proprietary information and trade secrets of the Company.

5. TERMINATION
Either party may terminate this agreement with [NOTICE_PERIOD] written notice. Company may terminate immediately for cause.

6. GOVERNING LAW
This agreement shall be governed by the laws of [GOVERNING_STATE].

Company: [COMPANY_NAME]
By: _______________________
Name: [COMPANY_REP_NAME]
Title: [COMPANY_REP_TITLE]
Date: _____________________

Employee: _________________
[EMPLOYEE_NAME]
Date: _____________________`,
    customizationFields: [
      { id: 'COMPANY_NAME', label: 'Company Name', type: 'text', placeholder: 'ABC Corporation', required: true, section: 'Company Info' },
      { id: 'COMPANY_STATE', label: 'Company State', type: 'text', placeholder: 'Delaware', required: true, section: 'Company Info' },
      { id: 'COMPANY_REP_NAME', label: 'Company Representative Name', type: 'text', placeholder: 'Vijeet Shah', required: true, section: 'Company Info' },
      { id: 'COMPANY_REP_TITLE', label: 'Company Representative Title', type: 'text', placeholder: 'CEO', required: true, section: 'Company Info' },
      { id: 'EMPLOYEE_NAME', label: 'Employee Name', type: 'text', placeholder: 'Loopxo', required: true, section: 'Employee Info' },
      { id: 'JOB_TITLE', label: 'Job Title', type: 'text', placeholder: 'Software Developer', required: true, section: 'Employment Terms' },
      { id: 'SUPERVISOR_NAME', label: 'Supervisor Name', type: 'text', placeholder: 'Mike Johnson', required: true, section: 'Employment Terms' },
      { id: 'JOB_DUTIES', label: 'Job Duties', type: 'textarea', placeholder: 'Develop software applications, participate in code reviews...', required: true, section: 'Employment Terms' },
      { id: 'ANNUAL_SALARY', label: 'Annual Salary', type: 'currency', placeholder: '75000', required: true, section: 'Compensation' },
      { id: 'PAY_FREQUENCY', label: 'Pay Frequency', type: 'text', placeholder: 'bi-weekly', required: true, section: 'Compensation' },
      { id: 'BENEFITS_LIST', label: 'Additional Benefits', type: 'textarea', placeholder: '401k matching, dental insurance', required: false, section: 'Compensation' },
      { id: 'VACATION_DAYS', label: 'Vacation Days per Year', type: 'number', placeholder: '20', required: true, section: 'Compensation' },
      { id: 'START_DATE', label: 'Start Date', type: 'date', placeholder: '', required: true, section: 'Employment Terms' },
      { id: 'NOTICE_PERIOD', label: 'Notice Period', type: 'text', placeholder: '2 weeks', required: true, section: 'Employment Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'non-compete', title: 'Non-Compete Clause', content: 'Employee agrees not to compete with Company for 12 months after termination.', optional: true, category: 'restrictive' },
      { id: 'arbitration', title: 'Arbitration Clause', content: 'Disputes will be resolved through binding arbitration.', optional: true, category: 'legal' }
    ]
  },

  // NDA
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'legal',
    description: 'Protect confidential information with a comprehensive NDA',
    icon: '🔒',
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [EFFECTIVE_DATE] between [DISCLOSING_PARTY] ("Disclosing Party") and [RECEIVING_PARTY] ("Receiving Party").

1. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" includes all information disclosed by Disclosing Party, including but not limited to:
[CONFIDENTIAL_INFO_TYPES]

2. OBLIGATIONS
Receiving Party agrees to:
- Keep all Confidential Information strictly confidential
- Not disclose Confidential Information to third parties without written consent
- Use Confidential Information solely for [PURPOSE]
- Return all materials upon request

3. TERM
This Agreement remains in effect for [TERM_DURATION] from the date first written above.

4. EXCEPTIONS
This Agreement does not apply to information that:
- Is publicly available
- Was known prior to disclosure
- Is independently developed

5. REMEDIES
Breach of this Agreement may cause irreparable harm, and Disclosing Party may seek injunctive relief.

6. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_STATE].

Disclosing Party: [DISCLOSING_PARTY]
Signature: _______________________
Date: ___________________________

Receiving Party: [RECEIVING_PARTY]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'DISCLOSING_PARTY', label: 'Disclosing Party Name', type: 'text', placeholder: 'ABC Corporation', required: true, section: 'Parties' },
      { id: 'RECEIVING_PARTY', label: 'Receiving Party Name', type: 'text', placeholder: 'Vijeet Shah', required: true, section: 'Parties' },
      { id: 'EFFECTIVE_DATE', label: 'Effective Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'CONFIDENTIAL_INFO_TYPES', label: 'Types of Confidential Information', type: 'textarea', placeholder: 'Technical specifications, business plans, customer lists...', required: true, section: 'Confidentiality' },
      { id: 'PURPOSE', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Evaluation of potential business partnership', required: true, section: 'Terms' },
      { id: 'TERM_DURATION', label: 'Term Duration', type: 'text', placeholder: '2 years', required: true, section: 'Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'return-materials', title: 'Return of Materials', content: 'All materials must be returned within 30 days of request.', optional: false, category: 'obligations' },
      { id: 'monetary-damages', title: 'Monetary Damages', content: 'Breach may result in monetary damages of $[AMOUNT].', optional: true, category: 'remedies' }
    ]
  },

  // Service Agreement
  {
    id: 'service-agreement',
    title: 'Service Agreement',
    category: 'business',
    description: 'Professional services contract with detailed scope and terms',
    icon: '🤝',
    content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on [EFFECTIVE_DATE] between [SERVICE_PROVIDER] ("Provider") and [CLIENT_NAME] ("Client").

1. SERVICES
Provider agrees to provide the following services:
[SERVICE_DESCRIPTION]

2. TIMELINE
Services will commence on [START_DATE] and be completed by [END_DATE].
Project milestones:
[MILESTONES]

3. COMPENSATION
Total project cost: [TOTAL_COST]
Payment schedule:
[PAYMENT_SCHEDULE]

4. DELIVERABLES
Provider will deliver:
[DELIVERABLES_LIST]

5. CLIENT RESPONSIBILITIES
Client agrees to:
[CLIENT_RESPONSIBILITIES]

6. INTELLECTUAL PROPERTY
[IP_CLAUSE]

7. WARRANTY
Provider warrants that services will be performed in a professional manner consistent with industry standards.

8. LIMITATION OF LIABILITY
Provider's liability is limited to the total amount paid under this Agreement.

9. TERMINATION
Either party may terminate with [TERMINATION_NOTICE] written notice.

10. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_STATE].

Provider: [SERVICE_PROVIDER]
Signature: _______________________
Date: ___________________________

Client: [CLIENT_NAME]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'SERVICE_PROVIDER', label: 'Service Provider Name', type: 'text', placeholder: 'ABC Consulting LLC', required: true, section: 'Parties' },
      { id: 'CLIENT_NAME', label: 'Client Name', type: 'text', placeholder: 'XYZ Corporation', required: true, section: 'Parties' },
      { id: 'EFFECTIVE_DATE', label: 'Effective Date', type: 'date', placeholder: '', required: true, section: 'Timeline' },
      { id: 'SERVICE_DESCRIPTION', label: 'Service Description', type: 'textarea', placeholder: 'Website development, SEO optimization, content creation...', required: true, section: 'Services' },
      { id: 'START_DATE', label: 'Start Date', type: 'date', placeholder: '', required: true, section: 'Timeline' },
      { id: 'END_DATE', label: 'End Date', type: 'date', placeholder: '', required: true, section: 'Timeline' },
      { id: 'MILESTONES', label: 'Project Milestones', type: 'textarea', placeholder: 'Phase 1: Design completion (Week 2)\nPhase 2: Development (Week 4)...', required: false, section: 'Timeline' },
      { id: 'TOTAL_COST', label: 'Total Cost', type: 'currency', placeholder: '15000', required: true, section: 'Payment' },
      { id: 'PAYMENT_SCHEDULE', label: 'Payment Schedule', type: 'textarea', placeholder: '50% upfront\n25% at milestone 1\n25% upon completion', required: true, section: 'Payment' },
      { id: 'DELIVERABLES_LIST', label: 'Deliverables', type: 'textarea', placeholder: 'Complete website\nSEO report\nUser documentation', required: true, section: 'Services' },
      { id: 'CLIENT_RESPONSIBILITIES', label: 'Client Responsibilities', type: 'textarea', placeholder: 'Provide content and assets\nTimely feedback\nAccess to systems', required: true, section: 'Terms' },
      { id: 'IP_CLAUSE', label: 'Intellectual Property Terms', type: 'textarea', placeholder: 'All work product will be owned by Client upon full payment.', required: true, section: 'Legal' },
      { id: 'TERMINATION_NOTICE', label: 'Termination Notice Period', type: 'text', placeholder: '30 days', required: true, section: 'Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'change-orders', title: 'Change Orders', content: 'Any changes to scope require written approval and may incur additional costs.', optional: true, category: 'modifications' },
      { id: 'force-majeure', title: 'Force Majeure', content: 'Neither party is liable for delays due to circumstances beyond their control.', optional: true, category: 'legal' }
    ]
  },

  // Lease Agreement
  {
    id: 'lease-agreement',
    title: 'Lease Agreement',
    category: 'property',
    description: 'Residential or commercial property lease contract',
    icon: '🏠',
    content: `LEASE AGREEMENT

This Lease Agreement ("Lease") is entered into on [LEASE_DATE] between [LANDLORD_NAME] ("Landlord") and [TENANT_NAME] ("Tenant").

1. PROPERTY
Landlord agrees to lease to Tenant the property located at:
[PROPERTY_ADDRESS]

2. TERM
Lease term: [LEASE_TERM]
Start date: [START_DATE]
End date: [END_DATE]

3. RENT
Monthly rent: [MONTHLY_RENT]
Due date: [RENT_DUE_DATE] of each month
Security deposit: [SECURITY_DEPOSIT]

4. USE OF PROPERTY
Property may be used for: [PERMITTED_USE]

5. UTILITIES
[UTILITIES_RESPONSIBILITY]

6. MAINTENANCE
Landlord responsibilities: [LANDLORD_MAINTENANCE]
Tenant responsibilities: [TENANT_MAINTENANCE]

7. PETS
[PET_POLICY]

8. SUBLETTING
[SUBLETTING_POLICY]

9. TERMINATION
[TERMINATION_TERMS]

10. GOVERNING LAW
This Lease is governed by the laws of [GOVERNING_STATE].

Landlord: [LANDLORD_NAME]
Signature: _______________________
Date: ___________________________

Tenant: [TENANT_NAME]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'LANDLORD_NAME', label: 'Landlord Name', type: 'text', placeholder: 'John Property Owner', required: true, section: 'Parties' },
      { id: 'TENANT_NAME', label: 'Tenant Name', type: 'text', placeholder: 'Jane Renter', required: true, section: 'Parties' },
      { id: 'LEASE_DATE', label: 'Lease Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'PROPERTY_ADDRESS', label: 'Property Address', type: 'textarea', placeholder: '123 Main Street\nAnytown, CA 90210', required: true, section: 'Property' },
      { id: 'LEASE_TERM', label: 'Lease Term', type: 'text', placeholder: '12 months', required: true, section: 'Terms' },
      { id: 'START_DATE', label: 'Start Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'END_DATE', label: 'End Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'MONTHLY_RENT', label: 'Monthly Rent', type: 'currency', placeholder: '2500', required: true, section: 'Financial' },
      { id: 'RENT_DUE_DATE', label: 'Rent Due Date', type: 'text', placeholder: '1st', required: true, section: 'Financial' },
      { id: 'SECURITY_DEPOSIT', label: 'Security Deposit', type: 'currency', placeholder: '2500', required: true, section: 'Financial' },
      { id: 'PERMITTED_USE', label: 'Permitted Use', type: 'text', placeholder: 'Residential purposes only', required: true, section: 'Terms' },
      { id: 'UTILITIES_RESPONSIBILITY', label: 'Utilities Responsibility', type: 'textarea', placeholder: 'Tenant pays electricity, gas, and internet. Landlord pays water and trash.', required: true, section: 'Responsibilities' },
      { id: 'LANDLORD_MAINTENANCE', label: 'Landlord Maintenance', type: 'textarea', placeholder: 'Major repairs, structural issues, HVAC maintenance', required: true, section: 'Responsibilities' },
      { id: 'TENANT_MAINTENANCE', label: 'Tenant Maintenance', type: 'textarea', placeholder: 'Keep property clean, minor repairs under $100, lawn care', required: true, section: 'Responsibilities' },
      { id: 'PET_POLICY', label: 'Pet Policy', type: 'textarea', placeholder: 'No pets allowed / Pets allowed with $500 deposit', required: true, section: 'Policies' },
      { id: 'SUBLETTING_POLICY', label: 'Subletting Policy', type: 'textarea', placeholder: 'Subletting not permitted without written consent', required: true, section: 'Policies' },
      { id: 'TERMINATION_TERMS', label: 'Termination Terms', type: 'textarea', placeholder: '30 days written notice required for termination', required: true, section: 'Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'late-fees', title: 'Late Fees', content: 'Late fee of $50 applies to rent paid after the 5th of the month.', optional: true, category: 'financial' },
      { id: 'property-inspection', title: 'Property Inspection', content: 'Landlord may inspect property with 24-hour notice.', optional: true, category: 'access' }
    ]
  },

  // Loan Agreement
  {
    id: 'loan-agreement',
    title: 'Loan Agreement',
    category: 'financial',
    description: 'Personal or business loan contract with repayment terms',
    icon: '💰',
    content: `LOAN AGREEMENT

This Loan Agreement ("Agreement") is entered into on [LOAN_DATE] between [LENDER_NAME] ("Lender") and [BORROWER_NAME] ("Borrower").

1. LOAN AMOUNT
Lender agrees to loan Borrower the principal sum of [LOAN_AMOUNT].

2. INTEREST RATE
The loan bears interest at [INTEREST_RATE]% per annum.

3. REPAYMENT TERMS
Repayment schedule: [PAYMENT_FREQUENCY]
Payment amount: [PAYMENT_AMOUNT]
First payment due: [FIRST_PAYMENT_DATE]
Final payment due: [FINAL_PAYMENT_DATE]

4. PURPOSE
Loan proceeds will be used for: [LOAN_PURPOSE]

5. SECURITY
[COLLATERAL_DESCRIPTION]

6. DEFAULT
Default occurs if:
- Payment is more than [GRACE_PERIOD] days late
- Borrower becomes insolvent
- [OTHER_DEFAULT_CONDITIONS]

7. ACCELERATION
Upon default, Lender may declare the entire balance immediately due.

8. PREPAYMENT
[PREPAYMENT_TERMS]

9. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_STATE].

Lender: [LENDER_NAME]
Signature: _______________________
Date: ___________________________

Borrower: [BORROWER_NAME]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'LENDER_NAME', label: 'Lender Name', type: 'text', placeholder: 'ABC Bank', required: true, section: 'Parties' },
      { id: 'BORROWER_NAME', label: 'Borrower Name', type: 'text', placeholder: 'Vijeet Shah', required: true, section: 'Parties' },
      { id: 'LOAN_DATE', label: 'Loan Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'LOAN_AMOUNT', label: 'Loan Amount', type: 'currency', placeholder: '50000', required: true, section: 'Financial' },
      { id: 'INTEREST_RATE', label: 'Interest Rate (%)', type: 'number', placeholder: '5.5', required: true, section: 'Financial' },
      { id: 'PAYMENT_FREQUENCY', label: 'Payment Frequency', type: 'text', placeholder: 'Monthly', required: true, section: 'Repayment' },
      { id: 'PAYMENT_AMOUNT', label: 'Payment Amount', type: 'currency', placeholder: '500', required: true, section: 'Repayment' },
      { id: 'FIRST_PAYMENT_DATE', label: 'First Payment Date', type: 'date', placeholder: '', required: true, section: 'Repayment' },
      { id: 'FINAL_PAYMENT_DATE', label: 'Final Payment Date', type: 'date', placeholder: '', required: true, section: 'Repayment' },
      { id: 'LOAN_PURPOSE', label: 'Loan Purpose', type: 'textarea', placeholder: 'Business expansion, equipment purchase, etc.', required: true, section: 'Terms' },
      { id: 'COLLATERAL_DESCRIPTION', label: 'Collateral/Security', type: 'textarea', placeholder: 'Vehicle title, real estate, unsecured', required: true, section: 'Security' },
      { id: 'GRACE_PERIOD', label: 'Grace Period (days)', type: 'number', placeholder: '10', required: true, section: 'Default' },
      { id: 'OTHER_DEFAULT_CONDITIONS', label: 'Other Default Conditions', type: 'textarea', placeholder: 'Violation of loan covenants', required: false, section: 'Default' },
      { id: 'PREPAYMENT_TERMS', label: 'Prepayment Terms', type: 'textarea', placeholder: 'Borrower may prepay without penalty', required: true, section: 'Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'personal-guarantee', title: 'Personal Guarantee', content: 'Borrower personally guarantees repayment of the loan.', optional: true, category: 'security' },
      { id: 'insurance-requirement', title: 'Insurance Requirement', content: 'Borrower must maintain insurance on collateral.', optional: true, category: 'security' }
    ]
  },

  // Partnership Agreement
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    category: 'business',
    description: 'Business partnership contract with profit sharing and responsibilities',
    icon: '🤝',
    content: `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into on [AGREEMENT_DATE] between [PARTNER1_NAME] and [PARTNER2_NAME] (collectively "Partners").

1. PARTNERSHIP NAME
The partnership shall operate under the name: [PARTNERSHIP_NAME]

2. BUSINESS PURPOSE
The purpose of the partnership is: [BUSINESS_PURPOSE]

3. CAPITAL CONTRIBUTIONS
[PARTNER1_NAME] contributes: [PARTNER1_CONTRIBUTION]
[PARTNER2_NAME] contributes: [PARTNER2_CONTRIBUTION]

4. PROFIT AND LOSS SHARING
Profits and losses shall be shared:
[PARTNER1_NAME]: [PARTNER1_PERCENTAGE]%
[PARTNER2_NAME]: [PARTNER2_PERCENTAGE]%

5. MANAGEMENT
[MANAGEMENT_STRUCTURE]

6. DECISION MAKING
[DECISION_MAKING_PROCESS]

7. PARTNER DUTIES
[PARTNER1_NAME] responsibilities: [PARTNER1_DUTIES]
[PARTNER2_NAME] responsibilities: [PARTNER2_DUTIES]

8. COMPENSATION
[COMPENSATION_TERMS]

9. BOOKS AND RECORDS
Partnership books shall be maintained at [RECORDS_LOCATION] and be available for inspection.

10. WITHDRAWAL/DISSOLUTION
[WITHDRAWAL_TERMS]

11. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_STATE].

Partner 1: [PARTNER1_NAME]
Signature: _______________________
Date: ___________________________

Partner 2: [PARTNER2_NAME]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'PARTNER1_NAME', label: 'Partner 1 Name', type: 'text', placeholder: 'Vijeet Shah', required: true, section: 'Partners' },
      { id: 'PARTNER2_NAME', label: 'Partner 2 Name', type: 'text', placeholder: 'Loopxo', required: true, section: 'Partners' },
      { id: 'AGREEMENT_DATE', label: 'Agreement Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'PARTNERSHIP_NAME', label: 'Partnership Name', type: 'text', placeholder: 'Smith & Doe Consulting', required: true, section: 'Business' },
      { id: 'BUSINESS_PURPOSE', label: 'Business Purpose', type: 'textarea', placeholder: 'Provide consulting services in technology and business strategy', required: true, section: 'Business' },
      { id: 'PARTNER1_CONTRIBUTION', label: 'Partner 1 Contribution', type: 'text', placeholder: '$50,000 cash + equipment', required: true, section: 'Capital' },
      { id: 'PARTNER2_CONTRIBUTION', label: 'Partner 2 Contribution', type: 'text', placeholder: '$50,000 cash + expertise', required: true, section: 'Capital' },
      { id: 'PARTNER1_PERCENTAGE', label: 'Partner 1 Profit %', type: 'number', placeholder: '50', required: true, section: 'Financial' },
      { id: 'PARTNER2_PERCENTAGE', label: 'Partner 2 Profit %', type: 'number', placeholder: '50', required: true, section: 'Financial' },
      { id: 'MANAGEMENT_STRUCTURE', label: 'Management Structure', type: 'textarea', placeholder: 'Equal management rights with unanimous consent required for major decisions', required: true, section: 'Management' },
      { id: 'DECISION_MAKING_PROCESS', label: 'Decision Making Process', type: 'textarea', placeholder: 'Majority vote for daily operations, unanimous for major decisions', required: true, section: 'Management' },
      { id: 'PARTNER1_DUTIES', label: 'Partner 1 Duties', type: 'textarea', placeholder: 'Business development, client relations, financial management', required: true, section: 'Responsibilities' },
      { id: 'PARTNER2_DUTIES', label: 'Partner 2 Duties', type: 'textarea', placeholder: 'Technical delivery, project management, quality assurance', required: true, section: 'Responsibilities' },
      { id: 'COMPENSATION_TERMS', label: 'Compensation Terms', type: 'textarea', placeholder: 'Each partner draws $5,000/month plus profit distributions', required: true, section: 'Financial' },
      { id: 'RECORDS_LOCATION', label: 'Records Location', type: 'text', placeholder: '123 Business St, Suite 100', required: true, section: 'Administration' },
      { id: 'WITHDRAWAL_TERMS', label: 'Withdrawal/Dissolution Terms', type: 'textarea', placeholder: '90 days notice required, assets distributed per ownership percentage', required: true, section: 'Terms' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'non-compete', title: 'Non-Compete', content: 'Partners agree not to compete during partnership and for 1 year after.', optional: true, category: 'restrictive' },
      { id: 'buyout-clause', title: 'Buyout Clause', content: 'Remaining partner has right of first refusal on departing partner\'s interest.', optional: true, category: 'transfer' }
    ]
  },

  // Construction Contract
  {
    id: 'construction-contract',
    title: 'Construction Contract',
    category: 'construction',
    description: 'Comprehensive construction agreement with timeline and specifications',
    icon: '🏗️',
    content: `CONSTRUCTION CONTRACT

This Construction Contract ("Contract") is entered into on [CONTRACT_DATE] between [CONTRACTOR_NAME] ("Contractor") and [OWNER_NAME] ("Owner").

1. PROJECT DESCRIPTION
Contractor agrees to provide all labor, materials, and services for:
[PROJECT_DESCRIPTION]

Location: [PROJECT_ADDRESS]

2. CONTRACT PRICE
Total contract price: [CONTRACT_PRICE]
Payment schedule: [PAYMENT_SCHEDULE]

3. TIME FOR COMPLETION
Work shall commence on [START_DATE] and be substantially completed by [COMPLETION_DATE].

4. MATERIALS AND WORKMANSHIP
All materials shall be new and of good quality. Work shall conform to:
[SPECIFICATIONS_STANDARDS]

5. CHANGE ORDERS
[CHANGE_ORDER_TERMS]

6. PERMITS AND APPROVALS
[PERMIT_RESPONSIBILITY]

7. INSURANCE
Contractor shall maintain: [INSURANCE_REQUIREMENTS]

8. WARRANTY
Contractor warrants work for [WARRANTY_PERIOD] from completion.

9. SAFETY
Contractor shall comply with all safety regulations and maintain a safe worksite.

10. DELAY AND LIQUIDATED DAMAGES
[DELAY_TERMS]

11. DISPUTE RESOLUTION
[DISPUTE_RESOLUTION]

12. GOVERNING LAW
This Contract is governed by the laws of [GOVERNING_STATE].

Contractor: [CONTRACTOR_NAME]
License #: [LICENSE_NUMBER]
Signature: _______________________
Date: ___________________________

Owner: [OWNER_NAME]
Signature: _______________________
Date: ___________________________`,
    customizationFields: [
      { id: 'CONTRACTOR_NAME', label: 'Contractor Name', type: 'text', placeholder: 'ABC Construction LLC', required: true, section: 'Parties' },
      { id: 'OWNER_NAME', label: 'Owner Name', type: 'text', placeholder: 'John Property Owner', required: true, section: 'Parties' },
      { id: 'CONTRACT_DATE', label: 'Contract Date', type: 'date', placeholder: '', required: true, section: 'Terms' },
      { id: 'PROJECT_DESCRIPTION', label: 'Project Description', type: 'textarea', placeholder: 'Construction of single-family residence, 2,500 sq ft, 3 bedrooms, 2 bathrooms', required: true, section: 'Project' },
      { id: 'PROJECT_ADDRESS', label: 'Project Address', type: 'textarea', placeholder: '456 Build Street\nConstruction City, CA 90210', required: true, section: 'Project' },
      { id: 'CONTRACT_PRICE', label: 'Contract Price', type: 'currency', placeholder: '350000', required: true, section: 'Financial' },
      { id: 'PAYMENT_SCHEDULE', label: 'Payment Schedule', type: 'textarea', placeholder: '10% down, progress payments at milestones, 5% retention until completion', required: true, section: 'Financial' },
      { id: 'START_DATE', label: 'Start Date', type: 'date', placeholder: '', required: true, section: 'Timeline' },
      { id: 'COMPLETION_DATE', label: 'Completion Date', type: 'date', placeholder: '', required: true, section: 'Timeline' },
      { id: 'SPECIFICATIONS_STANDARDS', label: 'Specifications/Standards', type: 'textarea', placeholder: 'Plans dated [date], local building codes, manufacturer specifications', required: true, section: 'Quality' },
      { id: 'CHANGE_ORDER_TERMS', label: 'Change Order Terms', type: 'textarea', placeholder: 'Changes require written approval and may affect price and schedule', required: true, section: 'Changes' },
      { id: 'PERMIT_RESPONSIBILITY', label: 'Permit Responsibility', type: 'textarea', placeholder: 'Contractor obtains building permits, Owner obtains zoning approvals', required: true, section: 'Legal' },
      { id: 'INSURANCE_REQUIREMENTS', label: 'Insurance Requirements', type: 'textarea', placeholder: 'General liability $1M, Workers comp as required by law', required: true, section: 'Insurance' },
      { id: 'WARRANTY_PERIOD', label: 'Warranty Period', type: 'text', placeholder: '1 year', required: true, section: 'Quality' },
      { id: 'DELAY_TERMS', label: 'Delay Terms', type: 'textarea', placeholder: 'Time extensions for weather, Owner delays, change orders', required: true, section: 'Timeline' },
      { id: 'DISPUTE_RESOLUTION', label: 'Dispute Resolution', type: 'textarea', placeholder: 'Mediation first, then binding arbitration', required: true, section: 'Legal' },
      { id: 'LICENSE_NUMBER', label: 'Contractor License Number', type: 'text', placeholder: 'C-123456', required: true, section: 'Legal' },
      { id: 'GOVERNING_STATE', label: 'Governing State', type: 'text', placeholder: 'California', required: true, section: 'Legal' }
    ],
    clauses: [
      { id: 'lien-waiver', title: 'Lien Waiver', content: 'Contractor provides lien waivers with each payment.', optional: true, category: 'financial' },
      { id: 'cleanup', title: 'Site Cleanup', content: 'Contractor maintains clean worksite and removes debris.', optional: true, category: 'worksite' }
    ]
  }
];

export const standardClauses = {
  legal: [
    { id: 'governing-law', title: 'Governing Law', content: 'This agreement shall be governed by the laws of [STATE].' },
    { id: 'severability', title: 'Severability', content: 'If any provision is invalid, the remainder shall remain in effect.' },
    { id: 'entire-agreement', title: 'Entire Agreement', content: 'This agreement constitutes the entire agreement between parties.' }
  ],
  financial: [
    { id: 'late-payment', title: 'Late Payment', content: 'Late payments incur 1.5% monthly interest charge.' },
    { id: 'currency', title: 'Currency', content: 'All amounts are in US Dollars unless otherwise specified.' }
  ],
  termination: [
    { id: 'termination-notice', title: 'Termination Notice', content: 'Either party may terminate with 30 days written notice.' },
    { id: 'survival', title: 'Survival', content: 'Certain provisions survive termination of this agreement.' }
  ]
};