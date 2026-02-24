"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { analyzeSegment, recalculateApproachImpact } from "@/lib/analyzer/analyzeSegment";
import type { ExpectedImpact, SegmentInput } from "@/lib/types/segment";
import { segmentSchema, type SegmentFormInput } from "@/lib/validation/segmentSchema";
import { ResultsStep } from "@/components/results/ResultsStep";
import { ContextStep } from "@/components/steps/ContextStep";
import { IndustryStep } from "@/components/steps/IndustryStep";
import { SegmentStep } from "@/components/steps/SegmentStep";

const REQUIRED_FIELDS: Array<keyof SegmentFormInput> = [
  "domain",
  "ageGroup",
  "gender",
  "visitFrequency",
  "paymentTier",
];

function toAnalysisInput(input: Partial<SegmentFormInput>): SegmentInput {
  return {
    industryType: input.industryType ?? "B2C",
    domain: input.domain?.trim() ? input.domain : "SaaS",
    ageGroup: input.ageGroup ?? "20s",
    gender: input.gender ?? "female",
    visitFrequency: input.visitFrequency ?? "new",
    paymentTier: input.paymentTier ?? "low",
    goal: input.goal?.trim() ? input.goal : "conversion",
    channelPreference: input.channelPreference ?? "email",
    note: input.note ?? "",
  };
}

export function SegmentPersonaWizard() {
  const [selectedApproachId, setSelectedApproachId] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});

  const {
    control,
    register,
    formState: { errors },
  } = useForm<SegmentFormInput>({
    resolver: zodResolver(segmentSchema),
    mode: "onTouched",
    defaultValues: {
      industryType: "B2C",
      domain: "",
      ageGroup: "20s",
      gender: "female",
      visitFrequency: "new",
      paymentTier: "low",
      goal: "",
      channelPreference: "email",
      note: "",
    },
  });

  const watched = useWatch({ control });
  const analysisInput = useMemo(() => toAnalysisInput(watched ?? {}), [watched]);
  const result = useMemo(() => analyzeSegment(analysisInput), [analysisInput]);

  useEffect(() => {
    setSelectedApproachId((previous) => {
      if (previous && result.approaches.some((approach) => approach.id === previous)) {
        return previous;
      }
      return result.approaches[0]?.id ?? "";
    });
  }, [result]);

  const selectedImpact = useMemo<ExpectedImpact | null>(() => {
    if (!selectedApproachId) return null;

    return recalculateApproachImpact(selectedApproachId, analysisInput, extraValues);
  }, [selectedApproachId, analysisInput, extraValues]);

  const completionRatio = useMemo(() => {
    const completed = REQUIRED_FIELDS.filter((field) => {
      const value = watched?.[field];
      if (typeof value === "string") return value.trim().length > 0;
      return value !== undefined && value !== null;
    }).length;
    return completed / REQUIRED_FIELDS.length;
  }, [watched]);

  return (
    <div className="wizard-shell">
      <header className="hero">
        <p className="badge">Segment Persona Lab</p>
        <h1>고객 세그먼트 페르소나 분석 가이드</h1>
        <p>
          데이터 분석 초보자를 위해 고객 정보를 입력하는 즉시 페르소나와 추천 접근법, 예상
          임팩트를 갱신합니다.
        </p>
      </header>

      <div className="live-layout">
        <div className="input-column">
          <IndustryStep register={register} errors={errors} />
          <SegmentStep register={register} errors={errors} />
          <ContextStep register={register} errors={errors} />
        </div>
        <div className="result-column">
          <ResultsStep
            result={result}
            selectedApproachId={selectedApproachId}
            selectedImpact={selectedImpact}
            extraValues={extraValues}
            completionRatio={completionRatio}
            onSelectApproach={setSelectedApproachId}
            onExtraChange={(fieldId, value) => {
              setExtraValues((prev) => ({ ...prev, [fieldId]: value }));
            }}
          />
        </div>
      </div>
    </div>
  );
}
