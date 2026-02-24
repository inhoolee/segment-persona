export const INDUSTRY_TYPES = ["B2B", "B2C"] as const;
export const AGE_GROUPS = ["10s", "20s", "30s", "40s", "50plus"] as const;
export const GENDERS = ["male", "female", "other"] as const;
export const VISIT_FREQUENCIES = ["new", "occasional", "regular", "loyal"] as const;
export const PAYMENT_TIERS = ["low", "mid", "high"] as const;
export const CHANNEL_PREFERENCES = ["email", "sms", "push", "inapp"] as const;

export type IndustryType = (typeof INDUSTRY_TYPES)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type Gender = (typeof GENDERS)[number];
export type VisitFrequency = (typeof VISIT_FREQUENCIES)[number];
export type PaymentTier = (typeof PAYMENT_TIERS)[number];
export type ChannelPreference = (typeof CHANNEL_PREFERENCES)[number];

export interface SegmentInput {
  industryType: IndustryType;
  domain: string;
  ageGroup: AgeGroup;
  gender: Gender;
  visitFrequency: VisitFrequency;
  paymentTier: PaymentTier;
  goal: string;
  channelPreference: ChannelPreference;
  note?: string;
}

export interface PersonaProfile {
  id: string;
  name: string;
  traits: string[];
  painPoints: string[];
  imagePath: string;
}

export interface ExpectedImpact {
  conversionLiftPctMin: number;
  conversionLiftPctMax: number;
  retentionLiftPctMin: number;
  retentionLiftPctMax: number;
}

export interface ApproachRecommendation {
  id: string;
  title: string;
  reason: string;
  requiredExtraFields: string[];
  actionSteps: string[];
  expectedImpact: ExpectedImpact;
  priority: number;
}

export interface AnalysisResult {
  persona: PersonaProfile;
  approaches: ApproachRecommendation[];
}

export type ExtraFieldInputType = "number" | "select";

export interface ExtraFieldDefinition {
  id: string;
  label: string;
  inputType: ExtraFieldInputType;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  defaultValue?: string;
}
