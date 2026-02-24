"use client";

import { Component, Suspense, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Color, Vector3 } from "three";
import type { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import type { AgeGroup, PersonaAvatar3DConfig } from "@/lib/types/segment";

interface PersonaAvatar3DProps {
  config: PersonaAvatar3DConfig;
  blurPx: number;
  saturate: number;
  scale: number;
  onError: () => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
  resetKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function getAgeModifiers(agePreset: AgeGroup): { heightScale: number; widthScale: number; animSpeed: number } {
  if (agePreset === "10s") return { heightScale: 0.91, widthScale: 0.93, animSpeed: 1.25 };
  if (agePreset === "30s") return { heightScale: 1.00, widthScale: 1.03, animSpeed: 0.90 };
  if (agePreset === "40s") return { heightScale: 0.99, widthScale: 1.07, animSpeed: 0.80 };
  if (agePreset === "50plus") return { heightScale: 0.96, widthScale: 1.10, animSpeed: 0.65 };
  return { heightScale: 1.00, widthScale: 1.00, animSpeed: 1.00 };
}

function getCameraPosition(cameraPreset: PersonaAvatar3DConfig["cameraPreset"]): [number, number, number] {
  return cameraPreset === "close" ? [0, 0.72, 3.1] : [0, 0.8, 3.6];
}

function getCameraTarget(cameraPreset: PersonaAvatar3DConfig["cameraPreset"]): [number, number, number] {
  return cameraPreset === "close" ? [0, 0.68, 0] : [0, 0.73, 0];
}

function getOutfitBaseColor(outfitPreset: PersonaAvatar3DConfig["outfitPreset"]): string {
  if (outfitPreset === "hoodie") return "#3f78db";
  if (outfitPreset === "apron") return "#ca6c2d";
  if (outfitPreset === "blazer") return "#2d8a67";
  if (outfitPreset === "scrubs") return "#2f90b9";
  if (outfitPreset === "cardigan") return "#8a5ec2";
  if (outfitPreset === "windbreaker") return "#34a27f";
  if (outfitPreset === "jersey") return "#ba4f99";
  return "#6f7b8e";
}

function getPaymentTone(materialPreset: PersonaAvatar3DConfig["materialPreset"]): {
  satOffset: number;
  lightOffset: number;
  metalness: number;
  roughness: number;
} {
  if (materialPreset === "high") {
    return { satOffset: 0.1, lightOffset: 0.08, metalness: 0.36, roughness: 0.44 };
  }
  if (materialPreset === "mid") {
    return { satOffset: 0, lightOffset: 0, metalness: 0.2, roughness: 0.62 };
  }
  return { satOffset: -0.12, lightOffset: -0.06, metalness: 0.1, roughness: 0.78 };
}

function applyMaterialPreset(
  scene: Object3D,
  materialPreset: PersonaAvatar3DConfig["materialPreset"],
  outfitPreset: PersonaAvatar3DConfig["outfitPreset"],
): void {
  const baseColor = new Color(getOutfitBaseColor(outfitPreset));
  const tone = getPaymentTone(materialPreset);

  const shadedColor = baseColor.clone();
  shadedColor.offsetHSL(0, tone.satOffset, tone.lightOffset);

  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const standardMaterial = material as MeshStandardMaterial;
      if (!("color" in standardMaterial)) return;
      standardMaterial.color.copy(shadedColor);
      if ("metalness" in standardMaterial) standardMaterial.metalness = tone.metalness;
      if ("roughness" in standardMaterial) standardMaterial.roughness = tone.roughness;
      standardMaterial.needsUpdate = true;
    });
  });
}

function AvatarModel({ config }: { config: PersonaAvatar3DConfig }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(config.modelPath);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    applyMaterialPreset(clone, config.materialPreset, config.outfitPreset);
    clone.updateMatrixWorld(true);

    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const rawHeight = size.y > 0 ? size.y : 1;
    const targetHeight = config.cameraPreset === "close" ? 2.0 : 1.8;
    const normalizeScale = targetHeight / rawHeight;

    clone.scale.setScalar(normalizeScale);
    clone.updateMatrixWorld(true);

    const normalizedBox = new Box3().setFromObject(clone);
    const normalizedCenter = normalizedBox.getCenter(new Vector3());

    clone.position.set(-normalizedCenter.x, -normalizedCenter.y, -normalizedCenter.z);
    clone.position.y += config.cameraPreset === "close" ? -0.08 : -0.02;

    if (!Number.isFinite(center.y) || !Number.isFinite(rawHeight)) {
      clone.position.set(0, 0, 0);
      clone.scale.setScalar(1);
    }

    return clone;
  }, [scene, config.materialPreset, config.outfitPreset, config.cameraPreset]);

  const { heightScale, widthScale, animSpeed } = getAgeModifiers(config.agePreset);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const baseY = config.cameraPreset === "close" ? -0.06 : -0.02;

    if (config.animation === "new") {
      groupRef.current.rotation.y = Math.sin(t * 1.2 * animSpeed) * 0.12;
      groupRef.current.position.y = baseY + Math.sin(t * 1.1 * animSpeed) * 0.05;
      return;
    }
    if (config.animation === "occasional") {
      groupRef.current.rotation.y = Math.sin(t * 0.9 * animSpeed) * 0.08;
      groupRef.current.position.y = baseY + Math.sin(t * 0.7 * animSpeed) * 0.03;
      return;
    }
    if (config.animation === "regular") {
      groupRef.current.rotation.y = Math.sin(t * 0.6 * animSpeed) * 0.05;
      groupRef.current.position.y = baseY + Math.sin(t * 0.9 * animSpeed) * 0.02;
      return;
    }
    groupRef.current.rotation.y = Math.sin(t * 0.4 * animSpeed) * 0.03;
    groupRef.current.position.y = baseY + Math.sin(t * 0.8 * animSpeed) * 0.015;
  });

  return (
    <group ref={groupRef}>
      <group scale={[widthScale, heightScale, widthScale]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

export function PersonaAvatar3D({ config, blurPx, saturate, scale, onError }: PersonaAvatar3DProps) {
  const cameraPosition = getCameraPosition(config.cameraPreset);
  const cameraTarget = getCameraTarget(config.cameraPreset);

  return (
    <div
      className="persona-3d-layer"
      data-testid="persona-3d-viewer"
      style={{
        filter: `blur(${blurPx}px) saturate(${saturate})`,
        transform: `scale(${scale})`,
      }}
    >
      <ModelErrorBoundary onError={onError} resetKey={config.modelPath}>
        <Canvas camera={{ position: cameraPosition, fov: 42 }}>
          <ambientLight intensity={0.95} />
          <directionalLight position={[2.4, 3.2, 2.1]} intensity={1.45} />
          <directionalLight position={[-2.1, 1.1, -1.5]} intensity={0.5} />
          <Suspense fallback={null}>
            <AvatarModel config={config} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={config.autoRotate}
            autoRotateSpeed={0.9}
            target={cameraTarget}
            minPolarAngle={0.9}
            maxPolarAngle={2.2}
          />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}
