# Code Assessment App

Standalone code assessment application for MaximizeHire. Runs independently from the main app for fast, isolated deployments.

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev    # Runs on port 3001

# Production build
npm run build
npm start
```

## Deploy to AWS Amplify (Easiest)

1. **Create new Amplify app:**
   ```bash
   aws amplify create-app --name code-assessment --platform WEB
   ```

2. **Connect to GitHub repo** or deploy manually:
   ```bash
   # Create zip for manual deploy
   zip -r code-assessment.zip . -x "node_modules/*" -x ".git/*" -x ".next/*"
   ```

3. **Set environment variables in Amplify:**
   - `AWS_REGION=us-west-2`
   - `S3_BUCKET_NAME=maximizehire-uploads-dev`

## Deploy to Docker

```bash
# Build image
docker build -t code-assessment .

# Run container
docker run -p 3001:3001 \
  -e AWS_REGION=us-west-2 \
  -e AWS_ACCESS_KEY_ID=xxx \
  -e AWS_SECRET_ACCESS_KEY=xxx \
  -e S3_BUCKET_NAME=maximizehire-uploads-dev \
  code-assessment
```

## Deploy to Vercel (Fastest)

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard.

## Features

- 8 programming languages: Python, JavaScript, Java, C++, C, Go, Rust, Scala
- Running Average coding problem
- Access code authentication (HIRE2024, MAXHIRE, CODETEST, ASSESS123)
- Code execution via AWS Lambda
- Submissions saved to S3
- Rate limiting (20 requests/minute per IP)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| AWS_REGION | AWS region for Lambda/S3 | us-west-2 |
| AWS_ACCESS_KEY_ID | AWS credentials | - |
| AWS_SECRET_ACCESS_KEY | AWS credentials | - |
| S3_BUCKET_NAME | S3 bucket for submissions | maximizehire-uploads-dev |

## Customizing Access Codes

Edit `src/app/page.tsx`:

```typescript
const VALID_ACCESS_CODES = ['HIRE2024', 'MAXHIRE', 'CODETEST', 'ASSESS123']
```

## Cost

- Lambda execution: ~$0.0000002 per run
- S3 storage: ~$0.023 per GB/month
- **No AI validation = very cheap**
