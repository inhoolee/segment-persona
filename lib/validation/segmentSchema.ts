import { z } from "zod";
import { DOMAIN_OPTIONS } from "@/lib/rules/options";
import {
  AGE_GROUPS,
  CHANNEL_PREFERENCES,
  GENDERS,
  PAYMENT_TIERS,
  VISIT_FREQUENCIES,
} from "@/lib/types/segment";

export const segmentSchema = z.object({
  domain: z.enum(DOMAIN_OPTIONS, { message: "도메인을 선택해주세요." }),
  ageGroup: z.enum(AGE_GROUPS, { message: "연령대를 선택해주세요." }),
  gender: z.enum(GENDERS, { message: "성별을 선택해주세요." }),
  visitFrequency: z.enum(VISIT_FREQUENCIES, { message: "접속 주기를 선택해주세요." }),
  paymentTier: z.enum(PAYMENT_TIERS, { message: "결제 금액 구간을 선택해주세요." }),
  goal: z
    .string()
    .min(1, "분석 목표를 선택해주세요.")
    .max(100, "분석 목표는 100자 이하로 입력해주세요."),
  channelPreference: z.enum(CHANNEL_PREFERENCES, {
    message: "선호 채널을 선택해주세요.",
  }),
  note: z.string().max(200, "메모는 200자 이하로 입력해주세요.").optional(),
});

export type SegmentFormInput = z.infer<typeof segmentSchema>;
