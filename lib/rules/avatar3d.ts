import type { AgeGroup, Gender, PersonaAvatar3DConfig, SegmentInput } from "@/lib/types/segment";

const DEFAULT_PLACEHOLDER_MODEL = "/avatars/placeholders/base.glb";

const OUTFIT_PRESETS_BY_DOMAIN: Record<string, string> = {
  saas: "hoodie",
  ecommerce: "apron",
  fintech: "blazer",
  healthcare: "scrubs",
  education: "cardigan",
  travel: "windbreaker",
  gaming: "jersey",
};

const AGE_GROUPS: AgeGroup[] = ["10s", "20s", "30s", "40s", "50plus"];
const GENDERS: Gender[] = ["male", "female", "other"];

const MODEL_MANIFEST: Record<string, string> = AGE_GROUPS.flatMap((ageGroup) =>
  GENDERS.map((gender) => ({
    key: `${ageGroup}_${gender}`,
    modelPath: `/avatars/placeholders/${ageGroup}-${gender}.glb`,
  })),
).reduce<Record<string, string>>((acc, item) => {
  acc[item.key] = item.modelPath;
  return acc;
}, {});

function compactDomainKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveOutfitPreset(domain: string): string {
  const compactDomain = compactDomainKey(domain);
  return OUTFIT_PRESETS_BY_DOMAIN[compactDomain] ?? "jacket";
}

function resolveModelPath(ageGroup: AgeGroup, gender: Gender): string {
  return MODEL_MANIFEST[`${ageGroup}_${gender}`] ?? DEFAULT_PLACEHOLDER_MODEL;
}

export function buildPersonaAvatar3DConfig(input: SegmentInput): PersonaAvatar3DConfig {
  return {
    modelPath: resolveModelPath(input.ageGroup, input.gender),
    animation: input.visitFrequency,
    outfitPreset: resolveOutfitPreset(input.domain),
    materialPreset: input.paymentTier,
    cameraPreset: input.ageGroup === "10s" || input.ageGroup === "20s" ? "close" : "medium",
    autoRotate: true,
  };
}
