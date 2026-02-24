import type { ExtraFieldDefinition } from "@/lib/types/segment";

export const EXTRA_FIELD_DEFINITIONS: Record<string, ExtraFieldDefinition> = {
  onboardingWindowDays: {
    id: "onboardingWindowDays",
    label: "온보딩 메시지 유지 기간",
    inputType: "select",
    options: [
      { label: "3일", value: "3" },
      { label: "7일", value: "7" },
      { label: "14일", value: "14" },
    ],
    defaultValue: "7",
  },
  vipTouchpoint: {
    id: "vipTouchpoint",
    label: "VIP 접점 빈도",
    inputType: "select",
    options: [
      { label: "월 1회", value: "monthly" },
      { label: "격주 1회", value: "biweekly" },
      { label: "주 1회", value: "weekly" },
    ],
    defaultValue: "biweekly",
  },
  discountRate: {
    id: "discountRate",
    label: "리액티베이션 할인율(%)",
    inputType: "number",
    min: 0,
    max: 40,
    defaultValue: "10",
  },
  bundleDepth: {
    id: "bundleDepth",
    label: "번들 상품 개수",
    inputType: "select",
    options: [
      { label: "2개", value: "2" },
      { label: "3개", value: "3" },
      { label: "4개", value: "4" },
    ],
    defaultValue: "3",
  },
  contentCadence: {
    id: "contentCadence",
    label: "개인화 콘텐츠 발송 주기",
    inputType: "select",
    options: [
      { label: "주 1회", value: "weekly" },
      { label: "격주 1회", value: "biweekly" },
      { label: "월 1회", value: "monthly" },
    ],
    defaultValue: "weekly",
  },
};

export function getExtraFieldDefinitions(fieldIds: string[]) {
  return fieldIds.map((id) => EXTRA_FIELD_DEFINITIONS[id]).filter(Boolean);
}
