"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getExtraFieldDefinitions } from "@/lib/rules/extraFields";
import { AGE_LABELS, GENDER_LABELS, PAYMENT_LABELS, VISIT_LABELS } from "@/lib/rules/options";
import type { AnalysisResult, ExpectedImpact, SegmentInput } from "@/lib/types/segment";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";
import { shouldRender3DAvatar } from "@/lib/utils/avatarRenderPolicy";
import { PersonaAvatar3D } from "@/components/results/PersonaAvatar3D";

interface ResultsStepProps {
  result: AnalysisResult;
  selectedSegment: SegmentInput;
  selectedApproachId: string;
  selectedImpact: ExpectedImpact | null;
  extraValues: Record<string, string>;
  completionRatio: number;
  onSelectApproach: (approachId: string) => void;
  onExtraChange: (fieldId: string, value: string) => void;
}

function ImpactPanel({ impact }: { impact: ExpectedImpact }) {
  return (
    <div className="impact-panel">
      <p>
        전환율 개선: <strong>{impact.conversionLiftPctMin}% ~ {impact.conversionLiftPctMax}%</strong>
      </p>
      <p>
        재방문율 개선: <strong>{impact.retentionLiftPctMin}% ~ {impact.retentionLiftPctMax}%</strong>
      </p>
      <p className="muted small">실측 데이터가 아닌 규칙 기반 추정치입니다.</p>
    </div>
  );
}

export function ResultsStep({
  result,
  selectedSegment,
  selectedApproachId,
  selectedImpact,
  extraValues,
  completionRatio,
  onSelectApproach,
  onExtraChange,
}: ResultsStepProps) {
  const [allow3D, setAllow3D] = useState(false);
  const [forceImageFallback, setForceImageFallback] = useState(false);

  useEffect(() => {
    setAllow3D(shouldRender3DAvatar());
  }, []);

  useEffect(() => {
    setForceImageFallback(false);
  }, [result.persona.id, result.persona.avatar3d?.modelPath]);

  const selectedApproach =
    result.approaches.find((approach) => approach.id === selectedApproachId) ?? result.approaches[0];

  const selectedApproachImpact = selectedImpact ?? selectedApproach.expectedImpact;
  const extraFieldDefs = getExtraFieldDefinitions(selectedApproach.requiredExtraFields);
  const keyTraits = result.persona.traits.slice(0, 3);
  const keyPainPoints = result.persona.painPoints.slice(0, 3);
  const completionPct = Math.round(completionRatio * 100);
  const blurPx = Number(((1 - completionRatio) * 11).toFixed(1));
  const saturate = Number((0.65 + completionRatio * 0.6).toFixed(2));
  const scale = Number((1.04 - completionRatio * 0.04).toFixed(3));
  const renderMode = allow3D && result.persona.avatar3d && !forceImageFallback ? "3d" : "image";
  const selectedTags = [
    { id: "domain", label: "도메인", value: selectedSegment.domain },
    { id: "ageGroup", label: "연령대", value: AGE_LABELS[selectedSegment.ageGroup] },
    { id: "gender", label: "성별", value: GENDER_LABELS[selectedSegment.gender] },
    { id: "visitFrequency", label: "방문", value: VISIT_LABELS[selectedSegment.visitFrequency] },
    { id: "paymentTier", label: "결제", value: PAYMENT_LABELS[selectedSegment.paymentTier] },
  ];

  return (
    <CollapsiblePanel
      title="실시간 페르소나 결과"
      description="고객 정보가 채워질수록 페르소나 이미지와 전략이 선명해집니다."
      className="results-panel sticky-panel"
    >
      <p className="muted">입력 완성도 {completionPct}%</p>
      <div className="completion-meter mt-12" aria-label={`입력 완성도 ${completionPct}%`}>
        <span style={{ width: `${completionPct}%` }} />
      </div>

      <article className="persona-card mt-20">
        <div className="persona-image-wrap" data-testid="persona-media" data-render-mode={renderMode}>
          <span className="clarity-chip">구체화 {completionPct}%</span>
          {renderMode === "3d" && result.persona.avatar3d ? (
            <PersonaAvatar3D
              config={result.persona.avatar3d}
              blurPx={blurPx}
              saturate={saturate}
              scale={scale}
              onError={() => setForceImageFallback(true)}
            />
          ) : (
            <Image
              src={result.persona.imagePath}
              alt={`${result.persona.name} 페르소나`}
              fill
              sizes="(max-width: 860px) 100vw, 640px"
              priority
              style={{
                objectFit: "cover",
                filter: `blur(${blurPx}px) saturate(${saturate})`,
                transform: `scale(${scale})`,
                transition: "filter 220ms ease, transform 220ms ease",
              }}
            />
          )}
        </div>
        <div className="persona-meta">
          <h3>{result.persona.name}</h3>
          <div className="persona-tag-list mt-12" aria-label="선택 세그먼트 태그">
            {selectedTags.map((tag) => (
              <span key={tag.id} className="persona-tag">
                {tag.label} · {tag.value}
              </span>
            ))}
          </div>
          <p className="muted">핵심 특성: {keyTraits.join(" · ")}</p>
          <p className="muted">주요 과제: {keyPainPoints.join(" · ")}</p>
        </div>
      </article>

      <div className="mt-20">
        <h3>추천 접근법</h3>
        <div className="approach-grid mt-12">
          {result.approaches.map((approach) => (
            <button
              key={approach.id}
              type="button"
              className={`approach-card ${selectedApproach.id === approach.id ? "active" : ""}`}
              onClick={() => onSelectApproach(approach.id)}
            >
              <p className="priority">우선순위 점수 {approach.priority}</p>
              <h4>{approach.title}</h4>
              <p>{approach.reason}</p>
            </button>
          ))}
        </div>
      </div>

      <article className="detail-card mt-20">
        <h3>실행 방법</h3>
        <p className="muted small">{selectedApproach.title}</p>
        <ol>
          {selectedApproach.actionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>

      {extraFieldDefs.length > 0 ? (
        <article className="detail-card mt-12">
          <h3>추가 정보 입력</h3>
          <div className="extra-fields mt-12">
            {extraFieldDefs.map((field) => (
              <label key={field.id} className="input-label mt-12">
                {field.label}
                {field.inputType === "select" ? (
                  <select
                    className="input-control"
                    value={extraValues[field.id] ?? field.defaultValue ?? ""}
                    onChange={(event) => onExtraChange(field.id, event.target.value)}
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input-control"
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={extraValues[field.id] ?? field.defaultValue ?? ""}
                    onChange={(event) => onExtraChange(field.id, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <p className="muted small mt-12">미입력 시 샘플값으로 임팩트를 계산합니다.</p>
        </article>
      ) : null}

      <article className="detail-card mt-12">
        <h3>예상 임팩트</h3>
        <ImpactPanel impact={selectedApproachImpact} />
      </article>
    </CollapsiblePanel>
  );
}
