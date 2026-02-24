import type { AgeGroup, Gender, PersonaProfile, SegmentInput } from "@/lib/types/segment";
import { buildPersonaAvatar3DConfig } from "@/lib/rules/avatar3d";

type OutfitVariant =
  | "hoodie"
  | "apron"
  | "blazer"
  | "scrubs"
  | "cardigan"
  | "windbreaker"
  | "jersey"
  | "jacket";

type DomainVisualVariant = "saas" | "ecommerce" | "fintech" | "healthcare" | "education" | "travel" | "gaming" | "custom";

interface DomainStyle {
  displayName: string;
  badgeLabel: string;
  clothingLabel: string;
  trait: string;
  painPoint: string;
  iconVariant: DomainVisualVariant;
  motifVariant: DomainVisualVariant;
  outfitVariant: OutfitVariant;
  colors: {
    bgStart: string;
    bgEnd: string;
    clothing: string;
    accent: string;
  };
}

const FIXED_DOMAIN_CODES: Record<string, string> = {
  saas: "saas",
  ecommerce: "ecommerce",
  fintech: "fintech",
  healthcare: "healthcare",
  education: "education",
  travel: "travel",
  gaming: "gaming",
};

const DOMAIN_STYLES: Record<string, DomainStyle> = {
  saas: {
    displayName: "SaaS",
    badgeLabel: "SaaS",
    clothingLabel: "테크 후디",
    trait: "제품 실험과 피드백 사이클에 익숙함",
    painPoint: "기능 차별점이 약하면 빠르게 이탈",
    iconVariant: "saas",
    motifVariant: "saas",
    outfitVariant: "hoodie",
    colors: { bgStart: "#D8EEFF", bgEnd: "#EEF4FF", clothing: "#2D6CDF", accent: "#BFD4FF" },
  },
  ecommerce: {
    displayName: "E-commerce",
    badgeLabel: "Shop",
    clothingLabel: "리테일 앞치마",
    trait: "프로모션과 후기 신호에 민감하게 반응",
    painPoint: "혜택 피로가 쌓이면 구매 전환이 정체",
    iconVariant: "ecommerce",
    motifVariant: "ecommerce",
    outfitVariant: "apron",
    colors: { bgStart: "#FFE6D5", bgEnd: "#FFF4E8", clothing: "#D2692D", accent: "#FFD3B3" },
  },
  fintech: {
    displayName: "Fintech",
    badgeLabel: "Fin",
    clothingLabel: "포멀 블레이저",
    trait: "안정성, 신뢰 지표를 우선 확인",
    painPoint: "신뢰 근거가 부족하면 가입 장벽이 큼",
    iconVariant: "fintech",
    motifVariant: "fintech",
    outfitVariant: "blazer",
    colors: { bgStart: "#DDF7EE", bgEnd: "#ECFFF7", clothing: "#1E7A5B", accent: "#BCECD9" },
  },
  healthcare: {
    displayName: "Healthcare",
    badgeLabel: "Care",
    clothingLabel: "메디컬 스크럽",
    trait: "안전성과 정확한 안내 문구를 선호",
    painPoint: "전문성 신호가 낮으면 재방문 의지가 감소",
    iconVariant: "healthcare",
    motifVariant: "healthcare",
    outfitVariant: "scrubs",
    colors: { bgStart: "#E2F3FF", bgEnd: "#F1FAFF", clothing: "#2F8DB9", accent: "#C5E9FF" },
  },
  education: {
    displayName: "Education",
    badgeLabel: "Edu",
    clothingLabel: "캠퍼스 가디건",
    trait: "학습 단계별 진척 체감을 중요시함",
    painPoint: "난이도 안내가 부족하면 중도 이탈이 증가",
    iconVariant: "education",
    motifVariant: "education",
    outfitVariant: "cardigan",
    colors: { bgStart: "#F4E9FF", bgEnd: "#FBF4FF", clothing: "#7654B8", accent: "#E2D2FF" },
  },
  travel: {
    displayName: "Travel",
    badgeLabel: "Trip",
    clothingLabel: "트래블 윈드브레이커",
    trait: "시즌 혜택과 일정 유연성을 중시",
    painPoint: "예약 과정이 복잡하면 탐색 단계에서 포기",
    iconVariant: "travel",
    motifVariant: "travel",
    outfitVariant: "windbreaker",
    colors: { bgStart: "#E1FFF3", bgEnd: "#F2FFF8", clothing: "#2E9C7A", accent: "#BEF0DC" },
  },
  gaming: {
    displayName: "Gaming",
    badgeLabel: "Play",
    clothingLabel: "게이밍 져지",
    trait: "즉각적 보상과 이벤트 반응성이 높음",
    painPoint: "콘텐츠 신선도가 떨어지면 재접속이 감소",
    iconVariant: "gaming",
    motifVariant: "gaming",
    outfitVariant: "jersey",
    colors: { bgStart: "#FFE4F5", bgEnd: "#FFF1FA", clothing: "#AF3C8C", accent: "#FFD0EE" },
  },
};

interface AgeStyle {
  label: string;
  badgeLabel: string;
  trait: string;
  painPoint: string;
  skinTone: string;
  hairTone: string;
  details: string;
}

const AGE_STYLE: Record<AgeGroup, AgeStyle> =
  {
    "10s": {
      label: "10대",
      badgeLabel: "10대",
      trait: "트렌드 반응이 빠르고 실험적 소비 성향",
      painPoint: "가입/결제 절차가 길면 즉시 이탈",
      skinTone: "#FFDCC8",
      hairTone: "#463D37",
      details: [
        '<g id="age-detail-10s">',
        '<path d="M82 75l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1 3-7z" fill="#FEE36D" opacity="0.95"/>',
        '<path d="M138 74l2.5 5.5 6 0.8-4.4 4.1 1.1 5.9-5.2-3.3-5.2 3.3 1.1-5.9-4.4-4.1 6-0.8 2.5-5.5z" fill="#FFD48B" opacity="0.92"/>',
        "</g>",
      ].join(""),
    },
    "20s": {
      label: "20대",
      badgeLabel: "20대",
      trait: "가성비와 경험 품질을 동시에 비교",
      painPoint: "차별화 메시지가 약하면 선택을 보류",
      skinTone: "#F7D1B6",
      hairTone: "#3A2E2C",
      details: [
        '<g id="age-detail-20s">',
        '<path d="M84 106h9" stroke="#FFF8E8" stroke-width="2.3" stroke-linecap="round"/>',
        '<path d="M136 106h-9" stroke="#FFF8E8" stroke-width="2.3" stroke-linecap="round"/>',
        '<path d="M84 106l-4 13" stroke="#C8B5A7" stroke-width="1.4" stroke-linecap="round"/>',
        '<path d="M136 106l4 13" stroke="#C8B5A7" stroke-width="1.4" stroke-linecap="round"/>',
        "</g>",
      ].join(""),
    },
    "30s": {
      label: "30대",
      badgeLabel: "30대",
      trait: "성과 효율과 시간 절약을 중시",
      painPoint: "업무/생활 맥락에 맞춘 개인화가 부족",
      skinTone: "#EDC4A8",
      hairTone: "#342926",
      details: [
        '<g id="age-detail-30s">',
        '<rect x="90" y="93" width="15" height="10" rx="4" fill="none" stroke="#725147" stroke-width="1.4"/>',
        '<rect x="115" y="93" width="15" height="10" rx="4" fill="none" stroke="#725147" stroke-width="1.4"/>',
        '<path d="M105 98h10" stroke="#725147" stroke-width="1.2" stroke-linecap="round"/>',
        "</g>",
      ].join(""),
    },
    "40s": {
      label: "40대",
      badgeLabel: "40대",
      trait: "안정적 운영과 신뢰 가능한 지원을 선호",
      painPoint: "가치 대비 근거가 약하면 전환 속도 저하",
      skinTone: "#E4B99B",
      hairTone: "#2F2624",
      details: [
        '<g id="age-detail-40s">',
        '<path d="M88 106h14M118 106h14" stroke="#B28D77" stroke-width="1.6" stroke-linecap="round"/>',
        '<path d="M95 89h10M115 89h10" stroke="#AB8D7D" stroke-width="1.4" stroke-linecap="round"/>',
        "</g>",
      ].join(""),
    },
    "50plus": {
      label: "50대+",
      badgeLabel: "50+",
      trait: "명확한 가이드와 안정적 관계 관리를 선호",
      painPoint: "신뢰 기반 커뮤니케이션이 약하면 재방문 감소",
      skinTone: "#DDB093",
      hairTone: "#5C5A66",
      details: [
        '<g id="age-detail-50plus">',
        '<path d="M92 110c6 2 10 2 16 0M112 110c6 2 10 2 16 0" stroke="#A27F6C" stroke-width="1.5" stroke-linecap="round"/>',
        '<path d="M89 92h12M119 92h12" stroke="#C4B7B5" stroke-width="1.5" stroke-linecap="round"/>',
        "</g>",
      ].join(""),
    },
  };

const GENDER_STYLE: Record<Gender, { label: string; trait: string; painPoint: string; hairShape: string }> = {
  male: {
    label: "남성",
    trait: "명확한 성과 지표 기반 의사결정을 선호",
    painPoint: "핵심 혜택이 즉시 보이지 않으면 관심 저하",
    hairShape: "male",
  },
  female: {
    label: "여성",
    trait: "신뢰감과 사용 경험의 균형을 중시",
    painPoint: "메시지 톤이 일관되지 않으면 브랜드 신뢰 하락",
    hairShape: "female",
  },
  other: {
    label: "기타 성별",
    trait: "개인 정체성을 존중하는 경험을 중요시",
    painPoint: "획일적 톤의 메시지는 공감도를 낮춤",
    hairShape: "other",
  },
};

const VISIT_STYLE: Record<SegmentInput["visitFrequency"], { trait: string; painPoint: string; mouth: string }> = {
  new: {
    trait: "탐색 초기 단계로 첫 경험의 임팩트가 큼",
    painPoint: "온보딩 맥락이 불명확하면 전환 지연",
    mouth: '<path d="M99 118c4 4 18 4 22 0" stroke="#7A4F42" stroke-width="2.2" stroke-linecap="round"/>',
  },
  occasional: {
    trait: "필요 시점 기반으로 간헐적 재방문",
    painPoint: "재참여 동기 장치가 약하면 휴면화",
    mouth: '<path d="M99 118h22" stroke="#7A4F42" stroke-width="2" stroke-linecap="round"/>',
  },
  regular: {
    trait: "패턴화된 사용 흐름을 유지",
    painPoint: "반복 사용 보상이 부족하면 충성도 둔화",
    mouth: '<path d="M99 117c5 3 17 3 22 0" stroke="#7A4F42" stroke-width="2" stroke-linecap="round"/>',
  },
  loyal: {
    trait: "브랜드 경험에 익숙한 고관여 상태",
    painPoint: "VIP 차별화가 낮으면 만족도 하락",
    mouth: '<path d="M98 117c6 6 20 6 24 0" stroke="#7A4F42" stroke-width="2.3" stroke-linecap="round"/>',
  },
};

const PAYMENT_STYLE: Record<SegmentInput["paymentTier"], { trait: string; painPoint: string }> = {
  low: {
    trait: "가격 민감도가 높아 혜택 대비 체감을 중시",
    painPoint: "비용 대비 가치가 약하면 빠르게 이탈",
  },
  mid: {
    trait: "기능과 가격 사이 균형을 검토",
    painPoint: "중간 구간 맞춤 혜택 부재 시 전환 정체",
  },
  high: {
    trait: "프리미엄 경험과 빠른 지원을 기대",
    painPoint: "고가치 고객 전용 시나리오 부족",
  },
};

function compactDomainKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugifyDomain(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "general";
}

function resolveDomainCode(domain: string): string {
  const compact = compactDomainKey(domain);
  return FIXED_DOMAIN_CODES[compact] ?? slugifyDomain(domain);
}

function resolveDomainStyle(domain: string, domainCode: string): DomainStyle {
  const knownStyle = DOMAIN_STYLES[domainCode];
  if (knownStyle) return knownStyle;

  return {
    displayName: domain.trim() || "Custom",
    badgeLabel: "Custom",
    clothingLabel: "커스텀 도메인 재킷",
    trait: "도메인 고유 맥락에 따른 맞춤 니즈가 뚜렷함",
    painPoint: "범용 메시지로는 전환 설득력이 약함",
    iconVariant: "custom",
    motifVariant: "custom",
    outfitVariant: "jacket",
    colors: {
      bgStart: "#E6EAF0",
      bgEnd: "#F5F7FA",
      clothing: "#55657A",
      accent: "#D5DCE5",
    },
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function estimateSvgTextWidth(value: string, fontSize: number): number {
  return [...value].reduce((width, char) => {
    if (/\s/u.test(char)) return width + fontSize * 0.32;
    if (/[0-9A-Z]/u.test(char)) return width + fontSize * 0.64;
    if (/[a-z]/u.test(char)) return width + fontSize * 0.56;
    if (/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/u.test(char)) return width + fontSize * 0.96;
    return width + fontSize * 0.72;
  }, 0);
}

function renderHair(hairShape: string, hairTone: string): string {
  if (hairShape === "female") {
    return [
      `<path d="M66 82c0-25 19-42 44-42s44 17 44 42v10H66V82z" fill="${hairTone}" opacity="0.96"/>`,
      `<path d="M67 88c-3 18 1 38 10 52l13-6c-8-13-9-28-7-46H67z" fill="${hairTone}" opacity="0.94"/>`,
      `<path d="M153 88c3 18-1 38-10 52l-13-6c8-13 9-28 7-46h16z" fill="${hairTone}" opacity="0.94"/>`,
    ].join("");
  }
  if (hairShape === "other") {
    return [
      `<path d="M68 78c6-22 22-37 42-37 20 0 36 15 42 37v13H68V78z" fill="${hairTone}"/>`,
      `<path d="M72 90c8-8 18-12 38-12 20 0 30 4 38 12v9H72z" fill="${hairTone}" opacity="0.85"/>`,
    ].join("");
  }
  return `<path d="M68 79c4-23 22-38 42-38s38 15 42 38v14H68V79z" fill="${hairTone}"/>`;
}

function renderOutfit(variant: OutfitVariant, clothing: string, accent: string): string {
  if (variant === "hoodie") {
    return [
      `<path d="M56 206c0-38 25-62 54-62s54 24 54 62v14H56v-14z" fill="${clothing}"/>`,
      `<path d="M82 148c6-10 16-16 28-16s22 6 28 16l-9 18H91l-9-18z" fill="${accent}" opacity="0.95"/>`,
      '<path d="M98 166v16M122 166v16" stroke="#F4F6FF" stroke-width="2" stroke-linecap="round"/>',
    ].join("");
  }
  if (variant === "apron") {
    return [
      '<path d="M56 220v-20c0-34 23-56 54-56s54 22 54 56v20H56z" fill="#F4F0EA"/>',
      `<rect x="76" y="148" width="68" height="72" rx="8" fill="${clothing}"/>`,
      `<path d="M84 148c4-9 13-14 26-14s22 5 26 14" stroke="${accent}" stroke-width="6" fill="none"/>`,
      `<rect x="95" y="168" width="30" height="14" rx="4" fill="${accent}"/>`,
    ].join("");
  }
  if (variant === "blazer") {
    return [
      `<path d="M56 220v-22c0-34 22-54 54-54s54 20 54 54v22H56z" fill="${clothing}"/>`,
      `<path d="M86 148h48l-10 30h-28l-10-30z" fill="${accent}"/>`,
      '<path d="M110 148v72" stroke="#EAF5EF" stroke-width="2"/>',
    ].join("");
  }
  if (variant === "scrubs") {
    return [
      `<path d="M56 220v-22c0-35 22-55 54-55s54 20 54 55v22H56z" fill="${clothing}"/>`,
      `<path d="M92 146l18 18 18-18" stroke="${accent}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      `<rect x="84" y="174" width="14" height="16" rx="3" fill="${accent}" opacity="0.9"/>`,
    ].join("");
  }
  if (variant === "cardigan") {
    return [
      `<path d="M56 220v-22c0-34 22-54 54-54s54 20 54 54v22H56z" fill="${clothing}"/>`,
      `<rect x="103" y="148" width="14" height="72" fill="${accent}"/>`,
      '<circle cx="110" cy="168" r="2.2" fill="#F8F7FF"/><circle cx="110" cy="180" r="2.2" fill="#F8F7FF"/><circle cx="110" cy="192" r="2.2" fill="#F8F7FF"/>',
    ].join("");
  }
  if (variant === "windbreaker") {
    return [
      `<path d="M56 220v-20c0-35 23-56 54-56s54 21 54 56v20H56z" fill="${clothing}"/>`,
      `<path d="M110 148v72" stroke="${accent}" stroke-width="3"/>`,
      `<path d="M72 168h26M122 168h26" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`,
    ].join("");
  }
  if (variant === "jersey") {
    return [
      `<path d="M56 220v-22c0-35 22-56 54-56s54 21 54 56v22H56z" fill="${clothing}"/>`,
      `<rect x="92" y="164" width="36" height="24" rx="6" fill="${accent}"/>`,
      '<path d="M101 176h18" stroke="#FFF7FE" stroke-width="3" stroke-linecap="round"/>',
    ].join("");
  }
  return [
    `<path d="M56 220v-22c0-35 22-56 54-56s54 21 54 56v22H56z" fill="${clothing}"/>`,
    `<path d="M82 148l16 30h24l16-30" stroke="${accent}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    `<rect x="101" y="170" width="18" height="18" rx="3" fill="${accent}" opacity="0.85"/>`,
  ].join("");
}

function renderDomainMotif(variant: DomainVisualVariant, accent: string): string {
  if (variant === "saas") {
    return [
      '<g id="domain-motif-saas" opacity="0.22">',
      `<circle cx="42" cy="64" r="17" fill="${accent}"/>`,
      `<circle cx="70" cy="48" r="11" fill="${accent}"/>`,
      `<circle cx="95" cy="66" r="14" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "ecommerce") {
    return [
      '<g id="domain-motif-ecommerce" opacity="0.2">',
      `<rect x="26" y="44" width="40" height="28" rx="8" fill="${accent}"/>`,
      `<rect x="74" y="54" width="48" height="18" rx="9" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "fintech") {
    return [
      '<g id="domain-motif-fintech" opacity="0.2">',
      `<path d="M34 72V52l20-10 20 10v20l-20 10-20-10z" fill="${accent}"/>`,
      `<path d="M82 69V53l16-8 16 8v16l-16 8-16-8z" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "healthcare") {
    return [
      '<g id="domain-motif-healthcare" opacity="0.2">',
      `<circle cx="46" cy="58" r="16" fill="${accent}"/>`,
      `<rect x="73" y="43" width="42" height="30" rx="14" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "education") {
    return [
      '<g id="domain-motif-education" opacity="0.2">',
      `<rect x="24" y="45" width="42" height="28" rx="6" fill="${accent}"/>`,
      `<rect x="72" y="45" width="42" height="28" rx="6" fill="${accent}"/>`,
      `<rect x="67" y="45" width="4" height="28" fill="#FFFFFF" opacity="0.4"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "travel") {
    return [
      '<g id="domain-motif-travel" opacity="0.2">',
      `<path d="M26 70l26-22 10 8 24-15 8 8-22 17 20 16H72l-11-9-10 9H26l18-13-18-9z" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "gaming") {
    return [
      '<g id="domain-motif-gaming" opacity="0.2">',
      `<rect x="24" y="47" width="42" height="26" rx="13" fill="${accent}"/>`,
      `<rect x="74" y="47" width="42" height="26" rx="13" fill="${accent}"/>`,
      "</g>",
    ].join("");
  }
  return [
    '<g id="domain-motif-custom" opacity="0.2">',
    `<circle cx="38" cy="58" r="15" fill="${accent}"/>`,
    `<rect x="58" y="44" width="54" height="28" rx="14" fill="${accent}"/>`,
    "</g>",
  ].join("");
}

function renderDomainIcon(variant: DomainVisualVariant, color: string): string {
  const background = '<rect x="16" y="162" width="44" height="44" rx="12" fill="#FFFFFF" opacity="0.86"/>';
  if (variant === "saas") {
    return [
      '<g id="domain-icon-saas">',
      background,
      `<circle cx="30" cy="183" r="4.5" fill="${color}"/>`,
      `<circle cx="45" cy="177" r="4.5" fill="${color}" opacity="0.9"/>`,
      `<circle cx="45" cy="191" r="4.5" fill="${color}" opacity="0.8"/>`,
      `<path d="M33 182l8-4M33 184l8 6" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "ecommerce") {
    return [
      '<g id="domain-icon-ecommerce">',
      background,
      `<path d="M25 178h26l-3 16H28l-3-16z" fill="none" stroke="${color}" stroke-width="2"/>`,
      `<path d="M31 177c0-3 2-5 5-5h4c3 0 5 2 5 5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "fintech") {
    return [
      '<g id="domain-icon-fintech">',
      background,
      `<path d="M38 172l12 5v8c0 6-4.3 10-12 13-7.7-3-12-7-12-13v-8l12-5z" fill="none" stroke="${color}" stroke-width="2"/>`,
      `<path d="M33 184l4 4 7-8" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "healthcare") {
    return [
      '<g id="domain-icon-healthcare">',
      background,
      `<path d="M38 173v22M27 184h22" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "education") {
    return [
      '<g id="domain-icon-education">',
      background,
      `<path d="M22 182l16-7 16 7-16 7-16-7z" fill="none" stroke="${color}" stroke-width="2"/>`,
      `<path d="M28 185v6c0 2 4 4 10 4s10-2 10-4v-6" fill="none" stroke="${color}" stroke-width="2"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "travel") {
    return [
      '<g id="domain-icon-travel">',
      background,
      `<path d="M23 191l14-6 16-13 2 2-13 16-6 14-4-13-9-0z" fill="${color}" opacity="0.95"/>`,
      "</g>",
    ].join("");
  }
  if (variant === "gaming") {
    return [
      '<g id="domain-icon-gaming">',
      background,
      `<rect x="24" y="178" width="28" height="16" rx="8" fill="none" stroke="${color}" stroke-width="2"/>`,
      `<path d="M31 186h7M34.5 182.5v7" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`,
      `<circle cx="45" cy="184" r="1.8" fill="${color}"/><circle cx="48" cy="188" r="1.8" fill="${color}"/>`,
      "</g>",
    ].join("");
  }
  return [
    '<g id="domain-icon-custom">',
    background,
    `<circle cx="38" cy="184" r="11" fill="none" stroke="${color}" stroke-width="2"/>`,
    `<path d="M38 173v22M27 184h22" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`,
    `<circle cx="38" cy="184" r="2.2" fill="${color}"/>`,
    "</g>",
  ].join("");
}

function buildPersonaImage(
  groupId: string,
  domainStyle: DomainStyle,
  ageGroup: AgeGroup,
  gender: Gender,
  visitFrequency: SegmentInput["visitFrequency"],
): string {
  const age = AGE_STYLE[ageGroup];
  const genderStyle = GENDER_STYLE[gender];
  const visit = VISIT_STYLE[visitFrequency];
  const safeLabel = escapeXml(groupId);
  const labelX = 18;
  const labelTextX = 40;
  const labelFontSize = 9.5;
  const ageBadgeFontSize = 10;
  const ageBadgeWidth = Math.max(38, Math.ceil(estimateSvgTextWidth(age.badgeLabel, ageBadgeFontSize) + 16));
  const ageBadgeX = 220 - ageBadgeWidth - 16;
  const labelWidth = Math.min(
    136,
    Math.max(
      78,
      Math.ceil(labelTextX - labelX + estimateSvgTextWidth(domainStyle.badgeLabel, labelFontSize) + 10),
    ),
  );

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img" aria-label="${safeLabel}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${domainStyle.colors.bgStart}" />
      <stop offset="100%" stop-color="${domainStyle.colors.bgEnd}" />
    </linearGradient>
  </defs>
  <rect width="220" height="220" rx="28" fill="url(#bg)" />
  ${renderDomainMotif(domainStyle.motifVariant, domainStyle.colors.accent)}
  <circle cx="110" cy="92" r="38" fill="${age.skinTone}" />
  ${renderHair(genderStyle.hairShape, age.hairTone)}
  <circle cx="97" cy="101" r="3.2" fill="#4A352D" />
  <circle cx="123" cy="101" r="3.2" fill="#4A352D" />
  ${visit.mouth}
  ${age.details}
  ${renderOutfit(domainStyle.outfitVariant, domainStyle.colors.clothing, domainStyle.colors.accent)}
  ${renderDomainIcon(domainStyle.iconVariant, domainStyle.colors.clothing)}
  <rect x="${labelX}" y="16" width="${labelWidth}" height="22" rx="11" fill="#FFFFFF" opacity="0.78" />
  <circle cx="30" cy="27" r="4" fill="${domainStyle.colors.clothing}" />
  <text x="${labelTextX}" y="31" font-size="${labelFontSize}" fill="#22303F">${escapeXml(domainStyle.badgeLabel)}</text>
  <g id="age-badge">
    <rect x="${ageBadgeX}" y="16" width="${ageBadgeWidth}" height="22" rx="11" fill="#1D2A38" opacity="0.8" />
    <text x="${ageBadgeX + 8}" y="31" font-size="${ageBadgeFontSize}" fill="#FFFFFF">${escapeXml(age.badgeLabel)}</text>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolvePersona(input: SegmentInput): PersonaProfile {
  const domainCode = resolveDomainCode(input.domain);
  const domainStyle = resolveDomainStyle(input.domain, domainCode);
  const groupId = `grp_${domainCode}_${input.ageGroup}_${input.gender}_${input.visitFrequency}_${input.paymentTier}`;

  return {
    id: groupId,
    name: `${domainStyle.displayName} ${AGE_STYLE[input.ageGroup].label} ${GENDER_STYLE[input.gender].label} 그룹`,
    traits: [
      domainStyle.trait,
      AGE_STYLE[input.ageGroup].trait,
      GENDER_STYLE[input.gender].trait,
      VISIT_STYLE[input.visitFrequency].trait,
      PAYMENT_STYLE[input.paymentTier].trait,
    ],
    painPoints: [
      domainStyle.painPoint,
      AGE_STYLE[input.ageGroup].painPoint,
      GENDER_STYLE[input.gender].painPoint,
      VISIT_STYLE[input.visitFrequency].painPoint,
      PAYMENT_STYLE[input.paymentTier].painPoint,
    ],
    imagePath: buildPersonaImage(
      groupId,
      domainStyle,
      input.ageGroup,
      input.gender,
      input.visitFrequency,
    ),
    avatar3d: buildPersonaAvatar3DConfig(input),
  };
}
