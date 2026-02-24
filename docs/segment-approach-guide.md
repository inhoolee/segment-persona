# 세그먼트별 접근법 가이드

이 문서는 현재 앱이 **세그먼트 입력값**에 따라 어떤 접근법을 보여주는지 정리한 운영 문서입니다.

## 1) 접근법 노출 기본 규칙

- 추천 접근법은 규칙 점수(`priority`) 기반으로 정렬됩니다.
- 점수가 0보다 큰 접근법만 노출되며, 최대 4개까지 보여줍니다.
- `content_personalization`은 모든 세그먼트에 기본 점수 5점으로 항상 포함됩니다.
- 최종 우선순위는 같은 세그먼트라도 `visitFrequency`, `paymentTier`, `channelPreference`에 따라 달라집니다.

## 2) 접근법 점수 규칙

| 접근법 ID | 접근법명 | 점수 조건 | 기본 점수 |
| --- | --- | --- | --- |
| `quick_onboarding` | 초기 온보딩 전환 최적화 | `visitFrequency = new` (+7), `paymentTier = low` (+2) | 0 |
| `high_value_retention` | 고가치 고객 유지 프로그램 | `paymentTier = high` (+8) | 0 |
| `reactivation_loop` | 휴면 전환 방지 리액티베이션 | `visitFrequency = occasional` (+9), `channelPreference = push` (+2) | 0 |
| `bundle_upsell` | 번들 업셀링 시나리오 | `paymentTier ∈ {mid, high}` 이고 `visitFrequency ∈ {regular, loyal}` (+6) | 0 |
| `content_personalization` | 행동 기반 콘텐츠 개인화 | 모든 입력에서 기본 포함 | +5 |

## 3) 입력값 조합별 고유 그룹 분류 (요청 우선 규칙)

이 섹션은 기존 페르소나 규칙을 사용하지 않습니다.  
`domain + ageGroup + gender + visitFrequency + paymentTier`의 모든 조합을 **서로 다른 그룹**으로 분류합니다.

### 3-1) 그룹 ID 생성식

`group_id = grp_{domain_code}_{ageGroup}_{gender}_{visitFrequency}_{paymentTier}`

- 하나라도 값이 다르면 `group_id`가 달라집니다.
- 즉, 입력 조합 1개당 그룹 1개(1:1 매핑)입니다.

### 3-2) 도메인(`domain`) 코드 규칙

| 도메인 입력값 | `domain_code` |
| --- | --- |
| `SaaS` | `saas` |
| `E-commerce` | `ecommerce` |
| `Fintech` | `fintech` |
| `Healthcare` | `healthcare` |
| `Education` | `education` |
| `Travel` | `travel` |
| `Gaming` | `gaming` |
| 그 외 임의 문자열 | 입력 문자열을 slug 변환해 그대로 사용 |

`slug` 변환 기준:

- trim -> lowercase
- 공백/특수문자 -> `_`
- 연속 `_`는 1개로 축약

예: `Food Delivery` -> `food_delivery`

### 3-3) 고객 세그먼트 값별 코드(전부 독립)

| 입력 항목 | 가능한 값 | 코드 |
| --- | --- | --- |
| `ageGroup` | `10s`, `20s`, `30s`, `40s`, `50plus` | 값 그대로 사용 |
| `gender` | `male`, `female`, `other` | 값 그대로 사용 |
| `visitFrequency` | `new`, `occasional`, `regular`, `loyal` | 값 그대로 사용 |
| `paymentTier` | `low`, `mid`, `high` | 값 그대로 사용 |

### 3-4) 그룹 수

- 기본 도메인 7개만 사용 시: `7 x 5 x 3 x 4 x 3 = 1260`개 그룹
- 사용자 커스텀 도메인까지 허용 시: 도메인 종류 수만큼 그룹이 추가 확장

### 3-5) 예시

| 입력값 조합 | 생성 그룹 |
| --- | --- |
| `SaaS`, `30s`, `male`, `regular`, `mid` | `grp_saas_30s_male_regular_mid` |
| `Gaming`, `20s`, `female`, `new`, `low` | `grp_gaming_20s_female_new_low` |
| `Food Delivery`, `40s`, `other`, `loyal`, `high` | `grp_food_delivery_40s_other_loyal_high` |

## 4) 접근법별 추가 입력 필드

선택한 접근법에 따라 아래 추가 정보 입력 UI가 노출됩니다.

| 접근법 ID | 추가 입력 필드 |
| --- | --- |
| `quick_onboarding` | `onboardingWindowDays` (온보딩 메시지 유지 기간) |
| `high_value_retention` | `vipTouchpoint` (VIP 접점 빈도) |
| `reactivation_loop` | `discountRate` (리액티베이션 할인율) |
| `bundle_upsell` | `bundleDepth` (번들 상품 개수) |
| `content_personalization` | `contentCadence` (개인화 콘텐츠 발송 주기) |

## 5) 참고 구현 파일

- `lib/rules/approaches.ts`: 접근법 정의, 점수 규칙, 우선순위 계산
- `lib/rules/personas.ts`: 세그먼트 입력 기반 페르소나 결정 규칙
- `components/results/ResultsStep.tsx`: 추천 접근법 카드/상세 UI 렌더링
