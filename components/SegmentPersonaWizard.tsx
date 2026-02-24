"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { analyzeSegment, recalculateApproachImpact } from "@/lib/analyzer/analyzeSegment";
import {
  AGE_GROUPS,
  GENDERS,
  PAYMENT_TIERS,
  VISIT_FREQUENCIES,
  type ExpectedImpact,
  type SegmentInput,
} from "@/lib/types/segment";
import { segmentSchema, type SegmentFormInput } from "@/lib/validation/segmentSchema";
import { ApproachSection } from "@/components/results/ApproachSection";
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

function resolveEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
): T {
  if (typeof value !== "string") return fallback;
  return (allowedValues as readonly string[]).includes(value) ? (value as T) : fallback;
}

function toAnalysisInput(input: Partial<SegmentFormInput>): SegmentInput {
  return {
    domain: input.domain?.trim() ? input.domain : "SaaS",
    ageGroup: resolveEnumValue(input.ageGroup, AGE_GROUPS, "20s"),
    gender: resolveEnumValue(input.gender, GENDERS, "female"),
    visitFrequency: resolveEnumValue(input.visitFrequency, VISIT_FREQUENCIES, "new"),
    paymentTier: resolveEnumValue(input.paymentTier, PAYMENT_TIERS, "low"),
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
      domain: undefined,
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
        <h1>고객 세그먼트, 쉽게 이해하기</h1>
        <p>
          분석 경험이 없어도 괜찮습니다. 고객 정보를 입력하는 즉시 페르소나와 마케팅 접근법을
          제안합니다.
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
            selectedSegment={analysisInput}
            completionRatio={completionRatio}
          />
        </div>
      </div>

      <div className="mt-20">
        <ApproachSection
          result={result}
          selectedApproachId={selectedApproachId}
          selectedImpact={selectedImpact}
          extraValues={extraValues}
          onSelectApproach={setSelectedApproachId}
          onExtraChange={(fieldId, value) => {
            setExtraValues((prev) => ({ ...prev, [fieldId]: value }));
          }}
        />
      </div>
    </div>
  );
}
