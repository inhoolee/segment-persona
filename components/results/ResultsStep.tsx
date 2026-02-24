import Image from "next/image";
import { getExtraFieldDefinitions } from "@/lib/rules/extraFields";
import type { AnalysisResult, ExpectedImpact } from "@/lib/types/segment";

interface ResultsStepProps {
  result: AnalysisResult;
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
      <h4>예상 임팩트</h4>
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
  selectedApproachId,
  selectedImpact,
  extraValues,
  completionRatio,
  onSelectApproach,
  onExtraChange,
}: ResultsStepProps) {
  const selectedApproach =
    result.approaches.find((approach) => approach.id === selectedApproachId) ?? result.approaches[0];

  const selectedApproachImpact = selectedImpact ?? selectedApproach.expectedImpact;
  const extraFieldDefs = getExtraFieldDefinitions(selectedApproach.requiredExtraFields);
  const completionPct = Math.round(completionRatio * 100);
  const blurPx = Number(((1 - completionRatio) * 11).toFixed(1));
  const saturate = Number((0.65 + completionRatio * 0.6).toFixed(2));
  const scale = Number((0.96 + completionRatio * 0.04).toFixed(3));

  return (
    <section className="panel results-panel sticky-panel">
      <h2>실시간 페르소나 결과</h2>
      <p className="muted">고객 정보가 채워질수록 페르소나 이미지와 전략이 선명해집니다.</p>
      <p className="muted">입력 완성도 {completionPct}%</p>
      <div className="completion-meter mt-12" aria-label={`입력 완성도 ${completionPct}%`}>
        <span style={{ width: `${completionPct}%` }} />
      </div>

      <article className="persona-card mt-20">
        <div className="persona-image-wrap">
          <span className="clarity-chip">구체화 {completionPct}%</span>
          <Image
            src={result.persona.imagePath}
            alt={`${result.persona.name} 페르소나`}
            width={220}
            height={220}
            priority
            style={{
              filter: `blur(${blurPx}px) saturate(${saturate})`,
              transform: `scale(${scale})`,
              transition: "filter 220ms ease, transform 220ms ease",
            }}
          />
        </div>
        <div>
          <h3>{result.persona.name}</h3>
          <p className="muted">핵심 특성: {result.persona.traits.join(" · ")}</p>
          <p className="muted">주요 과제: {result.persona.painPoints.join(" · ")}</p>
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
        <h3>{selectedApproach.title}</h3>
        <ol>
          {selectedApproach.actionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        {extraFieldDefs.length > 0 ? (
          <div className="extra-fields">
            <h4>추가 정보 입력</h4>
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
        ) : null}

        <ImpactPanel impact={selectedApproachImpact} />
      </article>
    </section>
  );
}
