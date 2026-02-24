import { expect, test } from "@playwright/test";

test("단일 화면에서 입력 중 실시간 결과를 확인할 수 있다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("1. 도메인 선택")).toBeVisible();
  await expect(page.getByText("2. 고객 세그먼트 입력")).toBeVisible();
  await expect(page.getByText("3. 분석 목표와 채널 컨텍스트")).toBeVisible();
  await expect(page.getByRole("heading", { name: "실시간 페르소나 결과" })).toBeVisible();

  await page.selectOption("#domain", "SaaS");
  await page.selectOption("#goal", "conversion");
  await expect(page.getByText("입력 완성도 100%")).toBeVisible();

  await page.selectOption("#paymentTier", "high");
  await page.selectOption("#visitFrequency", "loyal");

  await expect(page.getByText("SaaS 20대 여성 그룹")).toBeVisible();
  await expect(page.getByRole("heading", { name: "추천 접근법" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "예상 임팩트" })).toBeVisible();
});
