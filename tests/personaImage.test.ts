import { analyzeSegment } from "@/lib/analyzer/analyzeSegment";
import type { SegmentInput } from "@/lib/types/segment";

function buildInput(overrides: Partial<SegmentInput> = {}): SegmentInput {
  return {
    domain: "SaaS",
    ageGroup: "20s",
    gender: "female",
    visitFrequency: "regular",
    paymentTier: "mid",
    goal: "conversion",
    channelPreference: "email",
    note: "",
    ...overrides,
  };
}

function decodePersonaSvg(imagePath: string): string {
  const prefix = "data:image/svg+xml;utf8,";
  expect(imagePath.startsWith(prefix)).toBe(true);
  return decodeURIComponent(imagePath.slice(prefix.length));
}

describe("persona image svg", () => {
  it("연령 배지(우상단)를 포함한다", () => {
    const result = analyzeSegment(buildInput({ ageGroup: "50plus" }));
    const svg = decodePersonaSvg(result.persona.imagePath);

    expect(svg).toContain('id="age-badge"');
    expect(svg).toContain(">50+<");
  });

  it("도메인별 아이콘과 배경 모티프를 포함한다", () => {
    const result = analyzeSegment(buildInput({ domain: "SaaS" }));
    const svg = decodePersonaSvg(result.persona.imagePath);

    expect(svg).toContain('id="domain-motif-saas"');
    expect(svg).toContain('id="domain-icon-saas"');
    expect(svg).toContain(">SaaS<");
  });

  it("커스텀 도메인에서 custom 아이콘/모티프 fallback을 사용한다", () => {
    const result = analyzeSegment(buildInput({ domain: "Food Delivery" }));
    const svg = decodePersonaSvg(result.persona.imagePath);

    expect(svg).toContain('id="domain-motif-custom"');
    expect(svg).toContain('id="domain-icon-custom"');
    expect(svg).toContain(">Custom<");
  });
});
