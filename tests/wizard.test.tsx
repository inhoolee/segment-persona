import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentPersonaWizard } from "@/components/SegmentPersonaWizard";

function hasExactParagraphText(expected: string) {
  return (_: string, element: Element | null) =>
    element?.tagName === "P" && element.textContent?.trim() === expected;
}

describe("SegmentPersonaWizard", () => {
  it("단일 화면에서 입력하면 실시간으로 결과를 갱신한다", async () => {
    const user = userEvent.setup();
    render(<SegmentPersonaWizard />);

    expect(screen.queryByRole("button", { name: "다음" })).not.toBeInTheDocument();
    expect(screen.getByText("1. 도메인 선택")).toBeInTheDocument();
    expect(screen.getByText("2. 고객 세그먼트 입력")).toBeInTheDocument();
    expect(screen.getByText("3. 분석 목표와 채널 컨텍스트")).toBeInTheDocument();
    expect(screen.getByText("실시간 페르소나 결과")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("도메인"), "SaaS");
    expect(screen.getByText(/입력 완성도 100%/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("분석 목표"), "conversion");

    expect(screen.getByText(/입력 완성도 100%/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("결제 금액"), "high");
    await user.selectOptions(screen.getByLabelText("접속 주기"), "loyal");

    expect(screen.getByText("SaaS 20대 여성 그룹")).toBeInTheDocument();
  });

  it("미입력 시 기본 샘플값으로 계산하고 추가 입력 변경 시 임팩트를 갱신한다", async () => {
    const user = userEvent.setup();
    render(<SegmentPersonaWizard />);

    await user.selectOptions(screen.getByLabelText("도메인"), "SaaS");
    await user.selectOptions(screen.getByLabelText("결제 금액"), "high");
    await user.selectOptions(screen.getByLabelText("접속 주기"), "loyal");

    expect(screen.getAllByText("고가치 고객 유지 프로그램").length).toBeGreaterThan(0);
    expect(screen.getByText("미입력 시 샘플값으로 임팩트를 계산합니다.")).toBeInTheDocument();

    expect(
      screen.getByText(hasExactParagraphText("전환율 개선: 3.5% ~ 8.5%")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(hasExactParagraphText("재방문율 개선: 8.7% ~ 17.7%")),
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("VIP 접점 빈도"), "monthly");

    expect(
      screen.getByText(hasExactParagraphText("전환율 개선: 3.2% ~ 8.2%")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(hasExactParagraphText("재방문율 개선: 8.1% ~ 17.1%")),
    ).toBeInTheDocument();
  });
});
