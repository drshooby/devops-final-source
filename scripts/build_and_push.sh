#!/usr/bin/env bash
# Usage: ./build_and_push.sh DIR_PATH AWS_ACCOUNT_ID [REGION]
set -euo pipefail

DIR="$1"                  # e.g. "backend/email-service"
ACCOUNT="$2"
REGION="${3:-us-west-2}"

SERVICE_NAME="$(basename "$DIR")"            # "email-service"
REPO="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/$SERVICE_NAME"

# Load version from VERSION.txt
VERSION="$(cat VERSION.txt)"                 # e.g. 1.0.3-QA
DATE="$(date +%Y%m%d)"                       # e.g. 20250430

FULL_TAG="${VERSION}-${DATE}"

echo "🚧 Building $SERVICE_NAME from $DIR"
docker buildx build --platform linux/amd64 -t "$REPO:$FULL_TAG" "$DIR"

echo "📤 Pushing $REPO:$FULL_TAG"
docker push "$REPO:$FULL_TAG"

echo "✅ Successfully pushed $SERVICE_NAME:$FULL_TAG"