# CHANGELOG

## 2026-02-24 16:06
- Request: 작업 시마다 요청사항과 변경사항을 changelog 파일로 남기도록 규칙 추가
- Changes:
  - `AGENTS.md` 신규 생성
  - 작업 단위 changelog 기록 의무 규칙 추가
  - `CHANGELOG.md` 기본 파일 및 기록 템플릿 기준 생성
- Files:
  - AGENTS.md
  - CHANGELOG.md
- Verification:
  - Rule document created

## 2026-02-24 16:08
- Request: 각 섹션마다 접기/펼치기 기능 추가
- Changes:
  - 공통 `CollapsiblePanel` 컴포넌트를 추가해 섹션 단위 토글 UI/상태 관리 구현
  - 입력 섹션(산업/세그먼트/컨텍스트)과 결과 섹션에 공통 접기/펼치기 기능 적용
  - 접기 버튼, 아이콘 회전, 포커스/호버 상태를 위한 스타일 추가
- Files:
  - components/common/CollapsiblePanel.tsx
  - components/steps/IndustryStep.tsx
  - components/steps/SegmentStep.tsx
  - components/steps/ContextStep.tsx
  - components/results/ResultsStep.tsx
  - app/globals.css
- Verification:
  - `npm run test` 통과
  - `npm run lint` 통과

## 2026-02-24 16:15
- Request: 각 세그먼트별로 보여주는 접근법들에 대한 문서를 docs에 작성
- Changes:
  - 세그먼트 입력값/페르소나별로 노출되는 접근법 규칙과 우선순위 기준을 문서화
  - 접근법별 추가 입력 필드와 관련 구현 파일 위치를 함께 정리
- Files:
  - docs/segment-approach-guide.md
  - CHANGELOG.md
- Verification:
  - 문서 변경만 수행하여 테스트/빌드/린트는 실행하지 않음

## 2026-02-24 16:16
- Request: 도메인/세그먼트별 페르소나 이미지를 더 현실감 있게 각 에셋으로 생성
- Changes:
  - 기존 단색 일러스트 SVG 대신 실사형 페르소나 이미지 4종 JPG 에셋 생성 및 교체
  - 페르소나 카탈로그의 이미지 경로를 `.svg`에서 `.jpg`로 업데이트
  - 워터마크가 보이지 않도록 원본 가장자리 크롭 처리 후 최종 에셋으로 반영
- Files:
  - public/personas/budget-starter.jpg
  - public/personas/steady-pragmatist.jpg
  - public/personas/premium-loyalist.jpg
  - public/personas/churn-risk.jpg
  - lib/rules/personas.ts
  - CHANGELOG.md
- Verification:
  - `npm run test` 통과
  - `npm run build` 통과

## 2026-02-24 16:19
- Request: 실사형 페르소나 이미지를 16personalities 느낌의 카툰 스타일로 변경
- Changes:
  - 4개 페르소나 이미지를 카툰형 SVG 일러스트로 재제작 (세그먼트 특성별 표정/소품 차별화)
  - 페르소나 이미지 매핑 경로를 `.jpg`에서 `.svg`로 변경
- Files:
  - public/personas/budget-starter.svg
  - public/personas/steady-pragmatist.svg
  - public/personas/premium-loyalist.svg
  - public/personas/churn-risk.svg
  - lib/rules/personas.ts
  - CHANGELOG.md
- Verification:
  - `npm run test` 통과
  - `npm run build` 통과

## 2026-02-24 16:20
- Request: 실사형 느낌 제거를 위해 카툰 전환 후 실제 인물 JPG 에셋 정리
- Changes:
  - `public/personas`의 실사형 JPG 4종을 사용 경로에서 제외하고 `tmp/legacy-personas`로 이동
  - 현재 서비스 노출 에셋이 SVG 카툰 버전만 사용되도록 정리
- Files:
  - public/personas/budget-starter.jpg
  - public/personas/steady-pragmatist.jpg
  - public/personas/premium-loyalist.jpg
  - public/personas/churn-risk.jpg
  - tmp/legacy-personas/budget-starter.jpg
  - tmp/legacy-personas/steady-pragmatist.jpg
  - tmp/legacy-personas/premium-loyalist.jpg
  - tmp/legacy-personas/churn-risk.jpg
  - CHANGELOG.md
- Verification:
  - `npm run test` 통과

## 2026-02-24 16:26
- Request: 페르소나 구분을 위해 도메인/고객 세그먼트 모든 입력값 기준으로 그룹 분류 문서화
- Changes:
  - 페르소나 결정 우선순위(결제/방문/연령/도메인/fallback) 규칙을 단계별로 명시
  - 도메인 전체 입력값(`SaaS`, `E-commerce`, `Fintech`, `Healthcare`, `Education`, `Travel`, `Gaming`, 기타`)의 그룹 매핑 표 추가
  - 고객 세그먼트 전체 입력값(`ageGroup`, `gender`, `visitFrequency`, `paymentTier`)별 그룹 영향 및 예외 조건 표 추가
  - 페르소나별 주 노출 접근법 섹션을 전체 분류 규칙 기준으로 정렬해 재구성
- Files:
  - docs/segment-approach-guide.md
  - CHANGELOG.md
- Verification:
  - 문서 변경만 수행하여 테스트/빌드/린트는 실행하지 않음

## 2026-02-24 16:29
- Request: 기존 구현 무시하고 도메인/고객 세그먼트 모든 입력 조합을 각각 다른 그룹으로 분류
- Changes:
  - 기존 페르소나 우선순위 기반 분류 설명을 제거하고 입력 조합 1:1 고유 그룹 분류 규칙으로 교체
  - `group_id = grp_{domain_code}_{ageGroup}_{gender}_{visitFrequency}_{paymentTier}` 생성식 추가
  - 도메인 코드화 규칙(기본 7개 + 커스텀 slug 처리) 및 세그먼트 각 항목별 코드 표 추가
  - 전체 그룹 수 계산식과 실제 그룹 ID 예시 3건 추가
- Files:
  - docs/segment-approach-guide.md
  - CHANGELOG.md
- Verification:
  - 문서 변경만 수행하여 테스트/빌드/린트는 실행하지 않음

## 2026-02-24 16:38
- Request: `docs/segment-approach-guide.md` 기준으로 페르소나를 모든 입력값 조합별 그룹으로 변경하고, 성별/나이/도메인 의상 특성을 반영해 이미지 재생성 및 매칭
- Changes:
  - 고정 4개 페르소나 규칙을 제거하고 `group_id = grp_{domain_code}_{ageGroup}_{gender}_{visitFrequency}_{paymentTier}` 기반 동적 페르소나 생성으로 전환
  - 도메인 코드 표준화(`SaaS`, `E-commerce` 등) + 커스텀 도메인 slug 변환 규칙을 구현
  - 성별/나이/방문주기/결제구간/도메인 특성을 조합해 traits/pain points를 생성하도록 변경
  - 도메인별 의상 스타일(후디/앞치마/블레이저/스크럽/가디건/윈드브레이커/져지/재킷)과 성별/나이 특징을 반영한 동적 SVG(Data URL) 이미지 매칭 구현
  - 도메인 입력 UI를 `select`에서 `input + datalist`로 변경해 커스텀 도메인 입력 허용
  - 단위/E2E 테스트를 새 그룹 ID 및 도메인 입력 방식에 맞게 갱신
- Files:
  - lib/rules/personas.ts
  - components/steps/IndustryStep.tsx
  - tests/analyzeSegment.test.ts
  - tests/wizard.test.tsx
  - e2e/persona-flow.spec.ts
  - CHANGELOG.md
- Verification:
  - `npm run test -- --run` 통과
  - `npm run lint` 통과
  - `npm run build` 통과

## 2026-02-24 16:45
- Request: 여성 페르소나 이미지가 이상하게 보이는 문제 수정
- Changes:
  - 여성 헤어 SVG 경로를 얼굴 전체를 덮는 형태에서 상단+양옆만 감싸는 형태로 변경
  - 얼굴 주요 요소(눈/입/피부 톤)가 정상적으로 보이도록 헤어 레이어 오버랩 범위 조정
- Files:
  - lib/rules/personas.ts
  - CHANGELOG.md
- Verification:
  - `npm run test -- --run` 통과
  - `npm run lint` 통과
  - `npm run build` 통과

## 2026-02-24 16:48
- Request: 페르소나 카드에서 이미지 섹션이 길어지고 텍스트가 옆에서 한 글자씩 줄바꿈되는 UI 문제 수정
- Changes:
  - 페르소나 카드에 컨테이너 쿼리를 적용해 카드 폭이 좁을 때 이미지/텍스트를 자동 세로 배치하도록 변경
  - 페르소나 텍스트 영역에 한국어 줄바꿈 개선(`word-break: keep-all`) 적용
  - 페르소나 요약 텍스트를 특성/과제 각각 상위 3개만 노출하도록 조정
- Files:
  - app/globals.css
  - components/results/ResultsStep.tsx
  - CHANGELOG.md
- Verification:
  - `npm run test -- --run` 통과
  - `npm run lint` 통과
  - `npm run build` 통과

## 2026-02-24 16:52
- Request: 실시간 페르소나 결과 UI에서 글자를 이미지 아래로 배치하고, 선택한 나이/성별 등 결과를 태그 형식으로 표시
- Changes:
  - 페르소나 카드 레이아웃을 세로 배치로 고정해 텍스트가 이미지 아래에 오도록 변경
  - 결과 카드에 선택 세그먼트 값(도메인/연령대/성별/방문/결제) 태그 목록 추가
  - 결과 전용 태그 스타일(`persona-tag-list`, `persona-tag`) 추가 및 기존 반응형 그리드 규칙 정리
  - `ResultsStep`에 현재 선택 세그먼트 입력값(`analysisInput`) 전달하도록 연결
- Files:
  - components/results/ResultsStep.tsx
  - components/SegmentPersonaWizard.tsx
  - app/globals.css
  - CHANGELOG.md
- Verification:
  - `npm run test -- --run tests/wizard.test.tsx` 통과
  - `npm run lint` 통과

## 2026-02-24 16:54
- Request: 도메인에 아무거나 입력할 수 있는데 정해진 도메인만 입력 가능하도록 수정
- Changes:
  - 도메인 입력 UI를 자유 입력(`input + datalist`)에서 고정 선택(`select`)으로 변경
  - 도메인 유효성 검증을 문자열 검증에서 `DOMAIN_OPTIONS` enum 검증으로 변경
  - 도메인 입력 방식 변경에 맞게 단위 테스트/E2E 테스트를 `select` 선택 방식으로 수정
- Files:
  - components/steps/IndustryStep.tsx
  - lib/validation/segmentSchema.ts
  - tests/wizard.test.tsx
  - e2e/persona-flow.spec.ts
  - CHANGELOG.md
- Verification:
  - `npm test` 통과
  - `npm run lint`, `npm run build`, `npm run test:e2e`는 실행하지 않음

## 2026-02-24 16:57
- Request: B2B, B2C 선택이 결과에 영향을 안 주는 상태라면 제거
- Changes:
  - `industryType`이 결과 계산에 실제 반영되는지 로직을 점검함
  - `high_value_retention` 추천 가중치(`+3`)와 예상 임팩트 전환율 보정(`+0.8`)에 `industryType === "B2B"` 조건이 사용됨을 확인
  - 조건 미충족으로 기능/UI 제거는 진행하지 않음 (`No code change`)
- Files:
  - CHANGELOG.md
- Verification:
  - 소스 점검만 수행 (`lib/rules/approaches.ts`)
  - 테스트/빌드/린트는 실행하지 않음

## 2026-02-24 16:59
- Request: B2B, B2C 선택 제거
- Changes:
  - 입력 모델에서 `industryType` 필드를 제거하고 폼 스키마/기본값에서 관련 검증 및 초기값을 삭제
  - 1단계 입력 UI에서 B2B/B2C 라디오를 제거하고 제목/설명을 도메인 선택 기준으로 정리
  - 접근법 규칙에서 B2B 전용 가중치(+3)와 임팩트 전환율 보정(+0.8)을 제거
  - 관련 단위 테스트/E2E 테스트 문구 및 입력 객체를 새 입력 모델에 맞게 갱신
  - README/운영 문서에서 B2B/B2C 선택 관련 설명을 제거
- Files:
  - components/SegmentPersonaWizard.tsx
  - components/steps/IndustryStep.tsx
  - lib/types/segment.ts
  - lib/validation/segmentSchema.ts
  - lib/rules/options.ts
  - lib/rules/approaches.ts
  - tests/analyzeSegment.test.ts
  - tests/wizard.test.tsx
  - e2e/persona-flow.spec.ts
  - README.md
  - docs/segment-approach-guide.md
  - CHANGELOG.md
- Verification:
  - `npm test` 통과
  - `npm run lint` 통과
  - `npm run build` 통과

## 2026-02-24 17:00
- Request: 추천 접근법 이후에 나오는 부분들을 별도의 섹션으로 분리
- Changes:
  - 추천 접근법 선택 이후 콘텐츠를 `실행 방법`, `추가 정보 입력`, `예상 임팩트`로 분리해 각각 독립 카드 섹션으로 구성
  - `ImpactPanel` 제목을 섹션 헤더로 이동해 카드 단위 정보 구조를 명확히 정리
  - 섹션 분리에 맞춰 `extra-fields`, `impact-panel` 스타일을 조정
- Files:
  - components/results/ResultsStep.tsx
  - app/globals.css
  - CHANGELOG.md
- Verification:
  - `npm test` 통과

## 2026-02-24 17:01
- Request: B2B, B2C 선택 제거
- Changes:
  - `industryType`을 입력 타입/폼 스키마/기본값에서 제거하고 도메인 중심 입력으로 정리
  - 1단계에서 B2B/B2C 선택 UI를 제거하고 도메인 선택 섹션으로 단순화
  - 접근법 점수/임팩트 계산에서 B2B 전용 분기 로직을 제거
  - 관련 테스트(단위/E2E)와 문서(README, 가이드)를 현재 입력 모델 기준으로 갱신
  - 빌드 타입 오류(`domain` 기본값)를 `undefined`로 수정
- Files:
  - components/steps/IndustryStep.tsx
  - components/SegmentPersonaWizard.tsx
  - lib/types/segment.ts
  - lib/validation/segmentSchema.ts
  - lib/rules/options.ts
  - lib/rules/approaches.ts
  - tests/analyzeSegment.test.ts
  - tests/wizard.test.tsx
  - e2e/persona-flow.spec.ts
  - README.md
  - docs/segment-approach-guide.md
  - CHANGELOG.md
- Verification:
  - `npm test` 통과
  - `npm run lint` 통과
  - `npm run build` 통과
