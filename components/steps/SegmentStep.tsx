import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { AGE_LABELS, GENDER_LABELS, PAYMENT_LABELS, VISIT_LABELS } from "@/lib/rules/options";
import type { SegmentFormInput } from "@/lib/validation/segmentSchema";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";

interface SegmentStepProps {
  register: UseFormRegister<SegmentFormInput>;
  errors: FieldErrors<SegmentFormInput>;
}

function SelectField({
  id,
  label,
  register,
  options,
}: {
  id: keyof SegmentFormInput;
  label: string;
  register: UseFormRegister<SegmentFormInput>;
  options: Record<string, string>;
}) {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <select id={id} className="input-control" {...register(id)}>
        <option value="">선택하세요</option>
        {Object.entries(options).map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SegmentStep({ register, errors }: SegmentStepProps) {
  return (
    <CollapsiblePanel
      title="2. 고객 세그먼트 입력"
      description="핵심 세그먼트 항목을 선택하면 페르소나와 접근법 정확도가 올라갑니다."
    >

      <div className="grid-two mt-20">
        <SelectField id="ageGroup" label="연령대" register={register} options={AGE_LABELS} />
        <SelectField id="gender" label="성별" register={register} options={GENDER_LABELS} />
        <SelectField
          id="visitFrequency"
          label="접속 주기"
          register={register}
          options={VISIT_LABELS}
        />
        <SelectField id="paymentTier" label="결제 금액" register={register} options={PAYMENT_LABELS} />
      </div>

      {errors.ageGroup ? <p className="error-text">{errors.ageGroup.message}</p> : null}
      {errors.gender ? <p className="error-text">{errors.gender.message}</p> : null}
      {errors.visitFrequency ? <p className="error-text">{errors.visitFrequency.message}</p> : null}
      {errors.paymentTier ? <p className="error-text">{errors.paymentTier.message}</p> : null}
    </CollapsiblePanel>
  );
}
