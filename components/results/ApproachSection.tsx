"use client";

import { getExtraFieldDefinitions } from "@/lib/rules/extraFields";
import type { AnalysisResult, ExpectedImpact } from "@/lib/types/segment";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";

interface ApproachSectionProps {
  result: AnalysisResult;
  selectedApproachId: string;
  selectedImpact: ExpectedImpact | null;
  extraValues: Record<string, string>;
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
        재방문율 개선:{" "}
        <strong>{impact.retentionLiftPctMin}% ~ {impact.retentionLiftPctMax}%</strong>
      </p>
      <p className="muted small">실측 데이터가 아닌 규칙 기반 추정치입니다.</p>
    </div>
  );
}

export function ApproachSection({
  result,
  selectedApproachId,
  selectedImpact,
  extraValues,
  onSelectApproach,
  onExtraChange,
}: ApproachSectionProps) {
  const selectedApproach =
    result.approaches.find((a) => a.id === selectedApproachId) ?? result.approaches[0];
  const selectedApproachImpact = selectedImpact ?? selectedApproach.expectedImpact;
  const extraFieldDefs = getExtraFieldDefinitions(selectedApproach.requiredExtraFields);

  return (
    <CollapsiblePanel
      title="추천 접근법 · 예상 임팩트"
      description="세그먼트에 맞는 마케팅 전략과 기대 효과를 확인합니다."
      className="results-panel"
    >
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

      <div className="approach-detail-grid mt-20">
        <article className="detail-card">
          <h3>실행 방법</h3>
          <p className="muted small">{selectedApproach.title}</p>
          <ol>
            {selectedApproach.actionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <div className="approach-side">
          {extraFieldDefs.length > 0 && (
            <article className="detail-card">
              <h3>추가 정보 입력</h3>
              <div className="extra-fields mt-12">
                {extraFieldDefs.map((field) => (
                  <label key={field.id} className="input-label mt-12">
                    {field.label}
                    {field.inputType === "select" ? (
                      <select
                        className="input-control"
                        value={extraValues[field.id] ?? field.defaultValue ?? ""}
                        onChange={(e) => onExtraChange(field.id, e.target.value)}
                      >
                        {(field.options ?? []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
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
                        onChange={(e) => onExtraChange(field.id, e.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
              <p className="muted small mt-12">미입력 시 샘플값으로 임팩트를 계산합니다.</p>
            </article>
          )}
          <article className={`detail-card ${extraFieldDefs.length > 0 ? "mt-12" : ""}`}>
            <h3>예상 임팩트</h3>
            <ImpactPanel impact={selectedApproachImpact} />
          </article>
        </div>
      </div>
    </CollapsiblePanel>
  );
}
