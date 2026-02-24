import type {
  ApproachRecommendation,
  ExpectedImpact,
  SegmentInput,
} from "@/lib/types/segment";
import { getExtraFieldDefinitionById } from "@/lib/rules/extraFields";

const APPROACH_DEFINITIONS: Record<
  string,
  {
    id: string;
    title: string;
    requiredExtraFields: string[];
    actionSteps: string[];
    baseImpact: ExpectedImpact;
  }
> = {
  quick_onboarding: {
    id: "quick_onboarding",
    title: "초기 온보딩 전환 최적화",
    requiredExtraFields: ["onboardingWindowDays"],
    actionSteps: [
      "첫 방문 후 24시간 내 핵심 가치 메시지를 노출합니다.",
      "가입/첫 결제 흐름을 2단계 이하로 단축합니다.",
      "이탈 지점별 가이드를 툴팁으로 제공합니다.",
    ],
    baseImpact: {
      conversionLiftPctMin: 4,
      conversionLiftPctMax: 11,
      retentionLiftPctMin: 2,
      retentionLiftPctMax: 7,
    },
  },
  high_value_retention: {
    id: "high_value_retention",
    title: "고가치 고객 유지 프로그램",
    requiredExtraFields: ["vipTouchpoint"],
    actionSteps: [
      "고액 결제군에 전용 혜택/리워드를 분리 운영합니다.",
      "담당자/브랜드 매니저 접점을 정기화합니다.",
      "이탈 신호 발생 전 선제 케어를 실행합니다.",
    ],
    baseImpact: {
      conversionLiftPctMin: 3,
      conversionLiftPctMax: 8,
      retentionLiftPctMin: 6,
      retentionLiftPctMax: 15,
    },
  },
  reactivation_loop: {
    id: "reactivation_loop",
    title: "휴면 전환 방지 리액티베이션",
    requiredExtraFields: ["discountRate"],
    actionSteps: [
      "최근 접속 공백 기간 기준으로 재활성화 타이밍을 분기합니다.",
      "쿠폰/콘텐츠를 결합한 2단계 리마인드 시퀀스를 구성합니다.",
      "재방문 후 7일 내 재이탈 방지 메시지를 추가합니다.",
    ],
    baseImpact: {
      conversionLiftPctMin: 2,
      conversionLiftPctMax: 9,
      retentionLiftPctMin: 4,
      retentionLiftPctMax: 12,
    },
  },
  bundle_upsell: {
    id: "bundle_upsell",
    title: "번들 업셀링 시나리오",
    requiredExtraFields: ["bundleDepth"],
    actionSteps: [
      "결제 이력 기반으로 연관 상품 번들을 제안합니다.",
      "가격 대비 가치가 높은 조합을 우선 노출합니다.",
      "업셀 제안 후 미반응 사용자에게 대체 번들을 제공합니다.",
    ],
    baseImpact: {
      conversionLiftPctMin: 3,
      conversionLiftPctMax: 10,
      retentionLiftPctMin: 2,
      retentionLiftPctMax: 8,
    },
  },
  content_personalization: {
    id: "content_personalization",
    title: "행동 기반 콘텐츠 개인화",
    requiredExtraFields: ["contentCadence"],
    actionSteps: [
      "세그먼트별 선호 콘텐츠를 3개 묶음으로 구성합니다.",
      "채널 선호도에 따라 메시지 포맷을 분기합니다.",
      "주기별 반응률을 측정해 다음 사이클에 반영합니다.",
    ],
    baseImpact: {
      conversionLiftPctMin: 2,
      conversionLiftPctMax: 7,
      retentionLiftPctMin: 3,
      retentionLiftPctMax: 9,
    },
  },
};

type Rule = {
  approachId: keyof typeof APPROACH_DEFINITIONS;
  weight: number;
  reason: string;
  when: (input: SegmentInput) => boolean;
};

const RULES: Rule[] = [
  {
    approachId: "quick_onboarding",
    weight: 7,
    reason: "신규/초기 탐색 고객군에 전환 마찰 최소화가 효과적입니다.",
    when: (input) => input.visitFrequency === "new",
  },
  {
    approachId: "quick_onboarding",
    weight: 2,
    reason: "저결제 구간은 빠른 가치 체감 설계가 필요합니다.",
    when: (input) => input.paymentTier === "low",
  },
  {
    approachId: "high_value_retention",
    weight: 8,
    reason: "고결제 고객은 유지 전략의 ROI가 높습니다.",
    when: (input) => input.paymentTier === "high",
  },
  {
    approachId: "reactivation_loop",
    weight: 9,
    reason: "접속 간격이 늘어난 고객은 재활성화 루프가 필요합니다.",
    when: (input) => input.visitFrequency === "occasional",
  },
  {
    approachId: "reactivation_loop",
    weight: 2,
    reason: "푸시 선호군은 재참여 메시지 도달률이 높습니다.",
    when: (input) => input.channelPreference === "push",
  },
  {
    approachId: "bundle_upsell",
    weight: 6,
    reason: "중고결제 + 반복 방문군은 번들 업셀링 적합도가 높습니다.",
    when: (input) =>
      ["mid", "high"].includes(input.paymentTier) &&
      ["regular", "loyal"].includes(input.visitFrequency),
  },
  {
    approachId: "content_personalization",
    weight: 5,
    reason: "개인화 콘텐츠는 대부분의 세그먼트에 기본 효율을 제공합니다.",
    when: () => true,
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function resolveExtraValue(
  fieldId: string,
  extras: Record<string, string>,
  fallbackValue = "",
): string {
  const value = extras[fieldId];
  if (typeof value !== "string") return fallbackValue;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallbackValue;
}

function resolveNumberExtraValue(
  fieldId: string,
  extras: Record<string, string>,
  fallbackNumber: number,
): number {
  const fieldDefaultValue = getExtraFieldDefinitionById(fieldId)?.defaultValue;
  const resolvedRawValue = resolveExtraValue(
    fieldId,
    extras,
    fieldDefaultValue ?? String(fallbackNumber),
  );
  const parsed = Number(resolvedRawValue);
  if (!Number.isNaN(parsed)) return parsed;

  const parsedDefault = Number(fieldDefaultValue);
  if (!Number.isNaN(parsedDefault)) return parsedDefault;

  return fallbackNumber;
}

export function estimateImpact(
  approachId: string,
  input: SegmentInput,
  extras: Record<string, string> = {},
): ExpectedImpact {
  const definition = APPROACH_DEFINITIONS[approachId];
  const base = definition?.baseImpact ?? APPROACH_DEFINITIONS.content_personalization.baseImpact;

  let conversionDelta = 0;
  let retentionDelta = 0;

  if (input.paymentTier === "high") retentionDelta += 1.5;
  if (input.visitFrequency === "new") conversionDelta += 1.2;
  if (input.visitFrequency === "occasional") retentionDelta += 1.0;

  if (approachId === "reactivation_loop") {
    const discount = resolveNumberExtraValue("discountRate", extras, 10);
    conversionDelta += clamp(discount / 8, 0, 4);
  }

  if (approachId === "bundle_upsell") {
    const depth = resolveNumberExtraValue("bundleDepth", extras, 3);
    conversionDelta += clamp((depth - 2) * 0.9, 0, 2);
  }

  if (approachId === "quick_onboarding") {
    const days = resolveNumberExtraValue("onboardingWindowDays", extras, 7);
    retentionDelta += days >= 7 ? 0.8 : 0.2;
  }

  if (approachId === "high_value_retention") {
    const defaultTouchpoint = getExtraFieldDefinitionById("vipTouchpoint")?.defaultValue ?? "biweekly";
    const touchpoint = resolveExtraValue("vipTouchpoint", extras, defaultTouchpoint);
    const deltaMap: Record<string, { conversion: number; retention: number }> = {
      monthly: { conversion: 0.2, retention: 0.6 },
      biweekly: { conversion: 0.5, retention: 1.2 },
      weekly: { conversion: 0.8, retention: 2.0 },
    };
    const delta = deltaMap[touchpoint] ?? deltaMap[defaultTouchpoint];
    if (delta) {
      conversionDelta += delta.conversion;
      retentionDelta += delta.retention;
    }
  }

  if (approachId === "content_personalization") {
    const defaultCadence = getExtraFieldDefinitionById("contentCadence")?.defaultValue ?? "weekly";
    const cadence = resolveExtraValue("contentCadence", extras, defaultCadence);
    const deltaMap: Record<string, { conversion: number; retention: number }> = {
      monthly: { conversion: 0.2, retention: 0.4 },
      biweekly: { conversion: 0.5, retention: 0.9 },
      weekly: { conversion: 0.9, retention: 1.4 },
    };
    const delta = deltaMap[cadence] ?? deltaMap[defaultCadence];
    if (delta) {
      conversionDelta += delta.conversion;
      retentionDelta += delta.retention;
    }
  }

  const conversionMin = clamp(base.conversionLiftPctMin + conversionDelta, 1, 30);
  const conversionMax = clamp(base.conversionLiftPctMax + conversionDelta, conversionMin + 1, 40);
  const retentionMin = clamp(base.retentionLiftPctMin + retentionDelta, 1, 30);
  const retentionMax = clamp(base.retentionLiftPctMax + retentionDelta, retentionMin + 1, 45);

  return {
    conversionLiftPctMin: Number(conversionMin.toFixed(1)),
    conversionLiftPctMax: Number(conversionMax.toFixed(1)),
    retentionLiftPctMin: Number(retentionMin.toFixed(1)),
    retentionLiftPctMax: Number(retentionMax.toFixed(1)),
  };
}

export function recommendApproaches(input: SegmentInput): ApproachRecommendation[] {
  const scoreMap = new Map<string, { score: number; reasons: string[] }>();

  for (const key of Object.keys(APPROACH_DEFINITIONS)) {
    scoreMap.set(key, { score: 0, reasons: [] });
  }

  for (const rule of RULES) {
    if (!rule.when(input)) continue;
    const current = scoreMap.get(rule.approachId);
    if (!current) continue;
    current.score += rule.weight;
    current.reasons.push(rule.reason);
    scoreMap.set(rule.approachId, current);
  }

  const ranked = Array.from(scoreMap.entries())
    .filter(([, value]) => value.score > 0)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 4)
    .map(([id, value]) => {
      const definition = APPROACH_DEFINITIONS[id];
      return {
        id,
        title: definition.title,
        reason: value.reasons[0] ?? "세그먼트 기본 전략으로 추천됩니다.",
        requiredExtraFields: definition.requiredExtraFields,
        actionSteps: definition.actionSteps,
        expectedImpact: estimateImpact(id, input),
        priority: value.score,
      };
    });

  if (ranked.length > 0) return ranked;

  const fallback = APPROACH_DEFINITIONS.content_personalization;
  return [
    {
      id: fallback.id,
      title: fallback.title,
      reason: "기본 전략으로 콘텐츠 개인화를 먼저 적용합니다.",
      requiredExtraFields: fallback.requiredExtraFields,
      actionSteps: fallback.actionSteps,
      expectedImpact: estimateImpact(fallback.id, input),
      priority: 1,
    },
  ];
}
