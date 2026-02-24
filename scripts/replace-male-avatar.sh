#!/usr/bin/env bash
# Mixamo에서 다운로드한 남성 GLB 파일을 모든 연령대 placeholder에 적용합니다.
#
# 사용법:
#   bash scripts/replace-male-avatar.sh <다운로드된_GLB_경로>
#
# 예시:
#   bash scripts/replace-male-avatar.sh ~/Downloads/Ch46_nonPBR.glb

set -euo pipefail

SRC="${1:-}"

if [[ -z "$SRC" ]]; then
  echo "에러: GLB 파일 경로를 인수로 전달하세요."
  echo "사용법: bash scripts/replace-male-avatar.sh <GLB_파일_경로>"
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "에러: 파일을 찾을 수 없습니다 → $SRC"
  exit 1
fi

DEST_DIR="$(dirname "$0")/../public/avatars"
SOURCE_FILE="$DEST_DIR/sources/male.glb"

echo "→ sources/male.glb 교체 중..."
cp "$SRC" "$SOURCE_FILE"

echo "→ placeholders 갱신 중..."
for AGE in 10s 20s 30s 40s 50plus; do
  cp "$SOURCE_FILE" "$DEST_DIR/placeholders/${AGE}-male.glb"
  echo "   ${AGE}-male.glb"
done

echo "완료. 서버를 재시작하면 반영됩니다."
