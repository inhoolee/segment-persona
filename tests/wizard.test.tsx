import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentPersonaWizard } from "@/components/SegmentPersonaWizard";

describe("SegmentPersonaWizard", () => {
  it("단일 화면에서 입력하면 실시간으로 결과를 갱신한다", async () => {
    const user = userEvent.setup();
    render(<SegmentPersonaWizard />);

    expect(screen.queryByRole("button", { name: "다음" })).not.toBeInTheDocument();
    expect(screen.getByText("1. 산업과 도메인 선택")).toBeInTheDocument();
    expect(screen.getByText("2. 고객 세그먼트 입력")).toBeInTheDocument();
    expect(screen.getByText("3. 분석 목표와 채널 컨텍스트")).toBeInTheDocument();
    expect(screen.getByText("실시간 페르소나 결과")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("도메인"), "SaaS");
    expect(screen.getByText(/입력 완성도 100%/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("분석 목표"), "conversion");

    expect(screen.getByText(/입력 완성도 100%/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("결제 금액"), "high");
    await user.selectOptions(screen.getByLabelText("접속 주기"), "loyal");

    expect(screen.getByText("고가치 충성 사용자")).toBeInTheDocument();
  });
});
