import { analyzeSegment, recalculateApproachImpact } from "@/lib/analyzer/analyzeSegment";
import type { SegmentInput } from "@/lib/types/segment";

describe("analyzeSegment", () => {
  it("입력값 조합으로 group_id를 생성하고 전략 우선순위를 유지한다", () => {
    const input: SegmentInput = {
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

    expect(result.persona.id).toBe("grp_saas_30s_male_loyal_high");
    expect(result.approaches[0]?.id).toBe("high_value_retention");
    expect(result.approaches[0]?.priority).toBeGreaterThanOrEqual(result.approaches[1]?.priority ?? 0);
  });

  it("도메인 표준 코드 규칙(e-commerce -> ecommerce)을 적용한다", () => {
    const input: SegmentInput = {
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

    expect(result.persona.id).toBe("grp_ecommerce_20s_female_occasional_mid");
    expect(result.approaches[0]?.id).toBe("reactivation_loop");
  });

  it("신규 저결제 사용자에서도 group_id와 온보딩 전략을 함께 반환한다", () => {
    const input: SegmentInput = {
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

    expect(result.persona.id).toBe("grp_gaming_20s_female_new_low");
    expect(result.approaches[0]?.id).toBe("quick_onboarding");
    expect(result.approaches.some((approach) => approach.id === "content_personalization")).toBe(true);
  });

  it("추가 입력값에 따라 임팩트 계산을 재조정한다", () => {
    const input: SegmentInput = {
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

  it("추가 입력이 비어 있으면 필드 기본값(샘플값)으로 임팩트를 계산한다", () => {
    const input: SegmentInput = {
      domain: "Travel",
      ageGroup: "40s",
      gender: "other",
      visitFrequency: "occasional",
      paymentTier: "mid",
      goal: "retention",
      channelPreference: "push",
      note: "",
    };

    const withEmptyExtras = recalculateApproachImpact("reactivation_loop", input, {});
    const withDefaultExtras = recalculateApproachImpact("reactivation_loop", input, {
      discountRate: "10",
    });

    expect(withEmptyExtras).toEqual(withDefaultExtras);
  });

  it("고가치 고객 유지 전략은 VIP 접점 빈도 선택값에 따라 임팩트가 달라진다", () => {
    const input: SegmentInput = {
      domain: "SaaS",
      ageGroup: "30s",
      gender: "female",
      visitFrequency: "loyal",
      paymentTier: "high",
      goal: "retention",
      channelPreference: "email",
      note: "",
    };

    const monthly = recalculateApproachImpact("high_value_retention", input, {
      vipTouchpoint: "monthly",
    });
    const weekly = recalculateApproachImpact("high_value_retention", input, {
      vipTouchpoint: "weekly",
    });

    expect(weekly.conversionLiftPctMin).toBeGreaterThan(monthly.conversionLiftPctMin);
    expect(weekly.conversionLiftPctMax).toBeGreaterThan(monthly.conversionLiftPctMax);
    expect(weekly.retentionLiftPctMin).toBeGreaterThan(monthly.retentionLiftPctMin);
    expect(weekly.retentionLiftPctMax).toBeGreaterThan(monthly.retentionLiftPctMax);
  });

  it("콘텐츠 개인화 전략은 발송 주기 선택값에 따라 임팩트가 달라진다", () => {
    const input: SegmentInput = {
      domain: "Education",
      ageGroup: "20s",
      gender: "female",
      visitFrequency: "regular",
      paymentTier: "mid",
      goal: "conversion",
      channelPreference: "inapp",
      note: "",
    };

    const monthly = recalculateApproachImpact("content_personalization", input, {
      contentCadence: "monthly",
    });
    const weekly = recalculateApproachImpact("content_personalization", input, {
      contentCadence: "weekly",
    });

    expect(weekly.conversionLiftPctMin).toBeGreaterThan(monthly.conversionLiftPctMin);
    expect(weekly.conversionLiftPctMax).toBeGreaterThan(monthly.conversionLiftPctMax);
    expect(weekly.retentionLiftPctMin).toBeGreaterThan(monthly.retentionLiftPctMin);
    expect(weekly.retentionLiftPctMax).toBeGreaterThan(monthly.retentionLiftPctMax);
  });

  it("목표/채널이 바뀌어도 동일 도메인+세그먼트면 group_id가 유지된다", () => {
    const baseInput: SegmentInput = {
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

  it("도메인이 달라지면 동일 세그먼트에서도 group_id가 달라진다", () => {
    const sharedSegment = {
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

    expect(saasPersona).toBe("grp_saas_30s_male_regular_mid");
    expect(gamingPersona).toBe("grp_gaming_30s_male_regular_mid");
  });

  it("커스텀 도메인은 slug 규칙으로 group_id를 생성한다", () => {
    const input: SegmentInput = {
      domain: "Food Delivery",
      ageGroup: "40s",
      gender: "other",
      visitFrequency: "loyal",
      paymentTier: "high",
      goal: "retention",
      channelPreference: "push",
      note: "",
    };

    const result = analyzeSegment(input);

    expect(result.persona.id).toBe("grp_food_delivery_40s_other_loyal_high");
    expect(result.persona.imagePath.startsWith("data:image/svg+xml;utf8,")).toBe(true);
    expect(result.persona.avatar3d).toMatchObject({
      modelPath: "/avatars/placeholders/40s-other.glb",
      animation: "loyal",
      outfitPreset: "jacket",
      materialPreset: "high",
      cameraPreset: "medium",
      autoRotate: true,
    });
  });

  it("3D 아바타 설정은 핵심 세그먼트 5필드에 맞춰 매핑된다", () => {
    const baseInput: SegmentInput = {
      domain: "SaaS",
      ageGroup: "20s",
      gender: "female",
      visitFrequency: "new",
      paymentTier: "low",
      goal: "conversion",
      channelPreference: "email",
      note: "",
    };

    const baseAvatar = analyzeSegment(baseInput).persona.avatar3d;
    const fintechAvatar = analyzeSegment({ ...baseInput, domain: "Fintech" }).persona.avatar3d;
    const loyalAvatar = analyzeSegment({ ...baseInput, visitFrequency: "loyal" }).persona.avatar3d;
    const highTierAvatar = analyzeSegment({ ...baseInput, paymentTier: "high" }).persona.avatar3d;
    const olderMaleAvatar = analyzeSegment({ ...baseInput, ageGroup: "40s", gender: "male" }).persona.avatar3d;

    expect(baseAvatar).toBeDefined();
    expect(fintechAvatar?.outfitPreset).toBe("blazer");
    expect(baseAvatar?.outfitPreset).toBe("hoodie");
    expect(baseAvatar?.animation).toBe("new");
    expect(loyalAvatar?.animation).toBe("loyal");
    expect(baseAvatar?.materialPreset).toBe("low");
    expect(highTierAvatar?.materialPreset).toBe("high");
    expect(baseAvatar?.modelPath).toBe("/avatars/placeholders/20s-female.glb");
    expect(olderMaleAvatar?.modelPath).toBe("/avatars/placeholders/40s-male.glb");
    expect(baseAvatar?.cameraPreset).toBe("close");
    expect(olderMaleAvatar?.cameraPreset).toBe("medium");
  });
});
