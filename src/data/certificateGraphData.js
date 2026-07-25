// Certificate Graph Data Model for Indian Government Services
// Supports swappable per-state datasets with shared anchor nodes (Aadhaar, PAN, DigiLocker, etc.)

export const ANCHOR_DOCUMENTS = [
  { id: "aadhaar", name: "Aadhaar Card", category: "identity", anchor: true, desc: "UIDAI 12-digit UID card with mobile linked" },
  { id: "pan_card", name: "PAN Card", category: "identity", anchor: true, desc: "Income Tax Permanent Account Number" },
  { id: "ration_card", name: "Ration Card (Smart/Family)", category: "residence", anchor: true, desc: "APL/BPL/AAY Family Ration Card" },
  { id: "voter_id", name: "Voter ID (EPIC)", category: "identity", anchor: true, desc: "Election Commission Identity Card" },
  { id: "digilocker_acc", name: "DigiLocker Account", category: "digital", anchor: true, desc: "Government verified digital repository" },
  { id: "sslc_marksheet", name: "10th / SSLC Certificate", category: "education", anchor: true, desc: "Proof of date of birth & parent name" },
  { id: "electricity_bill", name: "Recent Electricity / Water Bill", category: "residence", anchor: false, desc: "Proof of current physical address (< 3 months old)" },
  { id: "salary_slip", name: "Form 16 / Salary Certificate", category: "income", anchor: false, desc: "Issued by employer or DDO" },
  { id: "it_returns", name: "Income Tax Returns (ITR)", category: "income", anchor: false, desc: "Latest 3 years ITR acknowledgement" },
  { id: "land_tax_receipt", name: "Land Tax Receipt / Khata / Patta", category: "property", anchor: false, desc: "Latest land revenue payment receipt" },
  { id: "parent_caste_cert", name: "Parent's Caste / Community Certificate", category: "family", anchor: false, desc: "Father/Mother/Sibling official caste cert" },
  { id: "parent_school_leaving", name: "Parent's School Transfer Certificate (TC)", category: "family", anchor: false, desc: "Shows community/caste of parent" },
  { id: "passport_photo", name: "Passport Size Photographs", category: "photo", anchor: true, desc: "Recent color photo with white background" },
  { id: "hospital_birth_report", name: "Hospital Birth Slip / Discharge Record", category: "vital", anchor: false, desc: "Issued by Medical Officer / Nursing Home" },
  { id: "medical_death_summary", name: "Medical Certificate of Cause of Death", category: "vital", anchor: false, desc: "Form 4/4A issued by attending doctor" },
  { id: "marriage_invitation_photo", name: "Marriage Invitation Card & Wedding Photos", category: "vital", anchor: false, desc: "Proof of solemnization & ceremony" },
  { id: "notarized_affidavit", name: "Notarized Stamp Paper Affidavit", category: "legal", anchor: false, desc: "₹100 Non-judicial stamp paper affidavit" },
  { id: "medical_board_disability_report", name: "District Medical Board Assessment Report", category: "disability", anchor: false, desc: "3-Doctor panel assessment for PwD" },
  { id: "bank_passbook", name: "Bank Passbook with Photo (Attested)", category: "finance", anchor: false, desc: "Nationalized Bank account proof" },
  { id: "building_plan_approval", name: "Approved Building Blueprint Plan", category: "property", anchor: false, desc: "Sanctioned layout by Corporation / Municipality" }
];

export const TARGET_CERTIFICATES = [
  // Revenue & Community
  { id: "income_cert", name: "Income Certificate", category: "revenue", desc: "For scholarships, fee waivers, & welfare schemes" },
  { id: "caste_cert", name: "Caste / Community Certificate", category: "revenue", desc: "For reservation in education & government jobs" },
  { id: "domicile_cert", name: "Domicile / Residence Certificate", category: "residence", desc: "Proof of residence in state for > 5-10 years" },
  { id: "obc_ncl_cert", name: "OBC Non-Creamy-Layer Certificate", category: "revenue", desc: "Central & State OBC reservation benefit (< ₹8 Lakh p.a.)" },
  { id: "nativity_cert", name: "Nativity Certificate", category: "residence", desc: "Proof of birth or ancestral origin in state" },
  { id: "ews_cert", name: "Economically Weaker Section (EWS) Certificate", category: "revenue", desc: "10% reservation for General category with < ₹8L income" },
  { id: "solvency_cert", name: "Solvency Certificate", category: "revenue", desc: "Financial capability proof for tenders & bail" },
  { id: "legal_heir_cert", name: "Legal Heir / Succession Certificate", category: "legal", desc: "Claiming bank accounts, pension, & ancestral property" },
  { id: "family_membership_cert", name: "Family Membership / Vanshavali Cert", category: "family", desc: "Family tree verification for government schemes" },
  { id: "non_remarriage_cert", name: "Non-Remarriage / Single Status Cert", category: "family", desc: "For widow pension, family pension & remarriage verification" },
  { id: "one_and_same_cert", name: "One-and-the-Same Person Certificate", category: "legal", desc: "Resolving spelling/name differences across documents" },
  { id: "possession_valuation_cert", name: "Land Possession & Valuation Cert", category: "property", desc: "Property ownership & valuation proof for loans & court" },
  { id: "dependent_cert", name: "Dependent Certificate (Ex-Serviceman/Freedom Fighter)", category: "family", desc: "Special quota for military & freedom fighter families" },
  { id: "intercaste_marriage_cert", name: "Inter-caste Marriage Certificate", category: "social", desc: "Government incentive scheme for inter-caste couples" },
  { id: "farmer_cert", name: "Agriculturalist / Farmer Identity Certificate", category: "revenue", desc: "PM-Kisan, agricultural loans, & subsidized inputs" },
  { id: "unemployment_cert", name: "Unemployment / Jobless Certificate", category: "employment", desc: "Exemption fees, age relaxation & unemployment allowance" },

  // Civil & Vital
  { id: "birth_cert", name: "Birth Certificate", category: "vital", desc: "Official birth registration under RBD Act 1969" },
  { id: "death_cert", name: "Death Certificate", category: "vital", desc: "Official death record for insurance & bank settlement" },
  { id: "marriage_cert", name: "Marriage Certificate", category: "vital", desc: "Registration under Special or Personal Marriage Acts" },
  { id: "pwd_udid_cert", name: "Disability Certificate & UDID Card", category: "disability", desc: "Unique Disability ID card for welfare & transport concession" },
  { id: "senior_citizen_cert", name: "Senior Citizen Identity Card", category: "civil", desc: "Age proof for senior citizen pension & railway/bus pass" },
  { id: "transgender_id_cert", name: "Transgender Identity Card & Certificate", category: "civil", desc: "Official gender identity card under National Portal" },
  { id: "surviving_member_cert", name: "Surviving Family Member Certificate", category: "family", desc: "Compassionate appointment & death relief claim" },

  // Education
  { id: "transfer_cert", name: "School / College Transfer Certificate (TC)", category: "education", desc: "Leaving institution & conduct proof for fresh admission" },
  { id: "migration_cert", name: "Migration Certificate", category: "education", desc: "Transferring between different educational boards / universities" },
  { id: "conduct_character_cert", name: "Character & Conduct Certificate", category: "education", desc: "Issued by head of institution / police station" },
  { id: "study_cert", name: "7-Year Continuous Study Certificate", category: "education", desc: "Proving local candidate status in state admissions" },
  { id: "gap_cert", name: "Educational Gap / Break Affidavit", category: "education", desc: "Explaining break in studies for college admission" },
  { id: "equivalence_cert", name: "Education Board Equivalence Certificate", category: "education", desc: "Validating foreign or non-state education board degrees" },

  // Business & Commerce
  { id: "trade_license", name: "Municipal Trade / Business License", category: "business", desc: "Mandatory for running shops, offices, & commercial establishments" },
  { id: "fssai_license", name: "Food Safety (FSSAI) Registration & License", category: "business", desc: "Mandatory for food businesses, restaurants, & catering" },
  { id: "udyam_msme_cert", name: "MSME Udyam Registration Certificate", category: "business", desc: "Govt subsidies, priority loans, & tax benefits for small business" },
  { id: "fire_noc_cert", name: "Fire & Rescue Safety NOC Certificate", category: "safety", desc: "Mandatory safety clearance for commercial & public buildings" },
  { id: "building_occupancy_cert", name: "Building Occupancy / Fitness Certificate", category: "property", desc: "Clearing building for human habitation & commercial power connection" },

  // Transport & Driving
  { id: "driving_license", name: "Driving License (LL & Permanent DL)", category: "transport", desc: "RTO driving permit for LMV / MCWG / Transport" },
  { id: "vehicle_rc", name: "Vehicle Registration Certificate (RC)", category: "transport", desc: "RTO motor vehicle ownership Smart Card" },
  { id: "vehicle_fitness_cert", name: "Commercial Vehicle Fitness Certificate (FC)", category: "transport", desc: "RTO mandatory roadworthiness test for commercial transport" },
  { id: "puc_cert", name: "Pollution Under Control (PUC) Certificate", category: "transport", desc: "Mandatory emission check for all motor vehicles" }
];

export const STATE_DATASETS = {
  kerala: {
    stateName: "Kerala",
    portalName: "e-District Kerala, Sevana, & Akshaya Kendras",
    nodes: {
      income_cert: { name: "Income Certificate", level: "Village / Akshaya", issueOffice: "Village Office / Akshaya" },
      caste_cert: { name: "Caste / Community Certificate", level: "Village / Akshaya", issueOffice: "Village Office / Akshaya" },
      domicile_cert: { name: "Residence / Domicile Certificate", level: "Village / Akshaya", issueOffice: "Village Office" },
      obc_ncl_cert: { name: "OBC Non-Creamy-Layer Certificate", level: "Taluk Revenue Office", issueOffice: "Taluk Office / Tehsildar" },
      nativity_cert: { name: "Nativity Certificate", level: "Village Office", issueOffice: "Village Office" },
      ews_cert: { name: "EWS Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      solvency_cert: { name: "Solvency Certificate", level: "Taluk Office", issueOffice: "Tehsildar / Collectorate" },
      legal_heir_cert: { name: "Legal Heir Certificate", level: "Taluk Office", issueOffice: "Tehsildar / Revenue Inspector" },
      family_membership_cert: { name: "Family Membership Certificate", level: "Village Office", issueOffice: "Village Officer" },
      non_remarriage_cert: { name: "Non-Remarriage Certificate", level: "Village Office", issueOffice: "Village Officer" },
      one_and_same_cert: { name: "One and Same Certificate", level: "Village Office", issueOffice: "Village Officer" },
      possession_valuation_cert: { name: "Possession & Valuation Cert", level: "Village Office", issueOffice: "Village Officer" },
      dependent_cert: { name: "Dependent Certificate", level: "Zilla Sainik Welfare / Taluk", issueOffice: "Zilla Sainik Welfare Officer" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Certificate", level: "Village Office", issueOffice: "Village Officer" },
      farmer_cert: { name: "Agriculturalist Certificate", level: "Krishi Bhavan", issueOffice: "Agricultural Officer (Krishi Bhavan)" },
      unemployment_cert: { name: "Unemployment Certificate", level: "Employment Exchange / Village", issueOffice: "Village Officer / Employment Officer" },

      birth_cert: { name: "Birth Certificate", level: "LSGD / Municipality", issueOffice: "Grama Panchayat / Municipal Registrar" },
      death_cert: { name: "Death Certificate", level: "LSGD / Municipality", issueOffice: "Grama Panchayat / Municipal Registrar" },
      marriage_cert: { name: "Marriage Certificate (Sevana)", level: "Sub Registrar / LSGD", issueOffice: "Sub Registrar Office (SRO) / Municipality" },
      pwd_udid_cert: { name: "UDID Disability Card", level: "District Medical Board", issueOffice: "District Medical Officer (DMO)" },
      senior_citizen_cert: { name: "Senior Citizen ID Card", level: "Social Justice Dept", issueOffice: "Akshaya / Social Justice Officer" },
      transgender_id_cert: { name: "Transgender Identity Card", level: "Social Justice Dept", issueOffice: "District Social Justice Officer" },
      surviving_member_cert: { name: "Surviving Member Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },

      transfer_cert: { name: "Transfer Certificate (TC)", level: "School / College", issueOffice: "Headmaster / Principal" },
      migration_cert: { name: "Migration Certificate", level: "University / DHSE", issueOffice: "Pareeksha Bhavan / Controller of Exams" },
      conduct_character_cert: { name: "Conduct Certificate", level: "Educational / Police", issueOffice: "Principal / Police Station" },
      study_cert: { name: "Continuous Study Certificate", level: "School / AEO", issueOffice: "Assistant Educational Officer (AEO)" },
      gap_cert: { name: "Educational Gap Certificate", level: "Notary / Village", issueOffice: "Notary Public / Village Officer" },
      equivalence_cert: { name: "Equivalence Certificate", level: "University", issueOffice: "University Academic Branch" },

      trade_license: { name: "LSGD Trade License", level: "Municipality / Panchayat", issueOffice: "Secretary, Grama Panchayat / Corporation" },
      fssai_license: { name: "FSSAI Food Registration", level: "Food Safety Dept", issueOffice: "Designated Food Safety Officer" },
      udyam_msme_cert: { name: "Udyam MSME Registration", level: "MSME Ministry", issueOffice: "District Industries Centre (DIC)" },
      fire_noc_cert: { name: "Fire Safety NOC", level: "Fire & Rescue Dept", issueOffice: "Divisional Fire Officer" },
      building_occupancy_cert: { name: "Building Occupancy Cert", level: "LSGD Engineering", issueOffice: "Assistant Engineer (LSGD)" },

      driving_license: { name: "Driving License (RTO)", level: "MVD Kerala", issueOffice: "Sub-RTO / Joint RTO" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "MVD Kerala", issueOffice: "RTO / Sub-RTO" },
      vehicle_fitness_cert: { name: "Vehicle Fitness Certificate", level: "RTO Testing Station", issueOffice: "Motor Vehicle Inspector (MVI)" },
      puc_cert: { name: "Pollution Under Control (PUC)", level: "Authorized Station", issueOffice: "Computerized Testing Centre" },

      vo_field_report: { name: "Village Officer Field Enquiry Report", level: "Village Office", issueOffice: "Village Officer" },
      gazetted_attestation: { name: "Gazetted Officer Self-Declaration", level: "Local Officer", issueOffice: "Govt Officer" }
    },

    routes: {
      domicile_cert: [
        { id: "dom_kerala_r1", label: "Village Officer Verification Route", prerequisites: ["aadhaar", "ration_card", "electricity_bill"], visits: 1, days: 3, fee: 28, office: "Village Office / Akshaya", tips: "Upload color scan of Ration Card showing applicant name." },
        { id: "dom_kerala_r2", label: "SSLC + Aadhaar Route", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 4, fee: 28, office: "Akshaya Kendra Online", tips: "SSLC certificate must state school place in Kerala." }
      ],
      income_cert: [
        { id: "inc_kerala_r1", label: "Salary Slip / Form 16 Route", prerequisites: ["aadhaar", "ration_card", "salary_slip", "domicile_cert"], visits: 1, days: 4, fee: 28, office: "Village Office / Akshaya Portal", tips: "Form 16 signed by employer speeds up approval." },
        { id: "inc_kerala_r2", label: "Village Officer Field Visit Route", prerequisites: ["aadhaar", "ration_card", "land_tax_receipt", "vo_field_report"], visits: 2, days: 7, fee: 28, office: "Village Office", tips: "Requires Village Officer spot enquiry or ward member recommendation." }
      ],
      caste_cert: [
        { id: "caste_kerala_r1", label: "Parent Caste Certificate Fast-Track", prerequisites: ["aadhaar", "ration_card", "parent_caste_cert", "sslc_marksheet"], visits: 1, days: 4, fee: 28, office: "Akshaya Kendra / Village Office", tips: "Direct match with parent's certificate avoids committee hearing." }
      ],
      obc_ncl_cert: [
        { id: "obc_kerala_r1", label: "Income + Caste Certificate Linked Route", prerequisites: ["aadhaar", "income_cert", "caste_cert", "ration_card"], visits: 1, days: 5, fee: 50, office: "Taluk Office / Tehsildar", tips: "Combines valid Income and Caste certificates." }
      ],
      nativity_cert: [
        { id: "nat_kerala_r1", label: "Birth Place / School Record Route", prerequisites: ["aadhaar", "sslc_marksheet", "domicile_cert"], visits: 1, days: 4, fee: 28, office: "Village Office", tips: "Issued when birth or 10+ years schooling occurred in Kerala." }
      ],
      ews_cert: [
        { id: "ews_kerala_r1", label: "Income + Land Tax Route", prerequisites: ["aadhaar", "income_cert", "land_tax_receipt", "ration_card"], visits: 2, days: 7, fee: 50, office: "Tehsildar Office", tips: "Verifies family land < 5 acres and house plot < 1000 sq ft." }
      ],
      solvency_cert: [
        { id: "sol_kerala_r1", label: "Property Valuation Route", prerequisites: ["aadhaar", "land_tax_receipt", "pan_card"], visits: 2, days: 12, fee: 100, office: "Taluk Office / Revenue Inspector", tips: "Revenue Inspector visits property to assess valuation." }
      ],
      legal_heir_cert: [
        { id: "lheir_ker_r1", label: "Notice Gazette Publication Route", prerequisites: ["aadhaar", "death_cert", "ration_card", "vo_field_report"], visits: 2, days: 21, fee: 75, office: "Taluk Revenue Office", tips: "Requires 14-day public notice invitation in Village office notice board." }
      ],
      family_membership_cert: [
        { id: "fam_ker_r1", label: "Ration Card + Village Officer Route", prerequisites: ["aadhaar", "ration_card", "vo_field_report"], visits: 1, days: 4, fee: 28, office: "Village Office", tips: "Directly lists all resident family members." }
      ],
      non_remarriage_cert: [
        { id: "nonrem_ker_r1", label: "Self Declaration + Gazette Attestation", prerequisites: ["aadhaar", "death_cert", "notarized_affidavit"], visits: 1, days: 3, fee: 28, office: "Village Office", tips: "Required annually for family pension distribution." }
      ],
      one_and_same_cert: [
        { id: "onesame_ker_r1", label: "Gazetted Affidavit + Certificate Match", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 4, fee: 28, office: "Village Office", tips: "Resolves initial expansions (e.g., Rajesh V vs Rajesh Varma)." }
      ],
      possession_valuation_cert: [
        { id: "poss_ker_r1", label: "Land Thandaper Ledger Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 1, days: 5, fee: 50, office: "Village Office", tips: "Extracts current fair value & area from Village land register." }
      ],
      dependent_cert: [
        { id: "dep_ker_r1", label: "Discharge Book + Zilla Sainik Board Route", prerequisites: ["aadhaar", "ration_card", "passport_photo"], visits: 1, days: 7, fee: 0, office: "Zilla Sainik Welfare Office", tips: "For ex-servicemen children education & employment quota." }
      ],
      intercaste_marriage_cert: [
        { id: "interc_ker_r1", label: "Marriage Registration + Parent Caste Cert", prerequisites: ["aadhaar", "marriage_cert", "caste_cert"], visits: 1, days: 7, fee: 28, office: "Village Office", tips: "Required for inter-caste couple welfare grants." }
      ],
      farmer_cert: [
        { id: "farm_ker_r1", label: "Land Tax + Krishi Bhavan Registration", prerequisites: ["aadhaar", "land_tax_receipt", "bank_passbook"], visits: 1, days: 3, fee: 0, office: "Krishi Bhavan", tips: "Registers farmer in AIMS Kerala portal for crop damage relief." }
      ],
      unemployment_cert: [
        { id: "unemp_ker_r1", label: "Education Cert + Village Self-Declaration", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 4, fee: 28, office: "Village Office / Akshaya", tips: "Confirms non-employment status for government scheme waivers." }
      ],

      // Civil
      birth_cert: [
        { id: "birth_ker_r1", label: "Hospital Notification Sevana Portal Route", prerequisites: ["aadhaar", "hospital_birth_report"], visits: 1, days: 2, fee: 0, office: "Grama Panchayat / Municipal Registrar", tips: "Free if registered within 21 days of birth." }
      ],
      death_cert: [
        { id: "death_ker_r1", label: "Medical Summary + LSGD Registration", prerequisites: ["aadhaar", "medical_death_summary"], visits: 1, days: 2, fee: 0, office: "Municipal / Panchayat Registrar", tips: "Register within 21 days of occurrence." }
      ],
      marriage_cert: [
        { id: "marr_ker_r1", label: "Sevana LSGD Common Marriage Route", prerequisites: ["aadhaar", "sslc_marksheet", "marriage_invitation_photo"], visits: 1, days: 3, fee: 100, office: "Grama Panchayat / Local Body Registrar", tips: "Requires 2 witnesses with Aadhaar cards." }
      ],
      pwd_udid_cert: [
        { id: "pwd_ker_r1", label: "District Medical Board Assessment", prerequisites: ["aadhaar", "passport_photo", "medical_board_disability_report"], visits: 1, days: 14, fee: 0, office: "District General Hospital", tips: "Issued for > 40% permanent disability." }
      ],
      senior_citizen_cert: [
        { id: "snr_ker_r1", label: "Aadhaar / SSLC Age Verification", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 3, fee: 25, office: "Akshaya Kendra / Social Justice Dept", tips: "Applicable for citizens aged 60 and above." }
      ],
      transgender_id_cert: [
        { id: "trans_ker_r1", label: "National Portal Self-Declaration Route", prerequisites: ["aadhaar", "passport_photo"], visits: 0, days: 7, fee: 0, office: "National Transgender Portal (Online)", tips: "No medical exam required under 2019 Rules." }
      ],
      surviving_member_cert: [
        { id: "surv_ker_r1", label: "Village Officer Enquiry Route", prerequisites: ["aadhaar", "death_cert", "ration_card", "vo_field_report"], visits: 2, days: 10, fee: 28, office: "Taluk Office", tips: "Quick relief certificate for family pension." }
      ],

      // Education
      transfer_cert: [
        { id: "tc_ker_r1", label: "No-Dues Direct School Issue", prerequisites: ["sslc_marksheet"], visits: 1, days: 1, fee: 0, office: "School / College Office", tips: "Obtain clearance from library, lab, & fee counters." }
      ],
      migration_cert: [
        { id: "mig_ker_r1", label: "Board / University Online Portal", prerequisites: ["sslc_marksheet", "transfer_cert"], visits: 1, days: 3, fee: 250, office: "Pareeksha Bhavan / University Portal", tips: "Issued upon submitting original TC." }
      ],
      conduct_character_cert: [
        { id: "char_ker_r1", label: "School / Police Clearance Route", prerequisites: ["aadhaar", "passport_photo"], visits: 1, days: 2, fee: 50, office: "Institution / Police Station", tips: "Required for passport, study abroad & govt jobs." }
      ],
      study_cert: [
        { id: "std_ker_r1", label: "7-Year Continuous Study Record", prerequisites: ["sslc_marksheet"], visits: 1, days: 2, fee: 0, office: "School Headmaster / AEO", tips: "Countersigned by AEO / DEO for state quota." }
      ],
      gap_cert: [
        { id: "gap_ker_r1", label: "Notarized Stamp Paper Affidavit", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 1, fee: 100, office: "Advocate Notary Public", tips: "States reason for break (preparation, illness, etc.)." }
      ],
      equivalence_cert: [
        { id: "equiv_ker_r1", label: "University Academic Equivalence Board", prerequisites: ["sslc_marksheet", "migration_cert"], visits: 1, days: 10, fee: 500, office: "University Academic Section", tips: "Validates non-state or CBSE/ICSE board equivalence." }
      ],

      // Business & Safety
      trade_license: [
        { id: "trade_ker_r1", label: "K-SWIFT / LSGD Business Portal", prerequisites: ["aadhaar", "building_plan_approval", "electricity_bill"], visits: 1, days: 3, fee: 500, office: "Grama Panchayat / Corporation", tips: "Auto-issued under Kerala Investment Promotion Act." }
      ],
      fssai_license: [
        { id: "fssai_ker_r1", label: "FoSCoS FSSAI Online Portal", prerequisites: ["aadhaar", "passport_photo", "electricity_bill"], visits: 0, days: 2, fee: 100, office: "FoSCoS Portal (Online)", tips: "Instant registration for food vendors with turnover < ₹12 Lakh." }
      ],
      udyam_msme_cert: [
        { id: "udyam_ker_r1", label: "Udyam Aadhaar Link Portal", prerequisites: ["aadhaar", "pan_card", "bank_passbook"], visits: 0, days: 1, fee: 0, office: "Udyam Portal (Online)", tips: "Free online registration linked with PAN & GST." }
      ],
      fire_noc_cert: [
        { id: "fire_ker_r1", label: "K-SWIFT Fire Safety Audit", prerequisites: ["building_plan_approval", "electricity_bill"], visits: 2, days: 14, fee: 1000, office: "Fire & Rescue Division", tips: "Mandatory inspection of fire extinguishers & hose reels." }
      ],
      building_occupancy_cert: [
        { id: "occ_ker_r1", label: "LSGD AE Completion Audit", prerequisites: ["building_plan_approval", "land_tax_receipt"], visits: 2, days: 10, fee: 350, office: "Panchayat / Municipal AE Office", tips: "Assistant Engineer inspects structure against approved plan." }
      ],

      // Transport
      driving_license: [
        { id: "dl_ker_r1", label: "Parivahan Sarathi LL + DL Test", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 2, days: 30, fee: 950, office: "Joint RTO / Testing Ground", tips: "Requires passing online LL test followed by ground driving test." }
      ],
      vehicle_rc: [
        { id: "rc_ker_r1", label: "Dealer e-vahan Automated Registration", prerequisites: ["aadhaar", "puc_cert", "pan_card"], visits: 0, days: 5, fee: 600, office: "RTO Portal / Dealer", tips: "Delivered to home address via Speed Post." }
      ],
      vehicle_fitness_cert: [
        { id: "fc_ker_r1", label: "Automated RTO Track Inspection", prerequisites: ["vehicle_rc", "puc_cert"], visits: 1, days: 1, fee: 600, office: "RTO Fitness Track", tips: "Mandatory annually for commercial vehicles." }
      ],
      puc_cert: [
        { id: "puc_ker_r1", label: "Computerized Smoke Testing", prerequisites: ["vehicle_rc"], visits: 1, days: 1, fee: 100, office: "Authorized Emission Centre", tips: "Valid for 6-12 months across India." }
      ],

      vo_field_report: [
        { id: "vo_rep_r1", label: "Village Officer Spot Survey", prerequisites: ["aadhaar", "electricity_bill"], visits: 1, days: 2, fee: 0, office: "Village Office", tips: "Visit Village Officer during morning public hours." }
      ]
    }
  },

  karnataka: {
    stateName: "Karnataka",
    portalName: "Seva Sindhu, K guarantee, & Nada Kacheri",
    nodes: {
      income_cert: { name: "Income Certificate (RD Number)", level: "Nada Kacheri", issueOffice: "Tehsildar / Nada Kacheri" },
      caste_cert: { name: "Caste & Income Certificate (Form F/G)", level: "Nada Kacheri", issueOffice: "Nada Kacheri / Grama One" },
      domicile_cert: { name: "Residence Certificate", level: "Nada Kacheri", issueOffice: "Nada Kacheri" },
      obc_ncl_cert: { name: "OBC Category 1/2A/2B/3A/3B Cert", level: "Taluk Office", issueOffice: "Tehsildar" },
      nativity_cert: { name: "Nativity Certificate", level: "Nada Kacheri", issueOffice: "Nada Kacheri" },
      ews_cert: { name: "EWS Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      solvency_cert: { name: "Solvency Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      legal_heir_cert: { name: "Survivorship / Legal Heir Cert", level: "Taluk Office", issueOffice: "Tehsildar" },
      family_membership_cert: { name: "Family Tree (Vanshavali) Cert", level: "Hobli RI Office", issueOffice: "Revenue Inspector" },
      non_remarriage_cert: { name: "Non-Remarriage Certificate", level: "Nada Kacheri", issueOffice: "Tehsildar" },
      one_and_same_cert: { name: "One and Same Person Cert", level: "Nada Kacheri", issueOffice: "Tehsildar" },
      possession_valuation_cert: { name: "RTC & Land Possession Cert", level: "Bhoomi Portal", issueOffice: "Village Accountant (VA)" },
      dependent_cert: { name: "Ex-Serviceman Dependent Cert", level: "Sainik Welfare Dept", issueOffice: "Deputy Director Sainik Welfare" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Cert", level: "Social Welfare Dept", issueOffice: "Taluk Social Welfare Officer" },
      farmer_cert: { name: "Farmer Certificate (FRUITS ID)", level: "Raitha Samparka Kendra", issueOffice: "Agriculture Officer" },
      unemployment_cert: { name: "Unemployment Certificate", level: "Nada Kacheri", issueOffice: "Tehsildar" },

      birth_cert: { name: "Birth Certificate (e-Janma)", level: "Urban Local Body / Grama", issueOffice: "Health Officer / VA" },
      death_cert: { name: "Death Certificate (e-Janma)", level: "Urban Local Body / Grama", issueOffice: "Health Officer / VA" },
      marriage_cert: { name: "Kaveri Marriage Registration", level: "Sub Registrar", issueOffice: "Sub Registrar Office (SRO)" },
      pwd_udid_cert: { name: "UDID Disability Certificate", level: "District Hospital", issueOffice: "District Surgeon" },
      senior_citizen_cert: { name: "Senior Citizen Identity Card", level: "Senior Citizen Dept", issueOffice: "Seva Sindhu / Bangalore One" },
      transgender_id_cert: { name: "Transgender Identity Card", level: "District Collectorate", issueOffice: "Deputy Commissioner" },
      surviving_member_cert: { name: "Surviving Member Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },

      transfer_cert: { name: "School / College TC", level: "Institution", issueOffice: "Principal" },
      migration_cert: { name: "Migration Certificate", level: "KSEEB / University", issueOffice: "Registrar Evaluation" },
      conduct_character_cert: { name: "Character Certificate", level: "Police / School", issueOffice: "Police Station / Principal" },
      study_cert: { name: "7-Year Study Cert (BEO Counter-Signed)", level: "BEO Office", issueOffice: "Block Education Officer" },
      gap_cert: { name: "Educational Gap Affidavit", level: "Notary", issueOffice: "Advocate Notary" },
      equivalence_cert: { name: "Equivalence Certificate", level: "VTU / BCU / KU", issueOffice: "University Registrar" },

      trade_license: { name: "BBMP / City Trade License", level: "BBMP / Municipality", issueOffice: "Health Officer (BBMP)" },
      fssai_license: { name: "FSSAI Food License", level: "FSSAI Dept", issueOffice: "Designated Officer" },
      udyam_msme_cert: { name: "Udyam MSME Registration", level: "DIC Karnataka", issueOffice: "Directorate of MSME" },
      fire_noc_cert: { name: "Karnataka Fire Safety NOC", level: "Fire Dept", issueOffice: "Director General Fire Services" },
      building_occupancy_cert: { name: "BBMP Building Occupancy Cert", level: "Town Planning Dept", issueOffice: "Executive Engineer (Planning)" },

      driving_license: { name: "DL Smart Card (Karnataka RTO)", level: "Transport Dept", issueOffice: "RTO / ARTO" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "Transport Dept", issueOffice: "RTO" },
      vehicle_fitness_cert: { name: "Vehicle Fitness Certificate", level: "RTO Inspection Track", issueOffice: "Senior MVI" },
      puc_cert: { name: "Pollution Under Control (PUC)", level: "Testing Station", issueOffice: "Authorized Testing Station" },

      ri_report: { name: "Revenue Inspector (RI) Verification", level: "Hobli Office", issueOffice: "Hobli Revenue Inspector" }
    },
    routes: {
      domicile_cert: [
        { id: "dom_kar_r1", label: "Seva Sindhu RD Number Route", prerequisites: ["aadhaar", "electricity_bill", "ration_card"], visits: 1, days: 7, fee: 40, office: "Grama One / Bangalore One", tips: "Automatic RD-Number generation via DigiLocker." },
        { id: "dom_kar_r2", label: "7-Year Study Certificate Route", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 5, fee: 40, office: "Nada Kacheri / Seva Sindhu", tips: "Study certificate counter-signed by BEO." }
      ],
      income_cert: [
        { id: "inc_kar_r1", label: "Salary Slip / Form 16 Route", prerequisites: ["aadhaar", "salary_slip", "domicile_cert", "ration_card"], visits: 1, days: 7, fee: 40, office: "Nada Kacheri Portal", tips: "Form 16 auto-approves via digital Tehsildar signature." },
        { id: "inc_kar_r2", label: "Hobli RI Field Survey Route", prerequisites: ["aadhaar", "ration_card", "land_tax_receipt", "ri_report"], visits: 2, days: 12, fee: 40, office: "Hobli RI Office", tips: "RI checks agricultural RTC land records." }
      ],
      caste_cert: [
        { id: "caste_kar_r1", label: "Parent RD-Number Linked Fast Track", prerequisites: ["aadhaar", "parent_caste_cert", "sslc_marksheet"], visits: 1, days: 5, fee: 40, office: "Grama One / Nada Kacheri", tips: "If parent has 15-digit RD number, issued in 3-5 days." }
      ],
      obc_ncl_cert: [
        { id: "obc_kar_r1", label: "Caste + Income RD Combined Route", prerequisites: ["aadhaar", "income_cert", "caste_cert", "ration_card"], visits: 1, days: 7, fee: 50, office: "Seva Sindhu Portal", tips: "Merges valid Karnataka Caste & Income RD numbers." }
      ],
      nativity_cert: [
        { id: "nat_kar_r1", label: "10-Year Residence + Study Cert Route", prerequisites: ["aadhaar", "sslc_marksheet", "domicile_cert"], visits: 1, days: 7, fee: 40, office: "Nada Kacheri", tips: "Upload BEO attested school study certificate." }
      ],
      ews_cert: [
        { id: "ews_kar_r1", label: "Income & Asset RTC Verification", prerequisites: ["aadhaar", "income_cert", "land_tax_receipt", "ration_card"], visits: 2, days: 10, fee: 50, office: "Tehsildar Office", tips: "Requires RTC copy for agricultural land check." }
      ],
      solvency_cert: [
        { id: "sol_kar_r1", label: "Khata Valuation Route", prerequisites: ["aadhaar", "land_tax_receipt", "pan_card"], visits: 2, days: 15, fee: 100, office: "Tehsildar Office", tips: "Requires encumbrance certificate (EC) for last 13 years." }
      ],
      legal_heir_cert: [
        { id: "lheir_kar_r1", label: "Hobli RI + Mahazar Enquiry Route", prerequisites: ["aadhaar", "death_cert", "ration_card", "ri_report"], visits: 2, days: 20, fee: 50, office: "Taluk Office", tips: "Hobli RI conducts neighbor mahazar statement." }
      ],
      family_membership_cert: [
        { id: "fam_kar_r1", label: "Vanshavali Revenue Tree Route", prerequisites: ["aadhaar", "ration_card", "ri_report"], visits: 1, days: 7, fee: 40, office: "Nada Kacheri", tips: "Prepares genealogical tree certified by Village Accountant." }
      ],
      non_remarriage_cert: [
        { id: "nonrem_kar_r1", label: "Self Declaration + RI Report", prerequisites: ["aadhaar", "death_cert", "notarized_affidavit"], visits: 1, days: 5, fee: 40, office: "Nada Kacheri", tips: "Required for pension continuation." }
      ],
      one_and_same_cert: [
        { id: "onesame_kar_r1", label: "Tehsildar Name Discrepancy Cert", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 7, fee: 40, office: "Nada Kacheri", tips: "Resolves name mismatches between Aadhaar & SSLC." }
      ],
      possession_valuation_cert: [
        { id: "poss_kar_r1", label: "Bhoomi RTC Extract Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 0, days: 2, fee: 15, office: "Bhoomi Online Portal", tips: "Instant digitally signed Pahani/RTC." }
      ],
      dependent_cert: [
        { id: "dep_kar_r1", label: "Sainik Welfare Card Route", prerequisites: ["aadhaar", "ration_card", "passport_photo"], visits: 1, days: 7, fee: 0, office: "Sainik Welfare Office", tips: "For ex-servicemen children reservation." }
      ],
      intercaste_marriage_cert: [
        { id: "interc_kar_r1", label: "Kaveri Marriage + Social Welfare", prerequisites: ["aadhaar", "marriage_cert", "caste_cert"], visits: 1, days: 10, fee: 50, office: "Taluk Social Welfare Office", tips: "Provides ₹2.5 Lakh incentive grant." }
      ],
      farmer_cert: [
        { id: "farm_kar_r1", label: "FRUITS Portal Registration", prerequisites: ["aadhaar", "land_tax_receipt", "bank_passbook"], visits: 1, days: 3, fee: 0, office: "Raitha Samparka Kendra", tips: "Generates 10-digit FID for all Karnataka agri schemes." }
      ],
      unemployment_cert: [
        { id: "unemp_kar_r1", label: "Seva Sindhu Jobless Declaration", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 5, fee: 40, office: "Nada Kacheri", tips: "Needed for Yuva Nidhi scheme eligibility." }
      ],

      // Civil
      birth_cert: [
        { id: "birth_kar_r1", label: "e-Janma Portal Hospital Auto Route", prerequisites: ["aadhaar", "hospital_birth_report"], visits: 0, days: 3, fee: 0, office: "e-Janma Karnataka Portal", tips: "Download online using hospital birth ID." }
      ],
      death_cert: [
        { id: "death_kar_r1", label: "e-Janma Death Record", prerequisites: ["aadhaar", "medical_death_summary"], visits: 0, days: 3, fee: 0, office: "e-Janma Portal", tips: "Registered by attending hospital or Grama Panchayat." }
      ],
      marriage_cert: [
        { id: "marr_kar_r1", label: "Kaveri Online SRO Slot Appointment", prerequisites: ["aadhaar", "sslc_marksheet", "marriage_invitation_photo"], visits: 1, days: 2, fee: 100, office: "Sub Registrar Office (SRO)", tips: "Biometric signature of bride, groom, & 3 witnesses." }
      ],
      pwd_udid_cert: [
        { id: "pwd_kar_r1", label: "District Surgeon Medical Board", prerequisites: ["aadhaar", "passport_photo", "medical_board_disability_report"], visits: 1, days: 14, fee: 0, office: "District Government Hospital", tips: "UDID card issued with national validity." }
      ],
      senior_citizen_cert: [
        { id: "snr_kar_r1", label: "Bangalore One / Grama One Fast Track", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 3, fee: 25, office: "Bangalore One / Grama One", tips: "Issued to applicants aged 60+." }
      ],
      transgender_id_cert: [
        { id: "trans_kar_r1", label: "National Portal Online Application", prerequisites: ["aadhaar", "passport_photo"], visits: 0, days: 7, fee: 0, office: "National Transgender Portal", tips: "Issued by Deputy Commissioner." }
      ],
      surviving_member_cert: [
        { id: "surv_kar_r1", label: "Hobli RI Quick Enquiry", prerequisites: ["aadhaar", "death_cert", "ration_card", "ri_report"], visits: 2, days: 10, fee: 40, office: "Taluk Office", tips: "For death relief & compassionate claims." }
      ],

      // Education
      transfer_cert: [
        { id: "tc_kar_r1", label: "School Principal Direct Issue", prerequisites: ["sslc_marksheet"], visits: 1, days: 1, fee: 0, office: "School Office", tips: "Requires no-dues clearance." }
      ],
      migration_cert: [
        { id: "mig_kar_r1", label: "KSEEB / SSLC Board Portal", prerequisites: ["sslc_marksheet", "transfer_cert"], visits: 1, days: 3, fee: 200, office: "KSEEB Board Office", tips: "Issued for CBSE/ICSE or other state transfers." }
      ],
      conduct_character_cert: [
        { id: "char_kar_r1", label: "Police Verification (e-PCC)", prerequisites: ["aadhaar", "passport_photo"], visits: 1, days: 5, fee: 250, office: "Police Station / KSP Portal", tips: "Police Verification Certificate via Karnataka State Police portal." }
      ],
      study_cert: [
        { id: "std_kar_r1", label: "7-Year Study BEO Attestation", prerequisites: ["sslc_marksheet"], visits: 1, days: 3, fee: 0, office: "Block Education Office (BEO)", tips: "Mandatory for KEA CET / NEET Karnataka domicile seats." }
      ],
      gap_cert: [
        { id: "gap_kar_r1", label: "Notarized Stamp Paper Affidavit", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 1, fee: 100, office: "Advocate Notary Public", tips: "Required for university gap year admissions." }
      ],
      equivalence_cert: [
        { id: "equiv_kar_r1", label: "VTU / University Academic Council", prerequisites: ["sslc_marksheet", "migration_cert"], visits: 1, days: 10, fee: 500, office: "University Registrar Office", tips: "Validates foreign/outside state qualifications." }
      ],

      // Business
      trade_license: [
        { id: "trade_kar_r1", label: "BBMP Trade License Online Portal", prerequisites: ["aadhaar", "building_plan_approval", "electricity_bill"], visits: 0, days: 3, fee: 1000, office: "BBMP Online Portal", tips: "Instant registration for non-hazardous trades." }
      ],
      fssai_license: [
        { id: "fssai_kar_r1", label: "FoSCoS Online Portal", prerequisites: ["aadhaar", "passport_photo", "electricity_bill"], visits: 0, days: 2, fee: 100, office: "FoSCoS Portal", tips: "Food safety registration." }
      ],
      udyam_msme_cert: [
        { id: "udyam_kar_r1", label: "National Udyam Portal", prerequisites: ["aadhaar", "pan_card", "bank_passbook"], visits: 0, days: 1, fee: 0, office: "Udyam Portal", tips: "Instant MSME certificate." }
      ],
      fire_noc_cert: [
        { id: "fire_kar_r1", label: "Karnataka Fire Dept Audit", prerequisites: ["building_plan_approval", "electricity_bill"], visits: 2, days: 14, fee: 1000, office: "Fire Station Division", tips: "Fire safety clearance." }
      ],
      building_occupancy_cert: [
        { id: "occ_kar_r1", label: "BBMP Plan Sanction Completion", prerequisites: ["building_plan_approval", "land_tax_receipt"], visits: 2, days: 12, fee: 500, office: "BBMP Planning Dept", tips: "Required before commercial power connection." }
      ],

      // Transport
      driving_license: [
        { id: "dl_kar_r1", label: "Parivahan Sarathi Karnataka", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 2, days: 30, fee: 950, office: "RTO Office", tips: "Pass online LL & RTO ground test." }
      ],
      vehicle_rc: [
        { id: "rc_kar_r1", label: "RTO Dealer Smart Card", prerequisites: ["aadhaar", "puc_cert", "pan_card"], visits: 0, days: 5, fee: 600, office: "RTO", tips: "Delivered via post." }
      ],
      vehicle_fitness_cert: [
        { id: "fc_kar_r1", label: "RTO MVI Track Inspection", prerequisites: ["vehicle_rc", "puc_cert"], visits: 1, days: 1, fee: 600, office: "RTO Fitness Track", tips: "Annual commercial FC." }
      ],
      puc_cert: [
        { id: "puc_kar_r1", label: "Emission Testing Station", prerequisites: ["vehicle_rc"], visits: 1, days: 1, fee: 100, office: "Authorized Emission Center", tips: "Computerized certificate." }
      ],

      ri_report: [
        { id: "ri_rep_r1", label: "Hobli Revenue Inspection", prerequisites: ["aadhaar", "electricity_bill"], visits: 1, days: 3, fee: 0, office: "Hobli Office", tips: "Meet Hobli RI." }
      ]
    }
  },

  tamilnadu: {
    stateName: "Tamil Nadu",
    portalName: "e-Sevai, TNeGA, & Revenue Department",
    nodes: {
      income_cert: { name: "Income Certificate (CAN Number)", level: "e-Sevai", issueOffice: "e-Sevai Center / Revenue Inspector" },
      caste_cert: { name: "Community Certificate (BC/MBC/SC/ST)", level: "e-Sevai", issueOffice: "e-Sevai / Zonal Deputy Tehsildar" },
      domicile_cert: { name: "Residence Certificate", level: "e-Sevai", issueOffice: "e-Sevai / VAO" },
      obc_ncl_cert: { name: "OBC Non-Creamy-Layer Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      nativity_cert: { name: "Nativity Certificate", level: "e-Sevai", issueOffice: "e-Sevai / VAO" },
      ews_cert: { name: "EWS Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      solvency_cert: { name: "Solvency Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      legal_heir_cert: { name: "Legal Heir Certificate", level: "Taluk Office", issueOffice: "Tehsildar / VAO" },
      family_membership_cert: { name: "Family Member Certificate", level: "e-Sevai", issueOffice: "VAO / Tehsildar" },
      non_remarriage_cert: { name: "Unmarried / Non-Remarriage Cert", level: "e-Sevai", issueOffice: "VAO" },
      one_and_same_cert: { name: "One and Same Name Certificate", level: "e-Sevai", issueOffice: "Tehsildar" },
      possession_valuation_cert: { name: "Patta / Chitta & Valuation Cert", level: "e-Sevai", issueOffice: "Zonal Deputy Tehsildar" },
      dependent_cert: { name: "Ex-Serviceman Dependent Cert", level: "Ex-Servicemen Welfare", issueOffice: "Assistant Director Ex-Servicemen Welfare" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Cert", level: "Social Welfare Dept", issueOffice: "District Social Welfare Officer" },
      farmer_cert: { name: "Farmer Identity Certificate", level: "Agriculture Dept", issueOffice: "Assistant Agricultural Officer (AAO)" },
      unemployment_cert: { name: "Unemployment Certificate", level: "e-Sevai", issueOffice: "Tehsildar" },

      birth_cert: { name: "Birth Certificate (TN Public Health)", level: "Corporation / Town Panchayat", issueOffice: "Sanitary Inspector / Registrar" },
      death_cert: { name: "Death Certificate", level: "Corporation / Panchayat", issueOffice: "Sanitary Inspector" },
      marriage_cert: { name: "TN Marriage Certificate", level: "Sub Registrar", issueOffice: "Sub Registrar Office (SRO)" },
      pwd_udid_cert: { name: "Disability Certificate & UDID", level: "District Medical Board", issueOffice: "Joint Director Health Services" },
      senior_citizen_cert: { name: "Senior Citizen ID Card", level: "e-Sevai", issueOffice: "e-Sevai / District Social Welfare" },
      transgender_id_cert: { name: "Transgender Welfare Card", level: "Transgender Welfare Board", issueOffice: "Social Welfare Officer" },
      surviving_member_cert: { name: "Surviving Member Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },

      transfer_cert: { name: "School TC (EMIS Linked)", level: "School", issueOffice: "Headmaster / Principal" },
      migration_cert: { name: "Migration Certificate", level: "DGE TN / University", issueOffice: "Director of Government Examinations" },
      conduct_character_cert: { name: "Character Certificate", level: "Police / School", issueOffice: "Police Station / Principal" },
      study_cert: { name: "Continuous Study Cert (1-10th EMIS)", level: "School", issueOffice: "Headmaster" },
      gap_cert: { name: "Educational Gap Affidavit", level: "Notary", issueOffice: "Advocate Notary" },
      equivalence_cert: { name: "Equivalence Certificate", level: "Tamil Nadu Higher Education", issueOffice: "Higher Education Dept" },

      trade_license: { name: "GCC / Municipal Trade License", level: "Corporation", issueOffice: "Revenue Officer / Health Dept" },
      fssai_license: { name: "FSSAI Food License", level: "Food Safety Dept", issueOffice: "Designated Officer" },
      udyam_msme_cert: { name: "Udyam MSME Registration", level: "MSME Dept", issueOffice: "General Manager DIC" },
      fire_noc_cert: { name: "TN Fire Safety License", level: "Fire & Rescue Services", issueOffice: "Station Officer / DFO" },
      building_occupancy_cert: { name: "CMDA / DTCP Building Occupancy", level: "Town Planning", issueOffice: "Member Secretary CMDA / DTCP" },

      driving_license: { name: "Driving License (TN RTO)", level: "Transport Dept", issueOffice: "RTO / Motor Vehicles Inspector" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "Transport Dept", issueOffice: "RTO" },
      vehicle_fitness_cert: { name: "Commercial FC", level: "RTO Testing Station", issueOffice: "Motor Vehicle Inspector" },
      puc_cert: { name: "Pollution Under Control (PUC)", level: "Testing Station", issueOffice: "Authorized Smoke Centre" },

      vao_report: { name: "Village Administrative Officer (VAO) Report", level: "Village Office", issueOffice: "VAO Office" }
    },
    routes: {
      domicile_cert: [
        { id: "dom_tn_r1", label: "Aadhaar + Smart Ration Card + CAN ID", prerequisites: ["aadhaar", "ration_card", "electricity_bill"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center / TNeGA", tips: "Requires TNeGA Citizen Access Number (CAN) registration." },
        { id: "dom_tn_r2", label: "VAO Verification Route", prerequisites: ["aadhaar", "sslc_marksheet", "vao_report"], visits: 2, days: 7, fee: 60, office: "VAO Office & e-Sevai", tips: "VAO signs physical verification token." }
      ],
      income_cert: [
        { id: "inc_tn_r1", label: "Salary Slip / Form 16 + CAN Route", prerequisites: ["aadhaar", "salary_slip", "domicile_cert", "ration_card"], visits: 1, days: 5, fee: 60, office: "e-Sevai Online", tips: "Fast approval for salaried employees with Form 16." },
        { id: "inc_tn_r2", label: "VAO + Revenue Inspector Inspection", prerequisites: ["aadhaar", "ration_card", "land_tax_receipt", "vao_report"], visits: 2, days: 10, fee: 60, office: "VAO & RI Office", tips: "RI conducts local enquiry before digital signature." }
      ],
      caste_cert: [
        { id: "caste_tn_r1", label: "Parent Community Certificate Linking", prerequisites: ["aadhaar", "ration_card", "parent_caste_cert", "sslc_marksheet"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center", tips: "Linking father's Community Certificate number guarantees quick issuance." }
      ],
      obc_ncl_cert: [
        { id: "obc_tn_r1", label: "Income + Community Certificate Linked", prerequisites: ["aadhaar", "income_cert", "caste_cert", "ration_card"], visits: 1, days: 7, fee: 60, office: "e-Sevai / Tehsildar", tips: "Combines TN Income Certificate and TN Community Certificate." }
      ],
      nativity_cert: [
        { id: "nat_tn_r1", label: "VAO Nativity Verification Route", prerequisites: ["aadhaar", "sslc_marksheet", "domicile_cert", "vao_report"], visits: 2, days: 7, fee: 60, office: "VAO & e-Sevai", tips: "Continuous 5-year study or birth proof required." }
      ],
      ews_cert: [
        { id: "ews_tn_r1", label: "Income & Patta Verification Route", prerequisites: ["aadhaar", "income_cert", "land_tax_receipt", "ration_card"], visits: 2, days: 10, fee: 60, office: "Tehsildar Office", tips: "Patta copy required for non-agricultural residential check." }
      ],
      solvency_cert: [
        { id: "sol_tn_r1", label: "Patta & Guideline Value Route", prerequisites: ["aadhaar", "land_tax_receipt", "pan_card"], visits: 2, days: 14, fee: 100, office: "Tehsildar Office", tips: "Guideline value certificate from Sub-Registrar required." }
      ],
      legal_heir_cert: [
        { id: "lheir_tn_r1", label: "e-Sevai Online Legal Heir Application", prerequisites: ["aadhaar", "death_cert", "ration_card", "vao_report"], visits: 2, days: 15, fee: 60, office: "e-Sevai / Revenue Inspector", tips: "Mandatory enquiry by VAO, RI, and Revenue Inspector." }
      ],
      family_membership_cert: [
        { id: "fam_tn_r1", label: "Smart Ration Card Family Extract", prerequisites: ["aadhaar", "ration_card", "vao_report"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center", tips: "Extracts verified family tree under PDS database." }
      ],
      non_remarriage_cert: [
        { id: "nonrem_tn_r1", label: "VAO Unmarried Certificate Route", prerequisites: ["aadhaar", "death_cert", "notarized_affidavit"], visits: 1, days: 5, fee: 60, office: "VAO Office & e-Sevai", tips: "Annual certificate for family pension." }
      ],
      one_and_same_cert: [
        { id: "onesame_tn_r1", label: "e-Sevai One and Same Certificate", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 7, fee: 60, office: "e-Sevai / Tehsildar", tips: "Resolves name variance across school records & Aadhaar." }
      ],
      possession_valuation_cert: [
        { id: "poss_tn_r1", label: "e-Services AnyLR Patta Chitta Extract", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 0, days: 1, fee: 0, office: "eservices.tn.gov.in", tips: "Instant download of verified Patta/Chitta." }
      ],
      dependent_cert: [
        { id: "dep_tn_r1", label: "Ex-Servicemen Welfare Board Route", prerequisites: ["aadhaar", "ration_card", "passport_photo"], visits: 1, days: 7, fee: 0, office: "District Ex-Servicemen Welfare Office", tips: "For education quota in TNEA / TN Medical." }
      ],
      intercaste_marriage_cert: [
        { id: "interc_tn_r1", label: "Social Welfare Incentive Grant Route", prerequisites: ["aadhaar", "marriage_cert", "caste_cert"], visits: 1, days: 10, fee: 0, office: "District Social Welfare Office", tips: "Provides Dr. Muthulakshmi Reddy grant & Gold medal." }
      ],
      farmer_cert: [
        { id: "farm_tn_r1", label: "Uzhavan App Registration Route", prerequisites: ["aadhaar", "land_tax_receipt", "bank_passbook"], visits: 0, days: 3, fee: 0, office: "Uzhavan Portal / AAO", tips: "Generates Farmer Green Card for subsidy seeds & fertilizer." }
      ],
      unemployment_cert: [
        { id: "unemp_tn_r1", label: "e-Sevai Unemployment Application", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center", tips: "For exam fee exemption in TNPSC." }
      ],

      // Civil
      birth_cert: [
        { id: "birth_tn_r1", label: "TN Civil Registration System (CRS)", prerequisites: ["aadhaar", "hospital_birth_report"], visits: 0, days: 2, fee: 0, office: "crstn.org Portal", tips: "Free download using RCH ID." }
      ],
      death_cert: [
        { id: "death_tn_r1", label: "TN CRS Death Registration", prerequisites: ["aadhaar", "medical_death_summary"], visits: 0, days: 2, fee: 0, office: "crstn.org Portal", tips: "Free online download." }
      ],
      marriage_cert: [
        { id: "marr_tn_r1", label: "TN TNREGINET Marriage Appointment", prerequisites: ["aadhaar", "sslc_marksheet", "marriage_invitation_photo"], visits: 1, days: 1, fee: 100, office: "Sub Registrar Office (SRO)", tips: "3 witnesses with Aadhaar cards required." }
      ],
      pwd_udid_cert: [
        { id: "pwd_tn_r1", label: "District Medical Board Verification", prerequisites: ["aadhaar", "passport_photo", "medical_board_disability_report"], visits: 1, days: 14, fee: 0, office: "District Headquarters Hospital", tips: "UDID card issued with bus/train pass concession." }
      ],
      senior_citizen_cert: [
        { id: "snr_tn_r1", label: "e-Sevai Senior Citizen Smart Card", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 3, fee: 60, office: "e-Sevai Center", tips: "Age 60+ proof." }
      ],
      transgender_id_cert: [
        { id: "trans_tn_r1", label: "TN Transgender Welfare Board Card", prerequisites: ["aadhaar", "passport_photo"], visits: 1, days: 7, fee: 0, office: "Social Welfare Office", tips: "Includes free housing & healthcare benefits." }
      ],
      surviving_member_cert: [
        { id: "surv_tn_r1", label: "VAO Field Report Route", prerequisites: ["aadhaar", "death_cert", "ration_card", "vao_report"], visits: 2, days: 10, fee: 60, office: "Taluk Office", tips: "Quick relief certificate." }
      ],

      // Education
      transfer_cert: [
        { id: "tc_tn_r1", label: "EMIS Online TC Direct Issue", prerequisites: ["sslc_marksheet"], visits: 1, days: 1, fee: 0, office: "School Office", tips: "EMIS number auto-transfers student record." }
      ],
      migration_cert: [
        { id: "mig_tn_r1", label: "DGE Tamil Nadu Online Portal", prerequisites: ["sslc_marksheet", "transfer_cert"], visits: 1, days: 3, fee: 200, office: "DGE Office Chennai", tips: "For out of state university admissions." }
      ],
      conduct_character_cert: [
        { id: "char_tn_r1", label: "TN Police e-Services (PCC)", prerequisites: ["aadhaar", "passport_photo"], visits: 1, days: 5, fee: 500, office: "Police Station / TN Police Portal", tips: "Online Police Verification Certificate." }
      ],
      study_cert: [
        { id: "std_tn_r1", label: "PSTM (Persons Studied in Tamil Medium) Cert", prerequisites: ["sslc_marksheet"], visits: 1, days: 2, fee: 0, office: "School Headmaster", tips: "Provides 20% reservation quota in TNPSC jobs." }
      ],
      gap_cert: [
        { id: "gap_tn_r1", label: "Notarized Stamp Paper Affidavit", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 1, fee: 100, office: "Advocate Notary Public", tips: "Explains study gap." }
      ],
      equivalence_cert: [
        { id: "equiv_tn_r1", label: "TNHED Equivalence Committee", prerequisites: ["sslc_marksheet", "migration_cert"], visits: 1, days: 14, fee: 500, office: "Higher Education Dept", tips: "Validates non-TN degrees." }
      ],

      // Business
      trade_license: [
        { id: "trade_tn_r1", label: "TN Urban Single Window Portal", prerequisites: ["aadhaar", "building_plan_approval", "electricity_bill"], visits: 0, days: 3, fee: 1000, office: "Corporation Portal", tips: "Online trade permit." }
      ],
      fssai_license: [
        { id: "fssai_tn_r1", label: "FoSCoS Portal Registration", prerequisites: ["aadhaar", "passport_photo", "electricity_bill"], visits: 0, days: 2, fee: 100, office: "FoSCoS Portal", tips: "Food safety registration." }
      ],
      udyam_msme_cert: [
        { id: "udyam_tn_r1", label: "National Udyam Portal", prerequisites: ["aadhaar", "pan_card", "bank_passbook"], visits: 0, days: 1, fee: 0, office: "Udyam Portal", tips: "Instant MSME cert." }
      ],
      fire_noc_cert: [
        { id: "fire_tn_r1", label: "TN Fire & Rescue Inspection", prerequisites: ["building_plan_approval", "electricity_bill"], visits: 2, days: 14, fee: 1000, office: "Fire Station Division", tips: "Building safety audit." }
      ],
      building_occupancy_cert: [
        { id: "occ_tn_r1", label: "CMDA Completion Certificate", prerequisites: ["building_plan_approval", "land_tax_receipt"], visits: 2, days: 15, fee: 1000, office: "CMDA Office", tips: "Mandatory for high rise buildings." }
      ],

      // Transport
      driving_license: [
        { id: "dl_tn_r1", label: "Parivahan Sarathi Tamil Nadu", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 2, days: 30, fee: 950, office: "RTO Office", tips: "LL & ground driving test." }
      ],
      vehicle_rc: [
        { id: "rc_tn_r1", label: "RTO e-Vahan Smart Card", prerequisites: ["aadhaar", "puc_cert", "pan_card"], visits: 0, days: 5, fee: 600, office: "RTO", tips: "Delivered via post." }
      ],
      vehicle_fitness_cert: [
        { id: "fc_tn_r1", label: "RTO FC Track Test", prerequisites: ["vehicle_rc", "puc_cert"], visits: 1, days: 1, fee: 600, office: "RTO Fitness Track", tips: "Annual commercial FC." }
      ],
      puc_cert: [
        { id: "puc_tn_r1", label: "Smoke Emission Testing", prerequisites: ["vehicle_rc"], visits: 1, days: 1, fee: 100, office: "Authorized Smoke Station", tips: "Emission check." }
      ],

      vao_report: [
        { id: "vao_rep_r1", label: "VAO Village Office Signature", prerequisites: ["aadhaar", "electricity_bill"], visits: 1, days: 2, fee: 0, office: "VAO Village Office", tips: "Visit VAO in morning." }
      ]
    }
  },

  pan_india: {
    stateName: "All-India / Standard State e-District",
    portalName: "National Service Plus & e-District Portals",
    nodes: {
      income_cert: { name: "Income Certificate", level: "Tehsil / Sub-Division", issueOffice: "Tehsildar / SDM" },
      caste_cert: { name: "Caste / Tribe Certificate", level: "Tehsil / Sub-Division", issueOffice: "Tehsildar / SDO" },
      domicile_cert: { name: "Domicile / Permanent Residence Cert", level: "Tehsil / Municipal", issueOffice: "Tehsildar / Magistrate" },
      obc_ncl_cert: { name: "OBC Non-Creamy-Layer Certificate (Central)", level: "District Collectorate / SDM", issueOffice: "Tehsildar / SDM" },
      nativity_cert: { name: "Nativity / Birth Residence Cert", level: "Tehsil", issueOffice: "Tehsildar" },
      ews_cert: { name: "EWS Certificate (Central Format)", level: "Tehsil / SDO", issueOffice: "Tehsildar" },
      solvency_cert: { name: "Solvency Certificate", level: "Collectorate / Revenue Dept", issueOffice: "Tehsildar / Collector" },
      legal_heir_cert: { name: "Legal Heir / Succession Cert", level: "Tehsil / District Court", issueOffice: "Tehsildar / Civil Judge" },
      family_membership_cert: { name: "Family Tree / Vanshavali Cert", level: "Tehsil", issueOffice: "Circle Officer / Patwari" },
      non_remarriage_cert: { name: "Non-Remarriage / Single Status Cert", level: "Tehsil", issueOffice: "Executive Magistrate" },
      one_and_same_cert: { name: "One and Same Person Certificate", level: "Tehsil", issueOffice: "Tehsildar / Magistrate" },
      possession_valuation_cert: { name: "Land Possession & Valuation Cert", level: "Tehsil", issueOffice: "Tehsildar / Circle Officer" },
      dependent_cert: { name: "Ex-Serviceman / Defense Dependent Cert", level: "Zilla Sainik Board", issueOffice: "Zilla Sainik Welfare Officer" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Certificate", level: "District Welfare Dept", issueOffice: "District Welfare Officer" },
      farmer_cert: { name: "Farmer Identity Card / PM-Kisan Cert", level: "Block Agri Office", issueOffice: "Block Agriculture Officer" },
      unemployment_cert: { name: "Unemployment Certificate", level: "Tehsil / Employment Exchange", issueOffice: "Tehsildar / Employment Officer" },

      birth_cert: { name: "Birth Certificate (RBD Act)", level: "Municipal / Registrar", issueOffice: "Registrar Births & Deaths" },
      death_cert: { name: "Death Certificate (RBD Act)", level: "Municipal / Registrar", issueOffice: "Registrar Births & Deaths" },
      marriage_cert: { name: "Marriage Certificate (Special Marriage)", level: "Sub Registrar", issueOffice: "Marriage Officer / SRO" },
      pwd_udid_cert: { name: "UDID Disability Card (Swavlamban)", level: "Medical Board", issueOffice: "Chief Medical Officer (CMO)" },
      senior_citizen_cert: { name: "Senior Citizen Card", level: "District Social Welfare", issueOffice: "District Magistrate / Welfare Officer" },
      transgender_id_cert: { name: "Transgender Certificate & ID", level: "National Portal", issueOffice: "District Magistrate (DM)" },
      surviving_member_cert: { name: "Surviving Family Member Cert", level: "Tehsil", issueOffice: "Tehsildar" },

      transfer_cert: { name: "Transfer Certificate (TC)", level: "School / Board", issueOffice: "Headmaster / Principal" },
      migration_cert: { name: "Migration Certificate", level: "CBSE / ICSE / University", issueOffice: "Controller of Examinations" },
      conduct_character_cert: { name: "Character Certificate", level: "Police / Educational", issueOffice: "Superintendent of Police / Principal" },
      study_cert: { name: "Continuous Study Certificate", level: "School / Education Dept", issueOffice: "District Education Officer (DEO)" },
      gap_cert: { name: "Educational Break Affidavit", level: "Notary Public", issueOffice: "Advocate Notary" },
      equivalence_cert: { name: "AIU Equivalence Certificate", level: "Association of Indian Universities", issueOffice: "AIU New Delhi" },

      trade_license: { name: "Municipal Trade License", level: "Municipal Corporation", issueOffice: "Health Officer / Municipal Commissioner" },
      fssai_license: { name: "FSSAI License / Registration", level: "FSSAI", issueOffice: "Designated Officer" },
      udyam_msme_cert: { name: "MSME Udyam Registration", level: "Ministry of MSME", issueOffice: "General Manager DIC" },
      fire_noc_cert: { name: "Fire Safety NOC", level: "Fire & Rescue Services", issueOffice: "Chief Fire Officer" },
      building_occupancy_cert: { name: "Building Occupancy Certificate", level: "Development Authority", issueOffice: "Chief Town Planner" },

      driving_license: { name: "Driving License (Parivahan)", level: "RTO / MVI", issueOffice: "Regional Transport Officer" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "Parivahan Vahan", issueOffice: "RTO" },
      vehicle_fitness_cert: { name: "Commercial Vehicle FC", level: "RTO Testing Station", issueOffice: "Motor Vehicle Inspector" },
      puc_cert: { name: "Pollution Under Control (PUC)", level: "Testing Station", issueOffice: "Authorized Testing Centre" },

      patwari_report: { name: "Patwari / Lekhpal Field Inquiry Report", level: "Village / Circle Office", issueOffice: "Patwari / Lekhpal / Circle Officer" }
    },
    routes: {
      domicile_cert: [
        { id: "dom_pan_r1", label: "Aadhaar + Utility Bill Route", prerequisites: ["aadhaar", "ration_card", "electricity_bill"], visits: 1, days: 7, fee: 50, office: "e-District CSC Center", tips: "Proof of residence in state for minimum 3 years required." },
        { id: "dom_pan_r2", label: "Educational Marksheet Route", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 1, days: 5, fee: 50, office: "e-District Portal / Tehsildar", tips: "SSLC certificate showing school location in state." }
      ],
      income_cert: [
        { id: "inc_pan_r1", label: "Salary Slip / ITR Fast Track", prerequisites: ["aadhaar", "salary_slip", "domicile_cert", "ration_card"], visits: 1, days: 5, fee: 50, office: "CSC / e-District", tips: "Form 16 or latest ITR eliminates requirement for Patwari field visit." },
        { id: "inc_pan_r2", label: "Patwari / Lekhpal Verification", prerequisites: ["aadhaar", "ration_card", "land_tax_receipt", "patwari_report"], visits: 2, days: 10, fee: 50, office: "Tehsil Office / Lekhpal", tips: "Lekhpal verifies family agricultural and non-agricultural income." }
      ],
      caste_cert: [
        { id: "caste_pan_r1", label: "Parent Caste Certificate Route", prerequisites: ["aadhaar", "ration_card", "parent_caste_cert", "sslc_marksheet"], visits: 1, days: 7, fee: 50, office: "Tehsil Office / e-District", tips: "Attaching verified parent certificate guarantees fast verification." }
      ],
      obc_ncl_cert: [
        { id: "obc_pan_r1", label: "Joint Income + Caste Certificate Route", prerequisites: ["aadhaar", "income_cert", "caste_cert", "ration_card"], visits: 1, days: 7, fee: 50, office: "Tehsildar / SDM Office", tips: "Central format OBC-NCL issued using state Caste & Income certificates." }
      ],
      nativity_cert: [
        { id: "nat_pan_r1", label: "Birth & Schooling Proof Route", prerequisites: ["aadhaar", "sslc_marksheet", "domicile_cert"], visits: 1, days: 7, fee: 50, office: "Tehsil Office", tips: "Proves native ancestral origin." }
      ],
      ews_cert: [
        { id: "ews_pan_r1", label: "Income & Asset Certificate (Annexure A)", prerequisites: ["aadhaar", "income_cert", "land_tax_receipt", "ration_card"], visits: 2, days: 10, fee: 50, office: "Tehsildar Office", tips: "Verifies agricultural land < 5 acres and residential flat < 1000 sq.ft." }
      ],
      solvency_cert: [
        { id: "sol_pan_r1", label: "Land Revenue & Valuer Assessment", prerequisites: ["aadhaar", "land_tax_receipt", "pan_card"], visits: 2, days: 15, fee: 100, office: "Collectorate / SDM", tips: "Valuation report from approved government valuer." }
      ],
      legal_heir_cert: [
        { id: "lheir_pan_r1", label: "Tehsil Enquiry + Gazette Notice", prerequisites: ["aadhaar", "death_cert", "ration_card", "patwari_report"], visits: 2, days: 21, fee: 50, office: "Tehsil / Sub-Division Office", tips: "Lekhpal publishes public notice before issuing." }
      ],
      family_membership_cert: [
        { id: "fam_pan_r1", label: "Patwari Vanshavali Report Route", prerequisites: ["aadhaar", "ration_card", "patwari_report"], visits: 1, days: 7, fee: 50, office: "Tehsil Office", tips: "Certified family tree by Circle Officer." }
      ],
      non_remarriage_cert: [
        { id: "nonrem_pan_r1", label: "Executive Magistrate Affidavit", prerequisites: ["aadhaar", "death_cert", "notarized_affidavit"], visits: 1, days: 3, fee: 50, office: "Magistrate Court / Tehsil", tips: "Required for Central government pension." }
      ],
      one_and_same_cert: [
        { id: "onesame_pan_r1", label: "Notarized Name Variance Certificate", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 5, fee: 50, office: "Tehsil / e-District", tips: "Confirms two name spellings belong to the same citizen." }
      ],
      possession_valuation_cert: [
        { id: "poss_pan_r1", label: "Circle Officer Valuation Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 1, days: 7, fee: 50, office: "Circle Office", tips: "Validates land possession & circle rate value." }
      ],
      dependent_cert: [
        { id: "dep_pan_r1", label: "Zilla Sainik Welfare Dependent Card", prerequisites: ["aadhaar", "ration_card", "passport_photo"], visits: 1, days: 7, fee: 0, office: "Zilla Sainik Board", tips: "For defense quota in national admissions." }
      ],
      intercaste_marriage_cert: [
        { id: "interc_pan_r1", label: "Dr. Ambedkar Foundation Incentive Scheme", prerequisites: ["aadhaar", "marriage_cert", "caste_cert"], visits: 1, days: 15, fee: 0, office: "District Magistrate / Welfare Officer", tips: "Central government incentive grant." }
      ],
      farmer_cert: [
        { id: "farm_pan_r1", label: "PM-Kisan Farmer ID Registration", prerequisites: ["aadhaar", "land_tax_receipt", "bank_passbook"], visits: 0, days: 3, fee: 0, office: "PM-Kisan Portal", tips: "Instant registration for direct benefit transfer (DBT)." }
      ],
      unemployment_cert: [
        { id: "unemp_pan_r1", label: "National Career Service (NCS) Registration", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 0, days: 1, fee: 0, office: "NCS Portal (ncs.gov.in)", tips: "Free online jobseeker ID card." }
      ],

      // Civil
      birth_cert: [
        { id: "birth_pan_r1", label: "National Civil Registration System (CRS)", prerequisites: ["aadhaar", "hospital_birth_report"], visits: 0, days: 3, fee: 0, office: "crsorgi.gov.in Portal", tips: "Registrar General of India official birth cert." }
      ],
      death_cert: [
        { id: "death_pan_r1", label: "National CRS Death Registration", prerequisites: ["aadhaar", "medical_death_summary"], visits: 0, days: 3, fee: 0, office: "crsorgi.gov.in Portal", tips: "Official death certificate." }
      ],
      marriage_cert: [
        { id: "marr_pan_r1", label: "Special Marriage Act SDM Court Route", prerequisites: ["aadhaar", "sslc_marksheet", "marriage_invitation_photo"], visits: 2, days: 30, fee: 100, office: "SDM Marriage Court", tips: "30-day notice period required under SMA 1954." }
      ],
      pwd_udid_cert: [
        { id: "pwd_pan_r1", label: "Swavlamban UDID National Portal", prerequisites: ["aadhaar", "passport_photo", "medical_board_disability_report"], visits: 1, days: 14, fee: 0, office: "swavlambancard.gov.in / CMO", tips: "Valid across all states in India." }
      ],
      senior_citizen_cert: [
        { id: "snr_pan_r1", label: "National Senior Citizen Portal Card", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 0, days: 3, fee: 0, office: "e-District Portal", tips: "Issued for citizens 60 years and above." }
      ],
      transgender_id_cert: [
        { id: "trans_pan_r1", label: "National Portal for Transgender Persons", prerequisites: ["aadhaar", "passport_photo"], visits: 0, days: 7, fee: 0, office: "transgender.dosje.gov.in", tips: "Direct certificate & ID download." }
      ],
      surviving_member_cert: [
        { id: "surv_pan_r1", label: "Tehsildar Field Report Route", prerequisites: ["aadhaar", "death_cert", "ration_card", "patwari_report"], visits: 2, days: 10, fee: 50, office: "Tehsil Office", tips: "For official family survivor relief." }
      ],

      // Education
      transfer_cert: [
        { id: "tc_pan_r1", label: "School Principal Direct Issue", prerequisites: ["sslc_marksheet"], visits: 1, days: 1, fee: 0, office: "School Office", tips: "Leaving school clearance." }
      ],
      migration_cert: [
        { id: "mig_pan_r1", label: "CBSE / ICSE / University DigiLocker", prerequisites: ["sslc_marksheet", "transfer_cert"], visits: 0, days: 1, fee: 0, office: "DigiLocker / Board Portal", tips: "Instant download via DigiLocker." }
      ],
      conduct_character_cert: [
        { id: "char_pan_r1", label: "Police Clearance Certificate (PCC)", prerequisites: ["aadhaar", "passport_photo"], visits: 1, days: 7, fee: 500, office: "Passport Seva Kendra / Police Station", tips: "Required for foreign visas & government jobs." }
      ],
      study_cert: [
        { id: "std_pan_r1", label: "Continuous Study School Certificate", prerequisites: ["sslc_marksheet"], visits: 1, days: 2, fee: 0, office: "School Headmaster / DEO", tips: "Countersigned by Block/District Education Officer." }
      ],
      gap_cert: [
        { id: "gap_pan_r1", label: "Notarized Stamp Paper Affidavit", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 1, fee: 100, office: "Advocate Notary Public", tips: "Explains gap year." }
      ],
      equivalence_cert: [
        { id: "equiv_pan_r1", label: "AIU New Delhi Equivalence Evaluation", prerequisites: ["sslc_marksheet", "migration_cert"], visits: 1, days: 14, fee: 1000, office: "Association of Indian Universities", tips: "For foreign university degrees." }
      ],

      // Business
      trade_license: [
        { id: "trade_pan_r1", label: "National Single Window System (NSWS)", prerequisites: ["aadhaar", "building_plan_approval", "electricity_bill"], visits: 0, days: 3, fee: 1000, office: "NSWS Portal", tips: "Unified commercial trade license." }
      ],
      fssai_license: [
        { id: "fssai_pan_r1", label: "FoSCoS Food Safety Central Portal", prerequisites: ["aadhaar", "passport_photo", "electricity_bill"], visits: 0, days: 2, fee: 100, office: "foscos.fssai.gov.in", tips: "Instant food business license." }
      ],
      udyam_msme_cert: [
        { id: "udyam_pan_r1", label: "Udyam Registration Portal", prerequisites: ["aadhaar", "pan_card", "bank_passbook"], visits: 0, days: 1, fee: 0, office: "udyamregistration.gov.in", tips: "Free official MSME certificate." }
      ],
      fire_noc_cert: [
        { id: "fire_pan_r1", label: "State Fire Service Audit", prerequisites: ["building_plan_approval", "electricity_bill"], visits: 2, days: 14, fee: 1000, office: "Fire Station Headquarters", tips: "Mandatory fire NOC." }
      ],
      building_occupancy_cert: [
        { id: "occ_pan_r1", label: "Development Authority Completion Cert", prerequisites: ["building_plan_approval", "land_tax_receipt"], visits: 2, days: 15, fee: 1000, office: "Urban Development Authority", tips: "Habitation approval." }
      ],

      // Transport
      driving_license: [
        { id: "dl_pan_r1", label: "Parivahan Sarathi National Portal", prerequisites: ["aadhaar", "sslc_marksheet", "passport_photo"], visits: 2, days: 30, fee: 950, office: "RTO Office", tips: "Online LL & RTO driving test." }
      ],
      vehicle_rc: [
        { id: "rc_pan_r1", label: "Parivahan Vahan Vehicle Smart Card", prerequisites: ["aadhaar", "puc_cert", "pan_card"], visits: 0, days: 5, fee: 600, office: "RTO", tips: "Delivered via speed post." }
      ],
      vehicle_fitness_cert: [
        { id: "fc_pan_r1", label: "Automated RTO Vehicle Fitness Track", prerequisites: ["vehicle_rc", "puc_cert"], visits: 1, days: 1, fee: 600, office: "RTO Fitness Track", tips: "Commercial vehicle fitness certificate." }
      ],
      puc_cert: [
        { id: "puc_pan_r1", label: "mParivahan Computerized Smoke Check", prerequisites: ["vehicle_rc"], visits: 1, days: 1, fee: 100, office: "Authorized PUC Centre", tips: "Valid pan-India." }
      ],

      patwari_report: [
        { id: "pat_rep_r1", label: "Patwari / Lekhpal Spot Verification", prerequisites: ["aadhaar", "electricity_bill"], visits: 1, days: 3, fee: 0, office: "Circle / Halka Office", tips: "Meet Patwari / Lekhpal during office hours." }
      ]
    }
  }
};
