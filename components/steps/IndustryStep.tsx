import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DOMAIN_OPTIONS, INDUSTRY_LABELS } from "@/lib/rules/options";
import type { SegmentFormInput } from "@/lib/validation/segmentSchema";

interface IndustryStepProps {
  register: UseFormRegister<SegmentFormInput>;
  errors: FieldErrors<SegmentFormInput>;
}

export function IndustryStep({ register, errors }: IndustryStepProps) {
  return (
    <section className="panel">
      <h2>1. 산업과 도메인 선택</h2>
      <p className="muted">분석하려는 고객군이 속한 비즈니스 유형을 먼저 고릅니다.</p>

      <div className="grid-two mt-20">
        {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
          <label key={value} className="choice-card">
            <input type="radio" value={value} {...register("industryType")} />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {errors.industryType ? <p className="error-text">{errors.industryType.message}</p> : null}

      <div className="mt-20">
        <label htmlFor="domain" className="input-label">
          도메인
        </label>
        <select id="domain" className="input-control" {...register("domain")}>
          <option value="">도메인을 선택하세요</option>
          {DOMAIN_OPTIONS.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      {errors.domain ? <p className="error-text">{errors.domain.message}</p> : null}
    </section>
  );
}
