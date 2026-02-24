import { recommendApproaches, estimateImpact } from "@/lib/rules/approaches";
import { resolvePersona } from "@/lib/rules/personas";
import type { AnalysisResult, SegmentInput } from "@/lib/types/segment";

export function analyzeSegment(input: SegmentInput): AnalysisResult {
  return {
    persona: resolvePersona(input),
    approaches: recommendApproaches(input),
  };
}

export function recalculateApproachImpact(
  approachId: string,
  input: SegmentInput,
  extras: Record<string, string>,
) {
  return estimateImpact(approachId, input, extras);
}
