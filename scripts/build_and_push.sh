#!/usr/bin/env bash
# Usage: ./build_and_push.sh DIR_PATH AWS_ACCOUNT_ID ENV [REGION]
set -euo pipefail

DIR="$1"                  # e.g. "backend/email-service"
ACCOUNT="$2"
ENVIRONMENT="$3"          # e.g. "qa", "uat", etc.
REGION="${4:-us-east-1}"

SERVICE_NAME="$(basename "$DIR")"
REPO="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$SERVICE_NAME"

# Load version from VERSION.txt
VERSION="$(cat VERSION.txt)"
DATE="$(date +%Y%m%d)"

# Create a sortable, unique tag
SORTABLE_TAG="${VERSION}-${DATE}"

echo "🚧 Building $SERVICE_NAME from $DIR"
docker buildx build --platform linux/amd64 -t "$REPO:$SORTABLE_TAG" "$DIR"

echo "📤 Pushing $REPO:$SORTABLE_TAG"
docker push "$REPO:$SORTABLE_TAG"

echo "🏷️ Promoting $SERVICE_NAME:$SORTABLE_TAG to $ENVIRONMENT (ECR-native retag)"
echo "📦 Fetching image manifest for $SORTABLE_TAG"

MANIFEST=$(aws ecr batch-get-image \
  --repository-name "$SERVICE_NAME" \
  --image-ids imageTag="$SORTABLE_TAG" \
  --query 'images[].imageManifest' \
  --output text \
  --region "$REGION")

echo "🚀 Putting new tag: $ENVIRONMENT -> $SORTABLE_TAG"
aws ecr put-image \
  --repository-name "$SERVICE_NAME" \
  --image-tag "$ENVIRONMENT" \
  --image-manifest "$MANIFEST" \
  --region "$REGION"

echo "✅ Successfully pushed and promoted:"
echo "   • $REPO:$SORTABLE_TAG"
echo "   • $REPO:$ENVIRONMENT (now pointing to $SORTABLE_TAG)"
