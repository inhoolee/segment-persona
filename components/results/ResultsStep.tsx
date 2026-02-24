"use client";

import Image from "next/image";
import { AGE_LABELS, GENDER_LABELS, PAYMENT_LABELS, VISIT_LABELS } from "@/lib/rules/options";
import type { AnalysisResult, SegmentInput } from "@/lib/types/segment";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";

interface ResultsStepProps {
  result: AnalysisResult;
  selectedSegment: SegmentInput;
  completionRatio: number;
}

export function ResultsStep({ result, selectedSegment, completionRatio }: ResultsStepProps) {
  const keyTraits = result.persona.traits.slice(0, 3);
  const keyPainPoints = result.persona.painPoints.slice(0, 3);
  const completionPct = Math.round(completionRatio * 100);
  const blurPx = Number(((1 - completionRatio) * 11).toFixed(1));
  const saturate = Number((0.65 + completionRatio * 0.6).toFixed(2));
  const scale = Number((1.04 - completionRatio * 0.04).toFixed(3));
  const renderMode = "image";
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
    </CollapsiblePanel>
  );
}
