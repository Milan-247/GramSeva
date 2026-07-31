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
  { id: "building_plan_approval", name: "Approved Building Blueprint Plan", category: "property", anchor: false, desc: "Sanctioned layout by Corporation / Municipality" },
  
  // Additional Specialized Anchors
  { id: "pension_payment_order", name: "Pension Payment Order (PPO)", category: "finance", anchor: false, desc: "Treasury / Account General pension booklet number" },
  { id: "well_site_sketch", name: "Well / Borewell Hydrogeology Location Map", category: "property", anchor: false, desc: "Survey map showing proposed well & distance from public water sources" },
  { id: "orphanage_admission_letter", name: "Child Welfare Committee (CWC) Admission Order", category: "vital", anchor: false, desc: "CWC order certifying orphan / destitute status" },
  { id: "vessel_boat_reg", name: "Fishing Boat / Vessel Registration Certificate", category: "business", anchor: false, desc: "Fisheries department marine registration" },
  { id: "chitta_adangal_extract", name: "Chitta / Adangal / Village Survey Sketch", category: "property", anchor: false, desc: "Village revenue survey number extract" },
  { id: "police_clearance_report", name: "Station House Officer (SHO) Police Report", category: "legal", anchor: false, desc: "Local police station background check" }
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

  // Obscure & Specialized Certificates
  { id: "landless_cert", name: "Landless Agricultural Laborer Certificate", category: "obscure", desc: "Proves zero land holding for housing schemes (LIFE / PMAY) & land allotment" },
  { id: "borewell_noc", name: "Well Digging / Borewell Clearance NOC", category: "obscure", desc: "Groundwater Authority clearance before digging agricultural / commercial wells" },
  { id: "life_cert", name: "Pensioner Life Certificate (Jeevan Pramaan)", category: "obscure", desc: "Annual physical/biometric survival certificate for continued pension disbursement" },
  { id: "tribal_cert", name: "Customary / Tribal Origin Certificate", category: "obscure", desc: "Certified by Tribal Welfare Officer for Scheduled Tribe forest rights & quotas" },
  { id: "single_girl_cert", name: "Single Girl Child Certificate & Affidavit", category: "obscure", desc: "Special CBSE / University scholarship & seat reservation for single female child" },
  { id: "minority_cert", name: "Linguistic / Religious Minority Status Certificate", category: "obscure", desc: "Scholarships & minority quota in professional colleges" },
  { id: "explosives_noc", name: "Firecrackers Retail Storage License NOC", category: "obscure", desc: "District Magistrate clearance for festival firecracker stalls & explosive storage" },
  { id: "boiler_cert", name: "Boiler Attendant Competency Certificate", category: "obscure", desc: "Factories & Boilers Department certification for operating high-pressure industrial boilers" },
  { id: "orphan_cert", name: "Orphan / Destitute Person Certificate", category: "obscure", desc: "Women & Child Welfare quota in government employment & higher education" },
  { id: "property_fairvalue_cert", name: "Land Fair Value & Stamp Duty Valuation Cert", category: "obscure", desc: "Revenue officer valuation certificate for property transfer stamp paper calculation" },
  { id: "fisherman_cert", name: "Traditional Fisherman Identity & Subsidy Cert", category: "obscure", desc: "Fisheries department fuel allowance, boat subsidy, & lean-season relief" },
  { id: "artisan_cert", name: "Handloom Worker / Artisan Identity Certificate", category: "obscure", desc: "PM Vishwakarma & state artisan welfare board toolkits & loan subsidy" },
  { id: "birth_death_nac", name: "Non-Availability Certificate (NAC) for Birth/Death", category: "obscure", desc: "Official registrar certificate confirming record is missing in government archives" },
  { id: "encumbrance_cert", name: "Property Encumbrance Certificate (EC 13-30 Yrs)", category: "obscure", desc: "Sub-Registrar proof of clean property title free from mortgages or litigations" },
  { id: "location_sketch_cert", name: "Possession, Location & Boundary Sketch Cert", category: "obscure", desc: "Village Officer certified survey sketch required for bank mortgage loans" },
  { id: "tree_cutting_noc", name: "Tree Felling & Timber Transport Clearance NOC", category: "obscure", desc: "Forest / Social Forestry permission before cutting scheduled timber trees on private land" },
  { id: "caste_validity_cert", name: "Caste Validity Certificate (Scrutiny Committee)", category: "obscure", desc: "High-level scrutiny committee validation for medical/engineering admissions & elected seats" },
  { id: "bpl_cert", name: "Below Poverty Line (BPL) Family Certificate", category: "obscure", desc: "Block Development Officer certificate for free medical treatment & subsidised rations" },
  { id: "loudspeaker_noc", name: "Loudspeaker & Public Event Permission NOC", category: "obscure", desc: "Police & Revenue Divisional Officer clearance for temple festivals & public speakers" },
  { id: "cinema_license", name: "Cinema Exhibition / Video Parlour License", category: "obscure", desc: "District Magistrate permission under Cinema Regulation Act for public screenings" },

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

// Rich Procedural Knowledgebase mapping (What is required, Where to get it, How to get it)
export const CERTIFICATE_PROCEDURAL_GUIDE = {
  income_cert: {
    whatRequired: ["Aadhaar Card", "Ration Card", "Salary Slip / Form 16 or Village Officer Enquiry", "Land Revenue Tax Receipt"],
    whereToGet: "Village Office / Akshaya Kendra / Seva Sindhu / e-Sevai / Tehsildar Office",
    authority: "Village Officer / Tehsildar",
    howToGet: [
      "1. Submit application online at state portal (e-District / Akshaya / Seva Sindhu) or visit Jan Seva Kendra.",
      "2. Attach color scans of Aadhaar, Ration Card, and latest Salary Certificate or Agricultural Land Tax Receipt.",
      "3. Village Officer / Revenue Inspector conducts field verification or inspects income declarations.",
      "4. Upon approval, digitally signed Income Certificate is issued online within 3 to 7 working days with 1-year validity."
    ]
  },
  caste_cert: {
    whatRequired: ["Aadhaar Card", "Ration Card", "Parent / Sibling Caste Certificate or SSLC Transfer Certificate showing Caste"],
    whereToGet: "Village Office / Akshaya Kendra / Nada Kacheri / Tehsildar Counter",
    authority: "Tehsildar / Village Officer",
    howToGet: [
      "1. Apply online via state portal attaching father's or sibling's verified Caste Certificate.",
      "2. If parent caste certificate is unavailable, attach old school TC or revenue record of ancestral village.",
      "3. Revenue Inspector verifies family lineage and community entry in local caste register.",
      "4. Certificate is digitally signed by Tahsildar / Zonal Officer and downloadable with QR code verification."
    ]
  },
  landless_cert: {
    whatRequired: ["Aadhaar Card", "Ration Card (BPL)", "Self Declaration Affidavit (₹100 stamp paper)", "Neighbor Land Verification Statement"],
    whereToGet: "Village Office / Gram Panchayat / Tehsildar Revenue Branch",
    authority: "Village Officer / Tehsildar",
    howToGet: [
      "1. Submit application at Village Office / Akshaya / Seva Sindhu along with notarized landless affidavit.",
      "2. Village Officer inspects village land registry (Thandaper / Khata) to verify applicant owns zero agricultural or house land.",
      "3. Village Officer prepares field enquiry report confirming applicant is landless agricultural laborer.",
      "4. Tehsildar approves and issues Landless Certificate required for LIFE Mission & PMAY housing benefits."
    ]
  },
  borewell_noc: {
    whatRequired: ["Aadhaar Card", "Land Tax Receipt / Patta", "Hydrogeological Location Map / Well Site Survey Sketch", "Panchayat No-Objection Letter"],
    whereToGet: "State Groundwater Department / District Collectorate / K-SWIFT Portal",
    authority: "District Hydrogeologist / Groundwater Authority",
    howToGet: [
      "1. Submit online application at Groundwater Portal attaching land survey map & site sketch.",
      "2. Hydrogeologist conducts site inspection to verify minimum 200-meter safety distance from public drinking water sources.",
      "3. Payment of official inspection fee (₹500 - ₹2000).",
      "4. NOC issued specifying permitted depth and motor capacity for borewell digging."
    ]
  },
  life_cert: {
    whatRequired: ["Aadhaar Card", "Pension Payment Order (PPO)", "Bank Passbook linked to Pension Account", "Biometric Fingerprint or Face Authentication"],
    whereToGet: "Jeevan Pramaan Portal (Online) / Treasury Office / Akshaya / Post Office Bank",
    authority: "District Treasury Officer / Pension Disbursing Bank",
    howToGet: [
      "1. Visit local Post Office, Akshaya desk, Treasury, or download Jeevan Pramaan FaceApp on smartphone.",
      "2. Enter Aadhaar number and Pension Payment Order (PPO) number.",
      "3. Perform facial scan or fingerprint iris scan on UIDAI biometric reader.",
      "4. Pramaan ID SMS is instantly generated and pension continuous disbursement is automatically extended for 1 year."
    ]
  },
  tribal_cert: {
    whatRequired: ["Aadhaar Card", "Ration Card", "Tribal Settlement Record / Forest Rights Card", "Prominent Tribal Elder Recommendation Letter"],
    whereToGet: "Tribal Development Office / Sub-Collector / RDO Office",
    authority: "Revenue Divisional Officer (RDO) / Tribal Welfare Officer",
    howToGet: [
      "1. Submit application at RDO Office or Tribal Welfare Kendra with ancestral forest settlement proof.",
      "2. Tribal Extension Officer conducts field enquiry in hamlet/colony.",
      "3. District Vigilance Committee checks customary rituals and clan lineage.",
      "4. ST Certificate issued with life-long validity for education & job reservations."
    ]
  },
  single_girl_cert: {
    whatRequired: ["Parents' Aadhaar Cards", "Child's Birth Certificate & Aadhaar", "Notarized Stamp Paper Affidavit signed by First Class Magistrate / Notary"],
    whereToGet: "First Class Judicial Magistrate / Tehsildar / Notary Public",
    authority: "Judicial Magistrate / Tehsildar",
    howToGet: [
      "1. Draft affidavit on ₹100 stamp paper declaring applicant is the only child (female) of parents.",
      "2. Get affidavit sworn before Notary Public or First Class Judicial Magistrate.",
      "3. Submit affidavit copy to Tehsildar / School Principal / CBSE Portal for Indira Gandhi Single Girl Child Scholarship."
    ]
  },
  minority_cert: {
    whatRequired: ["Aadhaar Card", "SSLC Transfer Certificate stating Religion/Mother Tongue", "Self-Declaration of Minority Status"],
    whereToGet: "Revenue Office / Akshaya / Minorities Welfare Department Portal",
    authority: "Village Officer / Tehsildar / District Minority Officer",
    howToGet: [
      "1. Apply online attaching SSLC/School Certificate showing religion (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) or linguistic mother tongue.",
      "2. Village officer verifies family credentials.",
      "3. Download digitally signed Minority Certificate for college quota and Maulana Azad scholarships."
    ]
  },
  explosives_noc: {
    whatRequired: ["Applicant Aadhaar & PAN", "Proposed Storage Premises Blueprint Plan", "Fire Safety Clearance", "Police Verification Report"],
    whereToGet: "District Collectorate / District Magistrate Office",
    authority: "District Magistrate / Additional District Magistrate",
    howToGet: [
      "1. Submit Form LE-5 application at District Collectorate for temporary/permanent cracker storage.",
      "2. Inspection carried out by Divisional Fire Officer and Local Police Inspector for safety distances.",
      "3. Public notice issued for neighbor objections.",
      "4. District Magistrate signs Explosives Storage NOC valid for festival season or specified period."
    ]
  },
  boiler_cert: {
    whatRequired: ["10th Marksheet", "Industrial Training Institute (ITI) Boiler Certificate", "2 Years Practical Boiler Operation Experience Certificate"],
    whereToGet: "Directorate of Factories & Boilers",
    authority: "Chairman, Board of Examiners for Boiler Attendants",
    howToGet: [
      "1. Apply online at Factories & Boilers portal with experience certificate attested by Chief Engineer.",
      "2. Appear for practical oral examination & boiler safety viva.",
      "3. Qualified candidates receive Boiler Attendant Competency License Smart Card."
    ]
  },
  orphan_cert: {
    whatRequired: ["Child Birth Certificate", "Death Certificates of both Father & Mother", "Child Welfare Committee (CWC) Admission Order"],
    whereToGet: "District Child Protection Unit (DCPU) / CWC Office",
    authority: "District Child Protection Officer (DCPO) / CWC Chairman",
    howToGet: [
      "1. Submit death records of both parents to CWC / DCPU.",
      "2. Social Worker carries out background enquiry in ancestral village.",
      "3. Committee certifies applicant has no legal guardians or surviving parent.",
      "4. Certificate issued granting 1% reservation in government jobs and university seats."
    ]
  },
  property_fairvalue_cert: {
    whatRequired: ["Aadhaar Card", "Land Tax Receipt", "Latest Deed Copy / Survey Resurvey Number"],
    whereToGet: "Sub-Registrar Office (SRO) / Revenue Portal / Village Office",
    authority: "Sub-Registrar / Village Officer",
    howToGet: [
      "1. Check online state land fair value register using survey number.",
      "2. If land fair value is unassigned, apply at Revenue Office for field classification.",
      "3. Village Officer inspects road access (PWD road, Panchayat road, or landlocked).",
      "4. Fair Value Certificate issued determining exact stamp duty & registration fee required."
    ]
  },
  fisherman_cert: {
    whatRequired: ["Aadhaar Card", "Ration Card", "Fishing Boat Registration / Traditional Net License", "Cooperative Society Membership Card"],
    whereToGet: "Matsyafed / Fisheries Extension Office / Coastal Village Office",
    authority: "Assistant Director of Fisheries",
    howToGet: [
      "1. Apply via Fisheries Department portal attaching society membership card.",
      "2. Fisheries Inspector verifies coastal residence & marine activity.",
      "3. Smart Fisherman Biometric ID card issued for subsidised kerosene, diesel, & lean-season savings-cum-relief."
    ]
  },

  // Anchor Documents Procedural Guides
  aadhaar: {
    whatRequired: ["Existing Aadhaar Number / EID Slip", "Identity / Address Proof (Voter ID, Passport, SSLC)", "Biometric Capture (10 Fingerprints & Iris)"],
    whereToGet: "Aadhaar Seva Kendra / Post Office / Akshaya Kendra / UIDAI Portal (uidai.gov.in)",
    authority: "UIDAI (Unique Identification Authority of India)",
    howToGet: [
      "1. Book appointment online at UIDAI Portal or visit nearest Aadhaar Seva Kendra / Bank / Post Office.",
      "2. Submit demographic details and present original proof of identity & address.",
      "3. Complete biometric capture (photograph, 10 fingerprints, and dual iris scan).",
      "4. Receive Acknowledgement EID slip; e-Aadhaar PDF is downloadable online within 5 to 10 days using OTP."
    ]
  },
  pan_card: {
    whatRequired: ["Aadhaar Card (linked with mobile number for instant e-KYC)", "Passport Photograph"],
    whereToGet: "NSDL (Protean) / UTIITSL Portal / Income Tax e-Filing Portal (Instant e-PAN)",
    authority: "Income Tax Department (CBDT)",
    howToGet: [
      "1. Visit NSDL / UTIITSL portal or Income Tax e-Filing website for instant e-PAN.",
      "2. Authenticate via Aadhaar OTP for paperless e-KYC.",
      "3. Pay nominal fee (₹107 for physical card or Free for instant e-PAN PDF).",
      "4. Digital e-PAN is delivered via email in 10 minutes; physical laminated card mailed in 7 to 10 days."
    ]
  },
  ration_card: {
    whatRequired: ["Aadhaar Cards of all Family Members", "Recent Electricity Bill / House Tax Receipt", "Income Proof", "Surrender Certificate (if moving from another district)"],
    whereToGet: "Taluk Supply Office (TSO) / Akshaya Kendra / Civil Supplies Department Portal",
    authority: "District Supply Officer / Taluk Supply Officer",
    howToGet: [
      "1. Apply online via State Civil Supplies Portal (e.g. e-Citizen Portal) or Taluk Supply Office.",
      "2. Upload Aadhaar copies of all family members and electricity bill proof of residence.",
      "3. Ration Inspector conducts household verification.",
      "4. Smart Ration Card is printed or digital e-Ration card generated for PDS entitlement."
    ]
  },
  voter_id: {
    whatRequired: ["Aadhaar Card", "Proof of Age (SSLC / Birth Cert)", "Proof of Residence", "Passport Photograph"],
    whereToGet: "Voters' Service Portal (voters.eci.gov.in) / Voter Helpline App / BLO Counter",
    authority: "Electoral Registration Officer (ERO) / Election Commission of India",
    howToGet: [
      "1. Fill Form 6 online at voters.eci.gov.in or Voter Helpline mobile app.",
      "2. Upload photograph, age proof, and residence proof.",
      "3. Booth Level Officer (BLO) visits home for physical verification.",
      "4. EPIC number generated and physical PVC Voter ID card posted to residential address."
    ]
  },
  digilocker_acc: {
    whatRequired: ["Aadhaar Number", "Aadhaar-linked Mobile Number for OTP verification"],
    whereToGet: "DigiLocker Mobile App / Official Website (digilocker.gov.in)",
    authority: "Ministry of Electronics and IT (MeitY)",
    howToGet: [
      "1. Install DigiLocker app or open digilocker.gov.in.",
      "2. Enter 12-digit Aadhaar number and verify via OTP sent to registered mobile.",
      "3. Create 6-digit security PIN to access verified digital issued documents directly linked with government databases."
    ]
  },
  sslc_marksheet: {
    whatRequired: ["School Roll Number / Register Number", "School Leaving Transfer Certificate (TC) Copy"],
    whereToGet: "State Board of Secondary Education / DigiLocker / School Principal",
    authority: "Controller of Examinations / Board of Public Examinations",
    howToGet: [
      "1. Log in to DigiLocker app using Aadhaar.",
      "2. Search State Education Board or CBSE/ICSE and enter year of passing & roll number.",
      "3. Instant legally valid digital mark sheet PDF with QR code is fetched.",
      "4. For duplicate physical copy, submit application at Board office with school recommendation."
    ]
  },
  electricity_bill: {
    whatRequired: ["Consumer Account ID / KSEB / BESCOM / TANGEDCO Account Number"],
    whereToGet: "State Electricity Board Portal / Section Office / Google Pay / PhonePe / Paytm",
    authority: "State Electricity Distribution Company",
    howToGet: [
      "1. Download digital PDF bill receipt from State Electricity Board web portal or mobile app.",
      "2. Ensure bill date is less than 3 months old with applicant/parent name and clear address."
    ]
  },
  salary_slip: {
    whatRequired: ["Employer Company ID / DDO Verification", "Bank Statement showing salary credit"],
    whereToGet: "Employer HR Department / Drawing & Disbursing Officer (DDO) / SPARK Portal",
    authority: "Employer HR / Drawing & Disbursing Officer (DDO)",
    howToGet: [
      "1. Obtain signed Salary Certificate or Form 16 from employer HR or Government DDO.",
      "2. Ensure monthly basic pay, gross income, and annual total earnings are clearly mentioned."
    ]
  },
  bank_passbook: {
    whatRequired: ["Active Bank Account Number & IFSC Code", "Account Holder Aadhaar Card"],
    whereToGet: "Home Branch of Bank / Netbanking / Mobile Banking App",
    authority: "Bank Branch Manager",
    howToGet: [
      "1. Visit bank home branch for passbook printing kiosk or request e-Statement PDF via Netbanking.",
      "2. Ensure front page has bank manager seal, photo, name, address, and account number."
    ]
  },
  land_tax_receipt: {
    whatRequired: ["Thandaper / Khata / Patta Number", "Survey Resurvey Plot Number"],
    whereToGet: "Village Revenue Office / e-Revenue State Portal",
    authority: "Village Officer / Revenue Inspector",
    howToGet: [
      "1. Pay land revenue tax online via state revenue portal or visit Village Office.",
      "2. Obtain official e-Receipt showing current financial year tax payment and land extent."
    ]
  },
  artisan_cert: {
    whatRequired: ["Aadhaar Card", "Bank Passbook", "Photos of Handmade Products / Tools", "Gram Panchayat Trade Recommendation"],
    whereToGet: "District Industries Centre (DIC) / PM Vishwakarma Portal",
    authority: "General Manager DIC / Gram Panchayat Secretary",
    howToGet: [
      "1. Register online on PM Vishwakarma / State Handicrafts portal using Aadhaar bio-auth.",
      "2. Gram Panchayat Secretary verifies artisan trade (carpenter, blacksmith, weaver, potter, goldsmith).",
      "3. DIC approves application for ₹15,000 toolkit digital voucher & collateral-free loans @ 5% interest."
    ]
  },
  birth_death_nac: {
    whatRequired: ["Aadhaar Card", "Non-Existence Search Fee Receipt", "School TC / Passport / Hospital Record", "Affidavit"],
    whereToGet: "Local Body Registrar (Panchayat / Municipality / Corporation)",
    authority: "Registrar of Births & Deaths",
    howToGet: [
      "1. Submit application requesting record search for specific year of birth/death.",
      "2. Municipality conducts manual ledger search across 5-year range.",
      "3. If no record exists, Registrar issues Non-Availability Certificate (NAC).",
      "4. NAC allows applicant to apply to Revenue Divisional Magistrate for delayed birth/death registration."
    ]
  },
  encumbrance_cert: {
    whatRequired: ["Property Survey Number & Plot Address", "Period required (e.g., 13 to 30 years)", "Applicant Aadhaar Card"],
    whereToGet: "Sub-Registrar Office (SRO) / Kaveri / PEARL / TNREGINET Portal",
    authority: "Sub-Registrar",
    howToGet: [
      "1. Apply online at state registration department portal entering survey number and village name.",
      "2. Select required timeframe (e.g., 01-Jan-2000 to present date).",
      "3. Pay online official fee (₹100 - ₹300).",
      "4. Digitally signed Encumbrance Certificate (EC) listing all registered deeds, mortgages, & sales is downloadable within 24 hours."
    ]
  },
  location_sketch_cert: {
    whatRequired: ["Land Tax Receipt", "Title Deed Copy", "Survey Number"],
    whereToGet: "Village Office / Taluk Surveyor Office",
    authority: "Village Officer / Revenue Surveyor",
    howToGet: [
      "1. Apply at Village Office or e-District portal for Possession & Location Sketch.",
      "2. Village Surveyor conducts field measurement and draws boundary sketch.",
      "3. Certificate confirms exact boundaries, road access, and physical possession for bank loan approval."
    ]
  },
  tree_cutting_noc: {
    whatRequired: ["Land Revenue Receipt", "Applicant ID", "Details & Species of Trees (Teak, Rosewood, Sandalwood, Mahogany)"],
    whereToGet: "Forest Range Office / Social Forestry Division / K-SWIFT",
    authority: "Range Forest Officer (RFO) / Divisional Forest Officer",
    howToGet: [
      "1. Submit application at Forest Office specifying tree species and location on private land.",
      "2. Section Forest Officer inspects trees, measures girth, and marks tree numbers.",
      "3. Tree Cutting & Timber Transit Pass issued for felling and transporting wood."
    ]
  },
  caste_validity_cert: {
    whatRequired: ["Caste Certificate copy", "Ancestral pre-1950 primary school entries or land records", "Affidavit Form-3"],
    whereToGet: "District Caste Scrutiny Committee / Social Justice Department",
    authority: "Member Secretary, District Scrutiny Committee",
    howToGet: [
      "1. Forward application through college principal or government employer to Scrutiny Committee.",
      "2. Vigilance Cell conducts deep genealogical check in native village.",
      "3. Committee validates claim and issues Caste Validity Certificate mandatory for medical/engineering admissions."
    ]
  },
  bpl_cert: {
    whatRequired: ["Ration Card (BPL/AAY)", "Aadhaar Card", "Income Certificate (< ₹27,000 p.a.)"],
    whereToGet: "Block Development Office (BDO) / Gram Panchayat / Civil Supplies",
    authority: "Block Development Officer / Rationing Officer",
    howToGet: [
      "1. Apply at BDO Office attaching yellow/pink BPL Ration Card.",
      "2. Panchayat Secretary verifies house structure, vehicle ownership, and annual income.",
      "3. BPL Certificate issued for free medical treatment under Ayushman Bharat / Karunya scheme."
    ]
  },
  loudspeaker_noc: {
    whatRequired: ["Event Details & Date", "Organizers ID Proof", "Premises Owner Consent Letter", "Sanctioned Sound System Wattage"],
    whereToGet: "Local Police Station / Revenue Divisional Officer (RDO)",
    authority: "Sub-Inspector / Station House Officer / RDO",
    howToGet: [
      "1. Submit application 7 days prior to event listing loudspeaker specifications.",
      "2. Police verify timing compliance (prohibited between 10 PM and 6 AM under Noise Rules).",
      "3. Police clearance NOC issued with decibel limits and time conditions."
    ]
  },
  cinema_license: {
    whatRequired: ["Building Fitness Certificate", "Fire Safety NOC", "Electrical Inspectorate Approval", "Public Health Certificate"],
    whereToGet: "District Magistrate / District Collectorate / Police Commissionerate",
    authority: "District Collector / Licensing Authority",
    howToGet: [
      "1. Submit Form A application with 4 mandatory departmental NOCs (Fire, PWD Electrical, Health, Police).",
      "2. Multi-departmental inspection committee conducts theatre audit.",
      "3. Form C Cinema License issued under State Cinema Regulation Rules."
    ]
  }
};

// State-Specific Node Datasets
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

      // Obscure Nodes
      landless_cert: { name: "Landless Laborer Certificate", level: "Village Office", issueOffice: "Village Officer / Tehsildar" },
      borewell_noc: { name: "Well Digging NOC", level: "Groundwater Dept", issueOffice: "District Hydrogeologist" },
      life_cert: { name: "Pensioner Life Certificate", level: "Treasury / Akshaya", issueOffice: "District Treasury Officer" },
      tribal_cert: { name: "Customary Tribal Cert", level: "RDO Office", issueOffice: "Tribal Development Officer / RDO" },
      single_girl_cert: { name: "Single Girl Child Affidavit", level: "Magistrate / Village", issueOffice: "Judicial Magistrate / Tehsildar" },
      minority_cert: { name: "Minority Status Certificate", level: "Village Office", issueOffice: "Village Officer" },
      explosives_noc: { name: "Firecrackers Storage NOC", level: "Collectorate", issueOffice: "District Collector / ADM" },
      boiler_cert: { name: "Boiler Attendant License", level: "Factories & Boilers", issueOffice: "Director of Factories & Boilers" },
      orphan_cert: { name: "Orphan / Destitute Cert", level: "CWC Office", issueOffice: "District Child Protection Officer" },
      property_fairvalue_cert: { name: "Land Fair Value Cert", level: "Sub-Registrar / Village", issueOffice: "Village Officer / Sub-Registrar" },
      fisherman_cert: { name: "Fisherman Smart ID", level: "Matsyafed", issueOffice: "Assistant Director of Fisheries" },
      artisan_cert: { name: "Artisan Vishwakarma Cert", level: "DIC / Panchayat", issueOffice: "GM District Industries Centre" },
      birth_death_nac: { name: "Birth/Death Non-Availability Cert", level: "LSGD Secretary", issueOffice: "Municipal / Panchayat Registrar" },
      encumbrance_cert: { name: "Property Encumbrance Cert (EC)", level: "Sub Registrar", issueOffice: "Sub Registrar Office (SRO)" },
      location_sketch_cert: { name: "Location & Boundary Sketch", level: "Village Office", issueOffice: "Village Surveyor / Officer" },
      tree_cutting_noc: { name: "Tree Cutting Transport NOC", level: "Forest Office", issueOffice: "Range Forest Officer" },
      caste_validity_cert: { name: "Caste Validity Cert", level: "Scrutiny Committee", issueOffice: "District Scrutiny Committee" },
      bpl_cert: { name: "BPL Family Certificate", level: "Block Office", issueOffice: "Block Development Officer" },
      loudspeaker_noc: { name: "Loudspeaker Permit NOC", level: "Police Station", issueOffice: "Station House Officer (SHO)" },
      cinema_license: { name: "Cinema Video Exhibition License", level: "Collectorate", issueOffice: "District Magistrate" },

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
      landless_cert: [
        { id: "landless_ker_r1", label: "Thandaper Zero Entry + BPL Verification", prerequisites: ["aadhaar", "ration_card", "notarized_affidavit"], visits: 1, days: 5, fee: 28, office: "Village Office", tips: "Village Officer checks Thandaper register to certify zero land ownership." }
      ],
      borewell_noc: [
        { id: "borewell_ker_r1", label: "Hydrogeology Site Inspection Route", prerequisites: ["aadhaar", "land_tax_receipt", "well_site_sketch"], visits: 2, days: 12, fee: 500, office: "District Hydrogeologist Office", tips: "Ensures 200m distance from public drinking water sources." }
      ],
      life_cert: [
        { id: "life_ker_r1", label: "Jeevan Pramaan Biometric Route", prerequisites: ["aadhaar", "pension_payment_order", "bank_passbook"], visits: 0, days: 1, fee: 0, office: "Akshaya / Treasury / Post Office", tips: "Instant biometric or facial scan updates pension portal." }
      ],
      tribal_cert: [
        { id: "tribal_ker_r1", label: "Tribal Settlement & RDO Verification", prerequisites: ["aadhaar", "ration_card", "vo_field_report"], visits: 1, days: 10, fee: 0, office: "RDO Office / Tribal Office", tips: "Requires Tribal Extension Officer field visit." }
      ],
      single_girl_cert: [
        { id: "sgirl_ker_r1", label: "Magistrate Notarized Affidavit Route", prerequisites: ["aadhaar", "sslc_marksheet", "notarized_affidavit"], visits: 1, days: 2, fee: 100, office: "First Class Magistrate / Tehsildar", tips: "Affidavit swearing applicant is the only child." }
      ],
      minority_cert: [
        { id: "minor_ker_r1", label: "SSLC Religion Entry Route", prerequisites: ["aadhaar", "sslc_marksheet"], visits: 1, days: 3, fee: 28, office: "Village Office / Akshaya", tips: "SSLC Transfer Certificate entry proves minority status." }
      ],
      explosives_noc: [
        { id: "exp_ker_r1", label: "District Collectorate Safety Route", prerequisites: ["aadhaar", "police_clearance_report", "building_plan_approval"], visits: 2, days: 15, fee: 1000, office: "District Collectorate / Fire Station", tips: "Mandatory fire safety and police verification." }
      ],
      boiler_cert: [
        { id: "boiler_ker_r1", label: "Factories & Boilers Oral Exam Route", prerequisites: ["sslc_marksheet", "passport_photo"], visits: 2, days: 20, fee: 750, office: "Directorate of Factories & Boilers", tips: "Oral exam and practical safety demonstration." }
      ],
      orphan_cert: [
        { id: "orphan_ker_r1", label: "CWC Committee Inquiry Route", prerequisites: ["aadhaar", "death_cert", "orphanage_admission_letter"], visits: 2, days: 14, fee: 0, office: "District Child Protection Office", tips: "Issued for 1% government employment quota." }
      ],
      property_fairvalue_cert: [
        { id: "fairv_ker_r1", label: "Revenue Survey Inspection Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 1, days: 4, fee: 50, office: "Village Office / Sub-Registrar", tips: "Determines official stamp duty for land registration." }
      ],
      fisherman_cert: [
        { id: "fish_ker_r1", label: "Matsyafed Cooperative Verification", prerequisites: ["aadhaar", "vessel_boat_reg", "bank_passbook"], visits: 1, days: 5, fee: 0, office: "Fisheries Office / Matsyafed", tips: "Issued for subsidised kerosene & marine relief." }
      ],
      artisan_cert: [
        { id: "artisan_ker_r1", label: "PM Vishwakarma Biometric Verification", prerequisites: ["aadhaar", "bank_passbook", "passport_photo"], visits: 1, days: 3, fee: 0, office: "Gram Panchayat / DIC", tips: "Unlocks ₹15,000 toolkit voucher & low-interest loan." }
      ],
      birth_death_nac: [
        { id: "nac_ker_r1", label: "Panchayat Ledger Search Route", prerequisites: ["aadhaar", "notarized_affidavit"], visits: 1, days: 5, fee: 50, office: "Grama Panchayat / Corporation", tips: "Certifies non-existence of old birth/death record." }
      ],
      encumbrance_cert: [
        { id: "ec_ker_r1", label: "PEARL SRO Online Search Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 0, days: 1, fee: 120, office: "PEARL SRO Online Portal", tips: "Instant download of 13-30 year encumbrance search." }
      ],
      location_sketch_cert: [
        { id: "loc_ker_r1", label: "Village Surveyor Measurement Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 1, days: 5, fee: 50, office: "Village Office", tips: "Certified boundary survey map for bank mortgage." }
      ],
      tree_cutting_noc: [
        { id: "tree_ker_r1", label: "Forest Range Officer Audit Route", prerequisites: ["aadhaar", "land_tax_receipt"], visits: 2, days: 10, fee: 100, office: "Range Forest Office", tips: "Required before felling teak/rosewood/sandalwood." }
      ],
      caste_validity_cert: [
        { id: "cvalid_ker_r1", label: "District Scrutiny Committee Route", prerequisites: ["aadhaar", "caste_cert", "sslc_marksheet"], visits: 2, days: 30, fee: 100, office: "District Scrutiny Committee", tips: "Deep ancestral check for medical/engineering seats." }
      ],
      bpl_cert: [
        { id: "bpl_ker_r1", label: "Civil Supplies BPL Verification", prerequisites: ["aadhaar", "ration_card", "income_cert"], visits: 1, days: 3, fee: 0, office: "Block Development Office", tips: "Required for free hospital treatment schemes." }
      ],
      loudspeaker_noc: [
        { id: "speaker_ker_r1", label: "Police Station NOC Route", prerequisites: ["aadhaar", "police_clearance_report"], visits: 1, days: 2, fee: 0, office: "Local Police Station", tips: "Clearance for temple/public sound amplifiers." }
      ],
      cinema_license: [
        { id: "cinema_ker_r1", label: "Multi-Departmental Collectorate License", prerequisites: ["aadhaar", "fire_noc_cert", "building_occupancy_cert"], visits: 3, days: 30, fee: 2000, office: "District Collectorate", tips: "Required under Cinema Regulation Act." }
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

      landless_cert: { name: "Landless Laborer Cert", level: "Nada Kacheri", issueOffice: "Tehsildar / Village Accountant" },
      borewell_noc: { name: "Borewell Drilling NOC", level: "Groundwater Board", issueOffice: "Executive Engineer Hydrogeology" },
      life_cert: { name: "Jeevan Pramaan Life Cert", level: "Treasury / Grama One", issueOffice: "Treasury Officer" },
      tribal_cert: { name: "Soliga / Jenu Kuruba Tribal Cert", level: "Taluk Office", issueOffice: "Tehsildar" },
      single_girl_cert: { name: "Single Girl Child Affidavit", level: "Nada Kacheri", issueOffice: "Tehsildar / Notary" },
      minority_cert: { name: "Minority Status Certificate", level: "Nada Kacheri", issueOffice: "Tehsildar" },
      explosives_noc: { name: "Cracker Storage NOC", level: "DC Office", issueOffice: "Deputy Commissioner" },
      boiler_cert: { name: "Boiler Operator License", level: "Boiler Dept", issueOffice: "Chief Inspector of Boilers" },
      orphan_cert: { name: "Orphan Certificate", level: "Child Welfare", issueOffice: "District Child Protection Officer" },
      property_fairvalue_cert: { name: "Kaveri Valuation Cert", level: "Sub Registrar", issueOffice: "Sub Registrar" },
      fisherman_cert: { name: "Fisherman Identity Card", level: "Fisheries Dept", issueOffice: "Assistant Director of Fisheries" },
      artisan_cert: { name: "Artisan Vishwakarma ID", level: "DIC Karnataka", issueOffice: "GM DIC" },
      birth_death_nac: { name: "Birth/Death NAC", level: "e-Janma Registrar", issueOffice: "e-Janma Officer" },
      encumbrance_cert: { name: "Kaveri Encumbrance Cert (EC)", level: "Kaveri SRO Portal", issueOffice: "Sub Registrar" },
      location_sketch_cert: { name: "Bhoomi Location Sketch", level: "Hobli Office", issueOffice: "Hobli Surveyor" },
      tree_cutting_noc: { name: "Tree Felling NOC", level: "Forest Dept", issueOffice: "Range Forest Officer" },
      caste_validity_cert: { name: "Caste Validity Cert", level: "Scrutiny Committee", issueOffice: "District Scrutiny Committee" },
      bpl_cert: { name: "BPL Certificate", level: "Food & Civil Supplies", issueOffice: "Tehsildar / BDO" },
      loudspeaker_noc: { name: "Loudspeaker Permit", level: "Police Station", issueOffice: "Station House Officer" },
      cinema_license: { name: "Cinema Video License", level: "DC Office", issueOffice: "Deputy Commissioner" },

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

      landless_cert: { name: "Landless Laborer Cert", level: "e-Sevai", issueOffice: "VAO / Tehsildar" },
      borewell_noc: { name: "Borewell Clearance NOC", level: "Groundwater Authority", issueOffice: "Executive Engineer" },
      life_cert: { name: "Pensioner Life Cert", level: "Treasury / e-Sevai", issueOffice: "Treasury Officer" },
      tribal_cert: { name: "ST Tribal Origin Cert", level: "RDO Office", issueOffice: "Revenue Divisional Officer" },
      single_girl_cert: { name: "Single Girl Child Affidavit", level: "e-Sevai", issueOffice: "Tehsildar / Notary" },
      minority_cert: { name: "Minority Status Cert", level: "e-Sevai", issueOffice: "Tehsildar" },
      explosives_noc: { name: "Cracker License NOC", level: "Collectorate", issueOffice: "District Collector" },
      boiler_cert: { name: "Boiler Attendant License", level: "Boiler Directorate", issueOffice: "Chief Inspector" },
      orphan_cert: { name: "Orphan Certificate", level: "CWC Office", issueOffice: "District Child Protection Officer" },
      property_fairvalue_cert: { name: "Guide Value Cert", level: "Sub Registrar", issueOffice: "Sub Registrar" },
      fisherman_cert: { name: "Fisherman ID Card", level: "Fisheries Dept", issueOffice: "Assistant Director" },
      artisan_cert: { name: "Artisan Vishwakarma ID", level: "DIC TN", issueOffice: "GM DIC" },
      birth_death_nac: { name: "Birth/Death NAC", level: "Corporation/Panchayat", issueOffice: "Registrar" },
      encumbrance_cert: { name: "TNREGINET EC Cert", level: "TNREGINET Portal", issueOffice: "Sub Registrar" },
      location_sketch_cert: { name: "VAO Location Sketch", level: "VAO Office", issueOffice: "VAO / Surveyor" },
      tree_cutting_noc: { name: "Tree Cutting NOC", level: "Forest Dept", issueOffice: "District Forest Officer" },
      caste_validity_cert: { name: "Community Validity Cert", level: "Scrutiny Committee", issueOffice: "District Collectorate" },
      bpl_cert: { name: "BPL Family Cert", level: "BDO Office", issueOffice: "Block Development Officer" },
      loudspeaker_noc: { name: "Sound System NOC", level: "Police Station", issueOffice: "Inspector of Police" },
      cinema_license: { name: "Cinema Video License", level: "Collectorate", issueOffice: "District Collector" },

      ews_cert: { name: "EWS Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      solvency_cert: { name: "Solvency Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      legal_heir_cert: { name: "Legal Heir Certificate", level: "Taluk Office", issueOffice: "Tehsildar" },
      family_membership_cert: { name: "Family Member Cert", level: "e-Sevai", issueOffice: "VAO / Revenue Inspector" },
      non_remarriage_cert: { name: "Non-Remarriage Cert", level: "e-Sevai", issueOffice: "Tehsildar" },
      one_and_same_cert: { name: "One and Same Cert", level: "e-Sevai", issueOffice: "Tehsildar" },
      possession_valuation_cert: { name: "Patta Chitta & Valuation", level: "AnyttTN Portal", issueOffice: "VAO" },
      dependent_cert: { name: "Ex-Serviceman Dependent", level: "Sainik Welfare", issueOffice: "Deputy Director" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Cert", level: "Social Welfare", issueOffice: "District Social Welfare Officer" },
      farmer_cert: { name: "Farmer Identity Cert", level: "Agriculture Dept", issueOffice: "Assistant Director Agriculture" },
      unemployment_cert: { name: "Unemployment Cert", level: "Employment Exchange", issueOffice: "District Employment Officer" },

      birth_cert: { name: "Birth Certificate (tnreginet)", level: "Urban Local Body", issueOffice: "Health Officer / VAO" },
      death_cert: { name: "Death Certificate (tnreginet)", level: "Urban Local Body", issueOffice: "Health Officer / VAO" },
      marriage_cert: { name: "Marriage Certificate (TNREGINET)", level: "Sub Registrar", issueOffice: "Sub Registrar Office (SRO)" },
      pwd_udid_cert: { name: "UDID Disability Certificate", level: "District Hospital", issueOffice: "Joint Director Health Services" },
      senior_citizen_cert: { name: "Senior Citizen ID", level: "Social Welfare", issueOffice: "e-Sevai / Social Welfare Officer" },
      transgender_id_cert: { name: "Transgender Identity Card", level: "Collectorate", issueOffice: "District Collector" },
      surviving_member_cert: { name: "Surviving Member Cert", level: "Taluk Office", issueOffice: "Tehsildar" },

      transfer_cert: { name: "School / College TC", level: "Institution", issueOffice: "Principal" },
      migration_cert: { name: "Migration Certificate", level: "DGE TN / University", issueOffice: "Director of Govt Exams" },
      conduct_character_cert: { name: "Character Certificate", level: "Police / School", issueOffice: "Police Station / Principal" },
      study_cert: { name: "Continuous Study Cert (7 Yrs)", level: "CEO Office", issueOffice: "Chief Educational Officer" },
      gap_cert: { name: "Gap Affidavit", level: "Notary", issueOffice: "Advocate Notary" },
      equivalence_cert: { name: "Equivalence Certificate", level: "Anna University / TNOU", issueOffice: "University Registrar" },

      trade_license: { name: "GCC / Municipal Trade License", level: "Corporation", issueOffice: "City Health Officer" },
      fssai_license: { name: "FSSAI Food License", level: "FSSAI Dept", issueOffice: "Designated Officer" },
      udyam_msme_cert: { name: "Udyam MSME Registration", level: "MSME Ministry", issueOffice: "DIC Tamil Nadu" },
      fire_noc_cert: { name: "TN Fire Safety NOC", level: "Fire Dept", issueOffice: "Divisional Fire Officer" },
      building_occupancy_cert: { name: "CMDA / DTCP Occupancy Cert", level: "Town Planning", issueOffice: "Member Secretary CMDA" },

      driving_license: { name: "TN RTO DL Smart Card", level: "Transport Dept", issueOffice: "RTO" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "Transport Dept", issueOffice: "RTO" },
      vehicle_fitness_cert: { name: "Vehicle FC", level: "RTO Track", issueOffice: "MVI Grade 1" },
      puc_cert: { name: "Pollution Certificate", level: "Testing Center", issueOffice: "Authorized Testing Center" }
    },
    routes: {
      domicile_cert: [
        { id: "dom_tn_r1", label: "e-Sevai CAN Number Route", prerequisites: ["aadhaar", "electricity_bill", "ration_card"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center / TNeGA", tips: "Requires CAN number registration." }
      ],
      income_cert: [
        { id: "inc_tn_r1", label: "VAO + Revenue Inspector Route", prerequisites: ["aadhaar", "ration_card", "salary_slip"], visits: 1, days: 7, fee: 60, office: "e-Sevai / VAO", tips: "VAO verifies household income." }
      ],
      caste_cert: [
        { id: "caste_tn_r1", label: "Community Certificate (TNeGA)", prerequisites: ["aadhaar", "parent_caste_cert", "ration_card"], visits: 1, days: 5, fee: 60, office: "e-Sevai Center", tips: "Deputy Tehsildar approves digitally." }
      ]
    }
  },

  pan_india: {
    stateName: "Pan-India (National)",
    portalName: "National e-District Portal, DigiLocker, & Tehsil Counters",
    nodes: {
      income_cert: { name: "Income Certificate", level: "Tehsil / Jan Seva Kendra", issueOffice: "Tehsildar / SDO" },
      caste_cert: { name: "Caste / Tribe Certificate", level: "Tehsil / CSC", issueOffice: "Tehsildar / Sub-Divisional Magistrate" },
      domicile_cert: { name: "Domicile / PRC Certificate", level: "Tehsil", issueOffice: "Tehsildar / District Magistrate" },
      obc_ncl_cert: { name: "Central OBC Certificate", level: "Tehsil / SDM Office", issueOffice: "Sub-Divisional Magistrate (SDM)" },
      nativity_cert: { name: "Nativity Certificate", level: "Tehsil", issueOffice: "Tehsildar" },
      ews_cert: { name: "Central EWS Certificate", level: "Tehsil", issueOffice: "Tehsildar / Revenue Officer" },
      solvency_cert: { name: "Solvency Certificate", level: "Collectorate", issueOffice: "District Magistrate / Collector" },
      legal_heir_cert: { name: "Legal Heir / Succession Cert", level: "Civil Court / Tehsil", issueOffice: "Tehsildar / Civil Judge" },
      family_membership_cert: { name: "Family Tree Certificate", level: "Tehsil", issueOffice: "Revenue Officer" },
      non_remarriage_cert: { name: "Non-Remarriage Certificate", level: "Tehsil", issueOffice: "Tehsildar" },
      one_and_same_cert: { name: "One and Same Person Cert", level: "Tehsil", issueOffice: "Tehsildar" },
      possession_valuation_cert: { name: "Land Possession Cert", level: "Tehsil / Land Records", issueOffice: "Patwari / Tehsildar" },
      dependent_cert: { name: "Ex-Serviceman Dependent Cert", level: "Zilla Sainik Board", issueOffice: "Sainik Welfare Officer" },
      intercaste_marriage_cert: { name: "Inter-caste Marriage Cert", level: "District Social Welfare", issueOffice: "Social Welfare Officer" },
      farmer_cert: { name: "PM-Kisan Farmer Certificate", level: "Agriculture Office", issueOffice: "District Agriculture Officer" },
      unemployment_cert: { name: "Unemployment Certificate", level: "Employment Office", issueOffice: "District Employment Officer" },

      landless_cert: { name: "Landless Laborer Cert", level: "Tehsil / Block", issueOffice: "Tehsildar / BDO" },
      borewell_noc: { name: "Borewell Clearance NOC", level: "CGWA Portal", issueOffice: "Central Ground Water Authority" },
      life_cert: { name: "Jeevan Pramaan Life Cert", level: "Jeevan Pramaan Portal", issueOffice: "Treasury / Pension Disbursing Agency" },
      tribal_cert: { name: "Scheduled Tribe Origin Cert", level: "SDM Office", issueOffice: "Sub-Divisional Magistrate" },
      single_girl_cert: { name: "Single Girl Child Affidavit", level: "Court / Tehsil", issueOffice: "First Class Magistrate" },
      minority_cert: { name: "Minority Community Cert", level: "Tehsil / Welfare", issueOffice: "Tehsildar" },
      explosives_noc: { name: "Cracker Storage NOC", level: "PESO / DM Office", issueOffice: "District Magistrate" },
      boiler_cert: { name: "Boiler Operation License", level: "Boiler Inspectorate", issueOffice: "Chief Inspector of Boilers" },
      orphan_cert: { name: "Orphan Certificate", level: "CARA / DCPU", issueOffice: "District Child Protection Officer" },
      property_fairvalue_cert: { name: "Stamp Duty Valuation Cert", level: "Tehsil / Sub Registrar", issueOffice: "Tehsildar / Sub Registrar" },
      fisherman_cert: { name: "Fisherman Biometric Card", level: "Fisheries Dept", issueOffice: "Assistant Director Fisheries" },
      artisan_cert: { name: "PM Vishwakarma Artisan Cert", level: "Vishwakarma Portal", issueOffice: "MSME DIC" },
      birth_death_nac: { name: "Birth/Death Non-Availability Cert", level: "Municipal Registrar", issueOffice: "Registrar Births & Deaths" },
      encumbrance_cert: { name: "Encumbrance Certificate (EC)", level: "Sub Registrar Office", issueOffice: "Sub Registrar" },
      location_sketch_cert: { name: "Patwari Land Sketch", level: "Tehsil Revenue", issueOffice: "Patwari / Revenue Inspector" },
      tree_cutting_noc: { name: "Tree Cutting Transit NOC", level: "Forest Division", issueOffice: "Divisional Forest Officer" },
      caste_validity_cert: { name: "Caste Validity Certificate", level: "Scrutiny Committee", issueOffice: "District Scrutiny Committee" },
      bpl_cert: { name: "BPL Certificate", level: "BDO Office", issueOffice: "Block Development Officer" },
      loudspeaker_noc: { name: "Loudspeaker Event NOC", level: "Police Commissionerate", issueOffice: "ACP / SHO" },
      cinema_license: { name: "Cinema License", level: "District Collectorate", issueOffice: "District Magistrate" },

      birth_cert: { name: "Birth Certificate (CRS Org)", level: "Registrar Office", issueOffice: "Registrar (Births & Deaths)" },
      death_cert: { name: "Death Certificate (CRS Org)", level: "Registrar Office", issueOffice: "Registrar (Births & Deaths)" },
      marriage_cert: { name: "Marriage Registration Cert", level: "Sub Registrar Office", issueOffice: "Marriage Officer / Registrar" },
      pwd_udid_cert: { name: "UDID Disability Smart Card", level: "Swavlamban Portal", issueOffice: "District Medical Authority" },
      senior_citizen_cert: { name: "Senior Citizen Card", level: "District Social Welfare", issueOffice: "Social Welfare Officer" },
      transgender_id_cert: { name: "Transgender Identity Card", level: "National Portal", issueOffice: "District Magistrate" },
      surviving_member_cert: { name: "Surviving Member Cert", level: "Tehsil", issueOffice: "Tehsildar" },

      transfer_cert: { name: "School Transfer Certificate", level: "School / Institution", issueOffice: "Principal / Headmaster" },
      migration_cert: { name: "Board Migration Certificate", level: "CBSE / ICSE / Board", issueOffice: "Controller of Examinations" },
      conduct_character_cert: { name: "Character Certificate", level: "Police / College", issueOffice: "Principal / Police Officer" },
      study_cert: { name: "Continuous Study Cert", level: "School / DIOS", issueOffice: "District Inspector of Schools" },
      gap_cert: { name: "Educational Gap Affidavit", level: "Notary Public", issueOffice: "Notary Public" },
      equivalence_cert: { name: "AIU Equivalence Cert", level: "Association of Indian Univ", issueOffice: "AIU Evaluation Officer" },

      trade_license: { name: "Municipal Trade License", level: "Municipal Corporation", issueOffice: "Health Officer" },
      fssai_license: { name: "FSSAI License (FoSCoS)", level: "FSSAI Portal", issueOffice: "Designated Officer" },
      udyam_msme_cert: { name: "MSME Udyam Registration", level: "Udyam Portal", issueOffice: "MSME Ministry" },
      fire_noc_cert: { name: "Fire Safety NOC", level: "Fire Service Dept", issueOffice: "Divisional Fire Officer" },
      building_occupancy_cert: { name: "Building Occupancy Cert", level: "Development Authority", issueOffice: "Chief Town Planner" },

      driving_license: { name: "Driving License (Parivahan)", level: "RTO Office", issueOffice: "RTO" },
      vehicle_rc: { name: "Vehicle RC Smart Card", level: "RTO Office", issueOffice: "RTO" },
      vehicle_fitness_cert: { name: "Vehicle Fitness Certificate", level: "RTO Inspection Ground", issueOffice: "Motor Vehicle Inspector" },
      puc_cert: { name: "Pollution Under Control (PUC)", level: "Testing Center", issueOffice: "Authorized Testing Center" }
    },
    routes: {
      income_cert: [
        { id: "inc_pan_r1", label: "e-District CSC Route", prerequisites: ["aadhaar", "ration_card", "salary_slip"], visits: 1, days: 7, fee: 30, office: "Common Service Centre (CSC) / Tehsil", tips: "Patwari verifies annual household income." }
      ],
      caste_cert: [
        { id: "caste_pan_r1", label: "Parent Caste Record Linked Route", prerequisites: ["aadhaar", "parent_caste_cert", "sslc_marksheet"], visits: 1, days: 7, fee: 30, office: "Tehsil Office / CSC", tips: "Requires father's caste proof." }
      ]
    }
  }
};

// Helper function to get rich procedural details for ANY certificate
export function getCertificateDetails(certId, stateKey = "kerala") {
  const customGuide = CERTIFICATE_PROCEDURAL_GUIDE[certId];
  const targetCert = TARGET_CERTIFICATES.find((t) => t.id === certId);
  const anchorDoc = ANCHOR_DOCUMENTS.find((a) => a.id === certId);
  const stateData = STATE_DATASETS[stateKey] || STATE_DATASETS.kerala;
  const nodeData = stateData.nodes[certId] || {
    name: targetCert?.name || anchorDoc?.name || certId,
    issueOffice: anchorDoc ? "Designated Issuing Authority" : "Tehsildar / Revenue Department",
    level: "Citizen Service Desk"
  };
  const routeData = stateData.routes[certId]?.[0];

  const resolvedName = targetCert?.name || anchorDoc?.name || (nodeData.name !== certId ? nodeData.name : certId.replace(/_/g, " ").toUpperCase());
  const resolvedCategory = targetCert?.category || anchorDoc?.category || "general";
  const resolvedDesc = targetCert?.desc || anchorDoc?.desc || "Official Government Certificate / Identification Document";

  if (customGuide) {
    return {
      certId,
      name: resolvedName,
      category: resolvedCategory,
      desc: resolvedDesc,
      whereToGet: customGuide.whereToGet || `${nodeData.issueOffice} (${stateData.portalName})`,
      authority: customGuide.authority || nodeData.issueOffice,
      whatRequired: customGuide.whatRequired,
      howToGet: customGuide.howToGet,
      fee: routeData?.fee ?? 30,
      days: routeData?.days ?? 7,
      visits: routeData?.visits ?? 1,
      tips: routeData?.tips || "Verify all document names match Aadhaar before applying."
    };
  }

  // Fallback procedural builder if custom guide is not individually listed
  const prereqs = routeData?.prerequisites || ["aadhaar", "ration_card", "passport_photo"];
  const prereqNames = prereqs.map((p) => {
    const anchor = ANCHOR_DOCUMENTS.find((a) => a.id === p);
    if (anchor) return anchor.name;
    const target = TARGET_CERTIFICATES.find((t) => t.id === p);
    if (target) return target.name;
    return p;
  });

  return {
    certId,
    name: resolvedName,
    category: resolvedCategory,
    desc: resolvedDesc,
    whereToGet: `${nodeData.issueOffice} (${stateData.portalName})`,
    authority: nodeData.issueOffice,
    whatRequired: prereqNames.concat(["Self Declaration Affidavit", "Passport Size Photograph"]),
    howToGet: [
      `1. Apply online via state portal (${stateData.portalName}) or visit local Citizen Service Desk (${nodeData.level}).`,
      `2. Attach color scanned copies of mandatory prerequisites: ${prereqNames.join(", ")}.`,
      `3. Designated field officer (${nodeData.issueOffice}) verifies application records and carries out field verification.`,
      `4. Upon digital signature by authority, the official certificate with QR code is generated and downloadable.`
    ],
    fee: routeData?.fee ?? 30,
    days: routeData?.days ?? 7,
    visits: routeData?.visits ?? 1,
    tips: routeData?.tips || "Keep digital color copies ready for portal upload."
  };
}
