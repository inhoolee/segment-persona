import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { CHANNEL_LABELS, GOAL_OPTIONS } from "@/lib/rules/options";
import type { SegmentFormInput } from "@/lib/validation/segmentSchema";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";

interface ContextStepProps {
  register: UseFormRegister<SegmentFormInput>;
  errors: FieldErrors<SegmentFormInput>;
}

export function ContextStep({ register, errors }: ContextStepProps) {
  return (
    <CollapsiblePanel
      title="3. 분석 목표와 채널 컨텍스트"
      description="접근법 추천에 필요한 목표와 선호 채널 정보를 입력합니다."
    >

      <div className="mt-20">
        <label htmlFor="goal" className="input-label">
          분석 목표
        </label>
        <select id="goal" className="input-control" {...register("goal")}>
          <option value="">목표를 선택하세요</option>
          {GOAL_OPTIONS.map((goal) => (
            <option key={goal.value} value={goal.value}>
              {goal.label}
            </option>
          ))}
        </select>
      </div>
      {errors.goal ? <p className="error-text">{errors.goal.message}</p> : null}

      <div className="mt-20">
        <p className="input-label">선호 채널</p>
        <div className="chip-list">
          {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
            <label key={value} className="chip">
              <input type="radio" value={value} {...register("channelPreference")} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
      {errors.channelPreference ? <p className="error-text">{errors.channelPreference.message}</p> : null}

      <div className="mt-20">
        <label htmlFor="note" className="input-label">
          참고 메모 (선택)
        </label>
        <textarea
          id="note"
          className="input-control"
          rows={4}
          placeholder="예: 최근 3개월 신규 유입은 늘었지만 첫 결제 전환이 낮습니다."
          {...register("note")}
        />
      </div>
      {errors.note ? <p className="error-text">{errors.note.message}</p> : null}
    </CollapsiblePanel>
  );
}
