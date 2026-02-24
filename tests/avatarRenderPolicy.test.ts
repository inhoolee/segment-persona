import { shouldRender3DAvatar, type AvatarRenderPolicyContext } from "@/lib/utils/avatarRenderPolicy";

function baseContext(overrides: Partial<AvatarRenderPolicyContext> = {}): AvatarRenderPolicyContext {
  return {
    prefersReducedMotion: false,
    webglSupported: true,
    deviceMemory: 8,
    hardwareConcurrency: 8,
    ...overrides,
  };
}

describe("shouldRender3DAvatar", () => {
  it("모션 축소 환경에서는 3D 렌더를 비활성화한다", () => {
    expect(shouldRender3DAvatar(baseContext({ prefersReducedMotion: true }))).toBe(false);
  });

  it("WebGL 미지원 환경에서는 3D 렌더를 비활성화한다", () => {
    expect(shouldRender3DAvatar(baseContext({ webglSupported: false }))).toBe(false);
  });

  it("저사양 기기(deviceMemory <= 4 또는 hardwareConcurrency <= 4)에서는 3D 렌더를 비활성화한다", () => {
    expect(shouldRender3DAvatar(baseContext({ deviceMemory: 4 }))).toBe(false);
    expect(shouldRender3DAvatar(baseContext({ hardwareConcurrency: 4 }))).toBe(false);
  });

  it("정상 환경에서는 3D 렌더를 허용한다", () => {
    expect(shouldRender3DAvatar(baseContext())).toBe(true);
  });
});
