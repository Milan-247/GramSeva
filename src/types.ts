export type Language = 'en' | 'hi' | 'te' | 'ml';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ServiceTranslation {
  title: string;
  description: string;
  category: string;
  location: string;
  hours: string;
  contactName: string;
  notes?: string;
  history?: string[];
  volunteerNotesDetail?: string;
  additionalContacts?: string[];
}

export interface ServiceItem {
  id: string;
  categoryKey: 'health' | 'water' | 'agriculture' | 'education' | 'government';
  phoneNumber: string;
  lastVerified: string;
  isEmergency: boolean;
  translations: Record<Language, ServiceTranslation>;
  districtName?: string;
  localityName?: string;
}

export interface UIStrings {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  allCategories: string;
  health: string;
  water: string;
  agriculture: string;
  education: string;
  government: string;
  emergencyOnly: string;
  lastVerifiedLabel: string;
  contactLabel: string;
  hoursLabel: string;
  locationLabel: string;
  offlineStatus: string;
  offlineStatusDesc: string;
  noServicesFound: string;
  volunteerBadge: string;
  volunteerMessage: string;
  addServiceBtn: string;
  addServiceTitle: string;
  closeBtn: string;
  submitBtn: string;
  detailsTitle: string;
  historyLabel: string;
  extraNotesLabel: string;
  metadataLabel: string;
  shareLabel: string;
  reportUpdateLabel: string;
  serviceIdLabel: string;
  callVolunteerLabel: string;
  offlineProofLabel: string;
  verificationHistoryLabel: string;
}
