#!/bin/bash

# Deploy Code Assessment App
# Usage: ./deploy.sh [vercel|docker|amplify]

set -e

METHOD=${1:-vercel}

echo "Deploying code-assessment-app via $METHOD..."

case $METHOD in
  vercel)
    echo "Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm i -g vercel
    fi
    vercel --prod
    echo "Done! Set environment variables in Vercel dashboard:"
    echo "  - AWS_REGION=us-west-2"
    echo "  - AWS_ACCESS_KEY_ID"
    echo "  - AWS_SECRET_ACCESS_KEY"
    echo "  - S3_BUCKET_NAME=maximizehire-uploads-dev"
    ;;

  docker)
    echo "Building Docker image..."
    docker build -t code-assessment .
    echo ""
    echo "Run with:"
    echo "  docker run -p 3001:3001 \\"
    echo "    -e AWS_REGION=us-west-2 \\"
    echo "    -e AWS_ACCESS_KEY_ID=xxx \\"
    echo "    -e AWS_SECRET_ACCESS_KEY=xxx \\"
    echo "    -e S3_BUCKET_NAME=maximizehire-uploads-dev \\"
    echo "    code-assessment"
    ;;

  amplify)
    echo "Creating zip for Amplify manual deployment..."
    rm -f code-assessment.zip
    zip -r code-assessment.zip . \
      -x "node_modules/*" \
      -x ".git/*" \
      -x ".next/*" \
      -x "*.zip"
    echo ""
    echo "Created code-assessment.zip"
    echo "Upload to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
    echo ""
    echo "Build settings for Amplify:"
    echo "  baseDirectory: .next"
    echo "  build command: npm ci && npm run build"
    ;;

  *)
    echo "Unknown method: $METHOD"
    echo "Usage: ./deploy.sh [vercel|docker|amplify]"
    exit 1
    ;;
esac
