#!/usr/bin/env bash
# Usage: ./build_and_push.sh DIR_PATH AWS_ACCOUNT_ID ENV [REGION]
set -euo pipefail

DIR="$1"                  # e.g. "backend/email-service"
ACCOUNT="$2"
ENVIRONMENT="$3"          # e.g. "qa"
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

# Optional: tag as qa (floating alias for current environment)
echo "🏷️ Tagging $SERVICE_NAME:$SORTABLE_TAG as $ENVIRONMENT"
docker tag "$REPO:$SORTABLE_TAG" "$REPO:$ENVIRONMENT"
docker push "$REPO:$ENVIRONMENT"

echo "✅ Successfully pushed:"
echo "   • $REPO:$SORTABLE_TAG"
echo "   • $REPO:$ENVIRONMENT"