#!/usr/bin/env bash
# Usage: ./build_and_push.sh DIR_PATH TAG AWS_ACCOUNT_ID [REGION]
set -euo pipefail

DIR="$1"                  # e.g. "backend/email-service"
TAG="$2"
ACCOUNT="$3"
REGION="${4:-us-west-2}"

SERVICE_NAME="$(basename "$DIR")"            # "email-service"
REPO="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$SERVICE_NAME"

echo "🚧 Building $SERVICE_NAME from $DIR"
docker buildx build --platform linux/amd64 -t "$REPO:$TAG" "$DIR"

echo "📤 Pushing $REPO:$TAG"
docker push "$REPO:$TAG"

echo "✅ Successfully pushed $SERVICE_NAME:$TAG"
