#!/bin/bash
set -e

# This script builds, tags, and pushes Docker images to ECR
# Usage: ./build-and-push.sh $IMAGE_TAG $AWS_ACCOUNT_ID

IMAGE_TAG=$1
AWS_ACCOUNT_ID=$2
REGION="us-west-2"

if [ -z "$IMAGE_TAG" ] || [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "⚠️ Error: Missing required parameters"
  echo "Usage: ./build-and-push.sh <IMAGE_TAG> <AWS_ACCOUNT_ID>"
  exit 1
fi

# Define services and their paths
declare -A SERVICES=(
  ["frontend"]="frontend"
  ["list-service"]="backend/list-service"
  ["email-service"]="backend/email-service"
  ["metric-service"]="backend/metric-service"
)

# Loop through services and build/push each one
for SERVICE in "${!SERVICES[@]}"; do
  SERVICE_PATH="${SERVICES[$SERVICE]}"
  REPO_URI="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$SERVICE"
  FULL_TAG="$REPO_URI:$IMAGE_TAG"
  
  echo "🚧 Building $SERVICE at $SERVICE_PATH"
  docker build -t $SERVICE "$SERVICE_PATH"
  
  echo "🏷️ Tagging as $FULL_TAG"
  docker tag $SERVICE $FULL_TAG
  
  echo "🚀 Pushing $FULL_TAG"
  docker push $FULL_TAG
  
  echo "✅ Completed $SERVICE"
done

echo "🎉 All services built and pushed successfully"
