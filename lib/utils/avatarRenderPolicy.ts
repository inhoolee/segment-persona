export interface AvatarRenderPolicyContext {
  prefersReducedMotion: boolean;
  webglSupported: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

function detectWebglSupport(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  const contexts: Array<"webgl2" | "webgl" | "experimental-webgl"> = ["webgl2", "webgl", "experimental-webgl"];
  return contexts.some((name) => {
    try {
      return Boolean(canvas.getContext(name));
    } catch {
      return false;
    }
  });
}

function getRuntimeContext(): AvatarRenderPolicyContext | null {
  if (typeof window === "undefined" || typeof navigator === "undefined" || typeof document === "undefined") {
    return null;
  }

  const browserNavigator = navigator as Navigator & { deviceMemory?: number };

  return {
    prefersReducedMotion: Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
    webglSupported: detectWebglSupport(),
    deviceMemory: browserNavigator.deviceMemory,
    hardwareConcurrency: browserNavigator.hardwareConcurrency,
  };
}

export function shouldRender3DAvatar(context?: AvatarRenderPolicyContext): boolean {
  const resolved = context ?? getRuntimeContext();
  if (!resolved) return false;
  if (resolved.prefersReducedMotion) return false;
  if (!resolved.webglSupported) return false;
  if (typeof resolved.deviceMemory === "number" && resolved.deviceMemory <= 4) return false;
  if (typeof resolved.hardwareConcurrency === "number" && resolved.hardwareConcurrency <= 4) return false;
  return true;
}
