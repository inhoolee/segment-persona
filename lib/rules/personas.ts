import type { PersonaProfile, SegmentInput } from "@/lib/types/segment";

export const PERSONA_CATALOG: Record<string, PersonaProfile> = {
  budget_starter: {
    id: "budget_starter",
    name: "예산 민감 탐색형",
    traits: ["초기 탐색 단계", "가격 민감도 높음", "반응 속도 빠름"],
    painPoints: ["첫 구매 장벽", "복잡한 가입 흐름", "가치 불명확"],
    imagePath: "/personas/budget-starter.svg",
  },
  steady_pragmatist: {
    id: "steady_pragmatist",
    name: "실속형 반복 사용자",
    traits: ["패턴 기반 소비", "비교 후 의사결정", "안정적 재방문"],
    painPoints: ["차별점 부족", "개인화 부족", "리텐션 자극 부족"],
    imagePath: "/personas/steady-pragmatist.svg",
  },
  premium_loyalist: {
    id: "premium_loyalist",
    name: "고가치 충성 사용자",
    traits: ["브랜드 신뢰 높음", "고액 결제 성향", "재구매 가능성 높음"],
    painPoints: ["보상 체감 저하", "VIP 경험 부재", "신규 혜택 편중"],
    imagePath: "/personas/premium-loyalist.svg",
  },
  churn_risk: {
    id: "churn_risk",
    name: "이탈 위험 관망형",
    traits: ["재방문 간격 길어짐", "관심도 하락", "자극 필요"],
    painPoints: ["재참여 동기 부족", "콘텐츠 피로", "혜택 인지 부족"],
    imagePath: "/personas/churn-risk.svg",
  },
};

const FALLBACK_PERSONA = PERSONA_CATALOG.steady_pragmatist;

const DOMAIN_PERSONA_MAP: Record<string, keyof typeof PERSONA_CATALOG> = {
  "e-commerce": "budget_starter",
  gaming: "budget_starter",
  travel: "budget_starter",
  saas: "steady_pragmatist",
  fintech: "steady_pragmatist",
  healthcare: "steady_pragmatist",
  education: "steady_pragmatist",
};

export function resolvePersona(input: SegmentInput): PersonaProfile {
  const domainKey = input.domain.trim().toLowerCase();

  if (input.paymentTier === "high" && ["regular", "loyal"].includes(input.visitFrequency)) {
    return PERSONA_CATALOG.premium_loyalist;
  }

  if (input.visitFrequency === "occasional") {
    return PERSONA_CATALOG.churn_risk;
  }

  if (input.visitFrequency === "new" && input.paymentTier === "low") {
    return PERSONA_CATALOG.budget_starter;
  }

  if (["10s", "20s"].includes(input.ageGroup) && input.paymentTier !== "high") {
    return PERSONA_CATALOG.budget_starter;
  }

  if (["40s", "50plus"].includes(input.ageGroup) && input.paymentTier === "high") {
    return PERSONA_CATALOG.premium_loyalist;
  }

  const domainPersonaId = DOMAIN_PERSONA_MAP[domainKey];
  if (domainPersonaId) {
    return PERSONA_CATALOG[domainPersonaId];
  }

  return FALLBACK_PERSONA;
}

export { FALLBACK_PERSONA };
