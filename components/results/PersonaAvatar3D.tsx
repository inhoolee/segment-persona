"use client";

import { Component, Suspense, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import type { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import type { PersonaAvatar3DConfig } from "@/lib/types/segment";

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

function getCameraPosition(cameraPreset: PersonaAvatar3DConfig["cameraPreset"]): [number, number, number] {
  return cameraPreset === "close" ? [0, 0.72, 3.1] : [0, 0.8, 3.6];
}

function getCameraTarget(cameraPreset: PersonaAvatar3DConfig["cameraPreset"]): [number, number, number] {
  return cameraPreset === "close" ? [0, 0.68, 0] : [0, 0.73, 0];
}

function getMaterialColor(materialPreset: PersonaAvatar3DConfig["materialPreset"]): string {
  if (materialPreset === "high") return "#f2d282";
  if (materialPreset === "mid") return "#9fb7d7";
  return "#7f8a9a";
}

function applyMaterialPreset(scene: Object3D, materialPreset: PersonaAvatar3DConfig["materialPreset"]): void {
  const color = getMaterialColor(materialPreset);
  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const standardMaterial = material as MeshStandardMaterial;
      if (!("color" in standardMaterial)) return;
      standardMaterial.color.set(color);
      standardMaterial.needsUpdate = true;
    });
  });
}

function AvatarModel({ config }: { config: PersonaAvatar3DConfig }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(config.modelPath);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    applyMaterialPreset(clone, config.materialPreset);
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
  }, [scene, config.materialPreset, config.cameraPreset]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const baseY = config.cameraPreset === "close" ? -0.06 : -0.02;

    if (config.animation === "new") {
      groupRef.current.rotation.y = Math.sin(t * 1.2) * 0.12;
      groupRef.current.position.y = baseY + Math.sin(t * 1.1) * 0.05;
      return;
    }
    if (config.animation === "occasional") {
      groupRef.current.rotation.y = Math.sin(t * 0.9) * 0.08;
      groupRef.current.position.y = baseY + Math.sin(t * 0.7) * 0.03;
      return;
    }
    if (config.animation === "regular") {
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.05;
      groupRef.current.position.y = baseY + Math.sin(t * 0.9) * 0.02;
      return;
    }
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.03;
    groupRef.current.position.y = baseY + Math.sin(t * 0.8) * 0.015;
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
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
