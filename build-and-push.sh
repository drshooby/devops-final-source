#!/usr/bin/env bash
# scripts/build-and-push.sh  SERVICE_NAME  TAG  AWS_ACCOUNT_ID  [REGION]
set -euo pipefail

SERVICE="$1"
TAG="$2"
ACCOUNT="$3"
REGION="${4:-us-west-2}"

declare -A PATHS=(
  ["frontend"]="frontend"
  ["list-service"]="backend/list-service"
  ["email-service"]="backend/email-service"
  ["metric-service"]="backend/metric-service"
)

if [[ -z "${PATHS[$SERVICE]:-}" ]]; then
  echo "❌ Unknown service: $SERVICE"; exit 1
fi

DIR="${PATHS[$SERVICE]}"
REPO="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$SERVICE"

echo "🚧 Building $SERVICE from $DIR"
docker buildx build --platform linux/amd64 -t "$REPO:$TAG" "$DIR"

echo "📤 Pushing $REPO:$TAG"
docker push "$REPO:$TAG"
echo "✅ $SERVICE pushed"
