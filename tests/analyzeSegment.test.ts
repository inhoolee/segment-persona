import { analyzeSegment, recalculateApproachImpact } from "@/lib/analyzer/analyzeSegment";
import type { SegmentInput } from "@/lib/types/segment";

describe("analyzeSegment", () => {
  it("고가치 충성 사용자 입력에서 premium persona와 retention 전략을 우선 추천한다", () => {
    const input: SegmentInput = {
      industryType: "B2B",
      domain: "SaaS",
      ageGroup: "30s",
      gender: "male",
      visitFrequency: "loyal",
      paymentTier: "high",
      goal: "retention",
      channelPreference: "email",
      note: "",
    };

    const result = analyzeSegment(input);

    expect(result.persona.id).toBe("premium_loyalist");
    expect(result.approaches[0]?.id).toBe("high_value_retention");
    expect(result.approaches[0]?.priority).toBeGreaterThanOrEqual(result.approaches[1]?.priority ?? 0);
  });

  it("가끔 방문 사용자 입력에서 churn_risk persona를 매핑한다", () => {
    const input: SegmentInput = {
      industryType: "B2C",
      domain: "E-commerce",
      ageGroup: "20s",
      gender: "female",
      visitFrequency: "occasional",
      paymentTier: "mid",
      goal: "churn",
      channelPreference: "push",
      note: "",
    };

    const result = analyzeSegment(input);

    expect(result.persona.id).toBe("churn_risk");
    expect(result.approaches[0]?.id).toBe("reactivation_loop");
  });

  it("신규 저결제 사용자에서 onboarding 전략을 우선 추천한다", () => {
    const input: SegmentInput = {
      industryType: "B2C",
      domain: "Gaming",
      ageGroup: "20s",
      gender: "female",
      visitFrequency: "new",
      paymentTier: "low",
      goal: "conversion",
      channelPreference: "inapp",
      note: "",
    };

    const result = analyzeSegment(input);

    expect(result.persona.id).toBe("budget_starter");
    expect(result.approaches[0]?.id).toBe("quick_onboarding");
    expect(result.approaches.some((approach) => approach.id === "content_personalization")).toBe(true);
  });

  it("추가 입력값에 따라 임팩트 계산을 재조정한다", () => {
    const input: SegmentInput = {
      industryType: "B2C",
      domain: "Travel",
      ageGroup: "40s",
      gender: "other",
      visitFrequency: "occasional",
      paymentTier: "mid",
      goal: "retention",
      channelPreference: "push",
      note: "",
    };

    const lowDiscount = recalculateApproachImpact("reactivation_loop", input, { discountRate: "5" });
    const highDiscount = recalculateApproachImpact("reactivation_loop", input, { discountRate: "30" });

    expect(highDiscount.conversionLiftPctMin).toBeGreaterThan(lowDiscount.conversionLiftPctMin);
    expect(highDiscount.conversionLiftPctMax).toBeGreaterThan(lowDiscount.conversionLiftPctMax);
  });

  it("목표/채널이 바뀌어도 동일 세그먼트+도메인에서는 페르소나가 변하지 않는다", () => {
    const baseInput: SegmentInput = {
      industryType: "B2C",
      domain: "SaaS",
      ageGroup: "30s",
      gender: "female",
      visitFrequency: "regular",
      paymentTier: "mid",
      goal: "conversion",
      channelPreference: "email",
      note: "",
    };

    const first = analyzeSegment(baseInput);
    const second = analyzeSegment({
      ...baseInput,
      goal: "retention",
      channelPreference: "push",
    });

    expect(first.persona.id).toBe(second.persona.id);
  });

  it("중립 세그먼트에서는 도메인에 따라 페르소나가 달라진다", () => {
    const sharedSegment = {
      industryType: "B2C" as const,
      ageGroup: "30s" as const,
      gender: "male" as const,
      visitFrequency: "regular" as const,
      paymentTier: "mid" as const,
      goal: "conversion",
      channelPreference: "email" as const,
      note: "",
    };

    const saasPersona = analyzeSegment({ ...sharedSegment, domain: "SaaS" }).persona.id;
    const gamingPersona = analyzeSegment({ ...sharedSegment, domain: "Gaming" }).persona.id;

    expect(saasPersona).toBe("steady_pragmatist");
    expect(gamingPersona).toBe("budget_starter");
  });
});
