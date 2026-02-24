import type {
  AgeGroup,
  ChannelPreference,
  Gender,
  IndustryType,
  PaymentTier,
  VisitFrequency,
} from "@/lib/types/segment";

export const DOMAIN_OPTIONS = [
  "SaaS",
  "E-commerce",
  "Fintech",
  "Healthcare",
  "Education",
  "Travel",
  "Gaming",
] as const;

export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  B2B: "B2B",
  B2C: "B2C",
};

export const AGE_LABELS: Record<AgeGroup, string> = {
  "10s": "10대",
  "20s": "20대",
  "30s": "30대",
  "40s": "40대",
  "50plus": "50대 이상",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "남성",
  female: "여성",
  other: "기타",
};

export const VISIT_LABELS: Record<VisitFrequency, string> = {
  new: "신규",
  occasional: "가끔 방문",
  regular: "정기 방문",
  loyal: "충성 고객",
};

export const PAYMENT_LABELS: Record<PaymentTier, string> = {
  low: "낮음",
  mid: "중간",
  high: "높음",
};

export const CHANNEL_LABELS: Record<ChannelPreference, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
  inapp: "In-App",
};

export const GOAL_OPTIONS = [
  { label: "전환율 개선", value: "conversion" },
  { label: "재방문율 개선", value: "retention" },
  { label: "평균 결제금액 증대", value: "arpu" },
  { label: "이탈률 감소", value: "churn" },
];
