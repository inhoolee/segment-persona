import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DOMAIN_OPTIONS } from "@/lib/rules/options";
import type { SegmentFormInput } from "@/lib/validation/segmentSchema";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";

interface IndustryStepProps {
  register: UseFormRegister<SegmentFormInput>;
  errors: FieldErrors<SegmentFormInput>;
}

export function IndustryStep({ register, errors }: IndustryStepProps) {
  return (
    <CollapsiblePanel
      title="1. 도메인 선택"
      description="분석하려는 고객군이 속한 서비스 도메인을 고릅니다."
    >
      <div className="mt-20">
        <label htmlFor="domain" className="input-label">
          도메인
        </label>
        <select
          id="domain"
          className="input-control"
          {...register("domain")}
        >
          <option value="">도메인을 선택하세요</option>
          {DOMAIN_OPTIONS.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>
      {errors.domain ? <p className="error-text">{errors.domain.message}</p> : null}
    </CollapsiblePanel>
  );
}
