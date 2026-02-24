# 고객 세그먼트 페르소나 웹사이트 구현 계획 (MVP 초안)

## 요약
[README.md](/Users/ho/Workspace/segment-persona/README.md) 요구사항을 기준으로, **초보 데이터 분석가가 입력값만으로 세그먼트별 페르소나/접근법/예상 임팩트**를 확인하는 단일 웹 앱을 구현한다.  
범위는 **규칙 기반 MVP**이며, **Next.js + TypeScript**로 제작하고, 페르소나 이미지는 **사전 준비 에셋 매핑**을 사용한다.

## 구현 목표와 성공 기준
1. 사용자는 1개 화면(멀티스텝)에서 산업/도메인/세그먼트/고객정보를 입력할 수 있다.
2. 시스템은 규칙 엔진으로 페르소나 카드, 추천 접근법, 상세 실행 방법, 예상 임팩트를 반환한다.
3. 접근법별로 필요한 추가 입력이 있을 때 조건부 폼이 노출된다.
4. 입력 변경 시 결과가 즉시 재계산되고, UX 오류 없이 완료된다.
5. 핵심 로직(규칙 매칭/임팩트 계산) 단위 테스트와 주요 사용자 시나리오 E2E 테스트가 통과한다.

## 범위
1. 포함
- 산업 유형(B2B/B2C), 도메인 선택
- 세그먼트 카테고리(연령대/성별/접속주기/결제금액) 입력
- 페르소나 이미지+요약 카드 노출
- 추천 접근법 선택 및 상세 방법 제시
- 접근법별 추가 입력 필드
- 예상 임팩트(정성+정량 추정치) 표시

2. 제외
- 실제 고객 DB/API 연동
- 로그인/권한/관리자 기능
- AI 이미지 생성 연동
- 다국어, A/B 테스트 플랫폼 연동

## 아키텍처/기술 결정
1. 프론트엔드: Next.js(App Router) + TypeScript + React Hook Form + Zod
2. 스타일: Tailwind CSS
3. 상태: 페이지 로컬 상태 + 폼 상태(전역 상태 라이브러리 미사용)
4. 데이터/룰: 로컬 JSON(또는 TS 상수) + 순수 함수 규칙 엔진
5. 이미지: `/public/personas/*.png` 정적 에셋 매핑
6. 렌더링: CSR 중심(SEO 핵심 요구 없음), 초기 페이지는 서버 렌더 기본

## 정보 구조와 사용자 플로우
1. Step 1: 산업 선택 (`industryType`, `domain`)
2. Step 2: 세그먼트 입력 (`ageGroup`, `gender`, `visitFrequency`, `paymentTier`)
3. Step 3: 고객 컨텍스트 입력 (`goal`, `channelPreference`, 선택형 메모)
4. Step 4: 결과
- 페르소나 카드(이미지, 이름, 핵심 특성)
- 추천 접근법 목록(우선순위 포함)
- 접근법 선택 시 상세 실행 방법/필요 추가 입력
- 예상 임팩트(예: 전환율 개선 범위, 재방문율 개선 범위)

## 주요 인터페이스/타입/API (결정 사항)
1. TypeScript 타입
```ts
type IndustryType = "B2B" | "B2C";
type AgeGroup = "10s" | "20s" | "30s" | "40s" | "50plus";
type Gender = "male" | "female" | "other";
type VisitFrequency = "new" | "occasional" | "regular" | "loyal";
type PaymentTier = "low" | "mid" | "high";

interface SegmentInput {
  industryType: IndustryType;
  domain: string;
  ageGroup: AgeGroup;
  gender: Gender;
  visitFrequency: VisitFrequency;
  paymentTier: PaymentTier;
  goal?: string;
  channelPreference?: "email" | "sms" | "push" | "inapp";
}

interface PersonaProfile {
  id: string;
  name: string;
  traits: string[];
  painPoints: string[];
  imagePath: string;
}

interface ApproachRecommendation {
  id: string;
  title: string;
  reason: string;
  requiredExtraFields: string[];
  actionSteps: string[];
  expectedImpact: {
    conversionLiftPctMin: number;
    conversionLiftPctMax: number;
    retentionLiftPctMin: number;
    retentionLiftPctMax: number;
  };
  priority: number;
}

interface AnalysisResult {
  persona: PersonaProfile;
  approaches: ApproachRecommendation[];
}
```

2. 규칙 엔진 함수
```ts
function analyzeSegment(input: SegmentInput): AnalysisResult
```

3. 선택형 내부 API(추후 확장 대비, MVP에서는 생략 가능)
- `POST /api/analyze` (body: `SegmentInput`, response: `AnalysisResult`)
- 초기 MVP는 클라이언트 직접 함수 호출 방식으로 시작하고, 이후 API 경유로 전환 가능하게 구조 분리

## 데이터 흐름
1. 사용자 입력 → Zod 검증
2. 유효 입력 → `analyzeSegment(input)` 호출
3. 결과 객체 생성 → UI 카드/리스트에 바인딩
4. 접근법 선택 → 추가 필드 노출/입력
5. 추가 필드 반영 재계산 → 임팩트 업데이트

## 규칙 엔진 설계
1. 룰 소스 분리
- `personaRules`: 세그먼트 조합 → 페르소나 ID 매핑
- `approachRules`: 세그먼트/목표 조합 → 접근법 후보 및 우선순위
- `impactRules`: 접근법+세그먼트 조합 → 예상 임팩트 범위

2. 충돌 해결
- 점수 기반 정렬(가중치 합산)
- 동점 시 도메인 특화 규칙 우선
- 매칭 실패 시 기본 페르소나/기본 접근법 fallback

## 예외/실패 처리
1. 필수 입력 누락: 단계 진행 차단 + 필드 에러 메시지
2. 룰 미매칭: fallback 결과 표시 + “추가 정보 입력 시 정확도 향상” 안내
3. 이미지 누락: 기본 아바타 이미지 사용
4. 비정상 값 주입: Zod 검증 실패 처리(계산 중단)

## 파일/모듈 구조(제안)
1. `app/page.tsx`: 멀티스텝 컨테이너
2. `components/steps/*.tsx`: 단계별 입력 UI
3. `components/results/*.tsx`: 페르소나/접근법/임팩트 카드
4. `lib/rules/*.ts`: 룰 데이터
5. `lib/analyzer/analyzeSegment.ts`: 규칙 엔진
6. `lib/types/segment.ts`: 공용 타입
7. `lib/validation/segmentSchema.ts`: Zod 스키마
8. `public/personas/*`: 이미지 에셋

## 테스트 계획과 시나리오
1. 단위 테스트(Vitest/Jest)
- 룰 매칭 정상 케이스(B2B/B2C 각각)
- 동점/충돌 정렬 케이스
- fallback 케이스
- 임팩트 계산 범위 일관성

2. 컴포넌트 테스트
- 단계별 유효성 검증 메시지
- 접근법 선택 시 추가 필드 노출
- 입력 변경 시 결과 재계산

3. E2E(Playwright)
- 핵심 happy path 2종(B2B, B2C)
- 필수값 누락 후 복구
- 룰 미매칭 fallback 표시
- 모바일 뷰에서 단계 전환 가능 여부

4. 수용 기준(AC)
- AC1: 모든 필수 입력 완료 후 결과 화면 1초 이내 렌더
- AC2: 접근법 선택 시 상세 실행 방법과 임팩트가 즉시 갱신
- AC3: 테스트 스위트 전체 통과

## 구현 단계(권장 순서)
1. 프로젝트 기본 세팅 및 타입/스키마 정의
2. 룰 데이터 모델링 + `analyzeSegment` 구현
3. 멀티스텝 입력 UI 구현
4. 결과 화면(페르소나/접근법/임팩트) 구현
5. 예외/fallback 처리 보강
6. 단위/컴포넌트/E2E 테스트 작성
7. 접근성/모바일 반응형 점검

## 가정 및 기본값(명시)
1. 대상 사용자 언어는 한국어로 고정한다.
2. 도메인은 초기에는 자유 텍스트 또는 제한된 셀렉트로 시작한다(우선 셀렉트 권장).
3. 임팩트 수치는 실측 데이터가 아닌 규칙 기반 추정치임을 UI에 명시한다.
4. MVP 단계에서는 저장 기능(결과 다운로드/히스토리)을 제외한다.
5. 배포 파이프라인은 본 계획 범위 밖이며, 로컬/프리뷰 실행 가능한 상태를 완료 기준으로 삼는다.
