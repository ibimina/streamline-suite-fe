# Deploy Workflow Explanation 🚀

This document explains the `deploy.yml` GitHub Actions workflow file in detail, breaking down each section and explaining how the deployment pipeline works.

## 📋 Workflow Overview

The deploy workflow is responsible for automatically deploying Streamline Suite to production and staging environments. It's a comprehensive CD (Continuous Deployment) pipeline that ensures safe, reliable deployments.

## 🎯 Workflow Triggers

```yaml
on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging
      skip_tests:
        description: 'Skip tests and deploy directly'
        required: false
        default: false
        type: boolean
```

### **When the workflow runs:**

1. **Automatic Triggers:**
   - **Push to main branch** → Deploys to staging environment
   - **Git tags starting with 'v'** (e.g., v1.0.0) → Deploys to production

2. **Manual Trigger** (`workflow_dispatch`):
   - Can be triggered manually from GitHub Actions tab
   - Allows choosing environment (production/staging)
   - Option to skip tests for emergency deployments

## 🔒 Concurrency Control

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```

**Purpose**: Prevents multiple deployments from running simultaneously
- **Group**: Creates unique groups per branch/tag
- **Cancel-in-progress**: `false` means if a deployment is running, new ones wait (doesn't cancel)

## 🏗️ Jobs Breakdown

### 1. **🔍 Pre-deployment Checks** (`pre-deploy`)

```yaml
jobs:
  pre-deploy:
    name: 🔍 Pre-deployment Checks
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    
    outputs:
      version: ${{ steps.version.outputs.version }}
      environment: ${{ steps.env.outputs.environment }}
```

**What it does:**
- **Version Calculation**: Creates version numbers for the deployment
- **Environment Detection**: Determines if deploying to production or staging
- **Conditional Execution**: Only runs for push events or manual dispatch

#### **Version Generation Logic:**
```bash
if [[ $GITHUB_REF == refs/tags/* ]]; then
  VERSION=${GITHUB_REF#refs/tags/}        # Use tag name (e.g., v1.0.0)
else
  VERSION=$(date +"%Y.%m.%d")-$(git rev-parse --short HEAD)  # Use date + commit
fi
```

**Examples:**
- Tag `v1.2.3` → Version: `v1.2.3`
- Push to main → Version: `2024.11.06-abc1234`

#### **Environment Detection Logic:**
```bash
if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
  ENV="${{ github.event.inputs.environment }}"  # Use manual selection
elif [[ $GITHUB_REF == refs/tags/* ]]; then
  ENV="production"                               # Tags go to production
else
  ENV="staging"                                  # Everything else to staging
fi
```

### 2. **🏗️ Build for Production** (`build-production`)

```yaml
build-production:
  name: 🏗️ Build for Production
  runs-on: ubuntu-latest
  needs: pre-deploy
```

**What it does:**
- **Dependency Installation**: `npm ci` for clean, reproducible installs
- **Environment Setup**: Injects build metadata into environment variables
- **Production Build**: Creates optimized production bundle
- **Artifact Creation**: Compresses and stores build for deployment

#### **Environment Variables Injected:**
```bash
NEXT_PUBLIC_VERSION=${{ needs.pre-deploy.outputs.version }}
NEXT_PUBLIC_BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
NEXT_PUBLIC_COMMIT_SHA=${GITHUB_SHA}
```

These become available in your Next.js app as:
- `process.env.NEXT_PUBLIC_VERSION`
- `process.env.NEXT_PUBLIC_BUILD_DATE`
- `process.env.NEXT_PUBLIC_COMMIT_SHA`

#### **Build Optimization:**
```yaml
env:
  NODE_ENV: production
  NEXT_TELEMETRY_DISABLED: 1
```

- **NODE_ENV=production**: Enables production optimizations
- **NEXT_TELEMETRY_DISABLED=1**: Disables Next.js telemetry for faster builds

### 3. **🧪 Production Tests** (`test-production`)

```yaml
test-production:
  name: 🧪 Production Tests
  runs-on: ubuntu-latest
  needs: [pre-deploy, build-production]
  if: github.event.inputs.skip_tests != 'true'
```

**What it does:**
- **Production Testing**: Runs tests against the production build
- **E2E Testing**: Full end-to-end testing with production configuration
- **Quality Gates**: Ensures production build meets quality standards
- **Skip Option**: Can be bypassed for emergency deployments

#### **Test Types:**
- **Production Tests**: `npm run test:production`
- **E2E Tests**: `npm run test:e2e:production`
- **Build Validation**: Ensures the build starts correctly

### 4. **🚀 Deploy to Vercel** (`deploy-vercel`)

```yaml
deploy-vercel:
  name: 🚀 Deploy to Vercel
  runs-on: ubuntu-latest
  needs: [pre-deploy, build-production, test-production]
  if: always() && (needs.test-production.result == 'success' || needs.test-production.result == 'skipped')
  environment: ${{ needs.pre-deploy.outputs.environment }}
```

**What it does:**
- **Conditional Deployment**: Only deploys if tests pass or are skipped
- **Environment Protection**: Uses GitHub environment protection rules
- **Vercel Integration**: Deploys to Vercel platform

#### **Deployment Logic:**
```yaml
vercel-args: ${{ needs.pre-deploy.outputs.environment == 'production' && '--prod' || '' }}
```

- **Production**: Uses `--prod` flag for production deployment
- **Staging**: Uses preview deployment (no flag)

#### **Required Secrets:**
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your project ID

### 5. **🧪 Post-deployment Tests** (`post-deploy`)

```yaml
post-deploy:
  name: 🧪 Post-deployment Tests
  runs-on: ubuntu-latest
  needs: [pre-deploy, deploy-vercel]
  if: always() && needs.deploy-vercel.result == 'success'
```

**What it does:**
- **Smoke Tests**: Basic functionality tests on live site
- **Performance Testing**: Lighthouse CI on deployed application
- **Health Checks**: Verifies deployment is working correctly

#### **Test Types:**
- **Smoke Tests**: `npm run test:smoke` - Basic functionality verification
- **Lighthouse**: Performance, accessibility, SEO validation on live site

### 6. **📦 Create Release** (`create-release`)

```yaml
create-release:
  name: 📦 Create Release
  runs-on: ubuntu-latest
  needs: [pre-deploy, post-deploy]
  if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/v') && needs.post-deploy.result == 'success'
```

**What it does:**
- **Automatic Releases**: Creates GitHub releases for tagged versions
- **Changelog Generation**: Automatically generates changelog from git commits
- **Asset Upload**: Attaches build artifacts to the release

#### **Changelog Logic:**
```bash
PREV_TAG=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "")
if [ -n "$PREV_TAG" ]; then
  CHANGELOG=$(git log $PREV_TAG..HEAD --pretty=format:"- %s (%h)" --no-merges)
else
  CHANGELOG=$(git log --pretty=format:"- %s (%h)" --no-merges)
fi
```

### 7. **📢 Team Notifications** (`notify`)

```yaml
notify:
  name: 📢 Notify Team
  runs-on: ubuntu-latest
  needs: [pre-deploy, post-deploy]
  if: always()
```

**What it does:**
- **Slack Notifications**: Sends deployment status to team Slack channel
- **Email Alerts**: Sends email notifications to team
- **Always Runs**: Notifies regardless of success/failure

## 🔄 Deployment Flow Diagram

```
┌─────────────────┐
│   Trigger       │
│ (Push/Tag/Manual)│
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Pre-deploy     │ ← Version & Environment Detection
│  Checks         │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Build          │ ← Create Production Build
│  Production     │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Test           │ ← Validate Production Build
│  Production     │   (Can be skipped)
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Deploy         │ ← Deploy to Vercel
│  Vercel         │   (Production or Staging)
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Post-deploy    │ ← Test Live Site
│  Tests          │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Create         │ ← Generate Release (tags only)
│  Release        │
└─────────┬───────┘
          │
┌─────────▼───────┐
│  Notify         │ ← Alert Team
│  Team           │
└─────────────────┘
```

## 🌍 Environment Strategy

### **Staging Environment:**
- **Trigger**: Push to `main` branch
- **Purpose**: Integration testing, QA review
- **URL**: Uses Vercel preview URL
- **Tests**: Full test suite runs

### **Production Environment:**
- **Trigger**: Git tags (e.g., `v1.0.0`)
- **Purpose**: Live user traffic
- **URL**: Production domain
- **Protection**: GitHub environment protection rules

## 🛡️ Safety Features

### **1. Concurrency Control**
- Prevents multiple deployments from running simultaneously
- Ensures deployments happen in order

### **2. Conditional Execution**
- Tests must pass before deployment (unless explicitly skipped)
- Only deploys on successful builds

### **3. Environment Protection**
- GitHub environments can require manual approval for production
- Restricts who can deploy to production

### **4. Rollback Capability**
- Vercel provides instant rollback to previous deployments
- Git tags allow easy identification of deployed versions

### **5. Comprehensive Testing**
- Pre-deployment: Build and unit tests
- Post-deployment: Smoke tests and performance validation

## 🔧 Configuration Options

### **Manual Deployment Options:**
1. **Environment Selection**: Choose production or staging
2. **Skip Tests**: For emergency deployments (use carefully!)

### **Automatic Behavior:**
- **main branch** → staging deployment
- **v* tags** → production deployment
- **Always notify team** of deployment status

## 📊 Artifacts & Outputs

### **Build Artifacts:**
- Compressed production build (`build-VERSION.tar.gz`)
- Lighthouse reports
- Test results

### **Release Assets:**
- Production build attached to GitHub release
- Changelog with commit history
- Deployment metadata

## 🚨 Troubleshooting Common Issues

### **Deployment Fails:**
1. Check if all required secrets are configured
2. Verify Vercel project connection
3. Check build logs for errors

### **Tests Fail:**
1. Run tests locally first: `npm run test:production`
2. Check if production build starts: `npm run build && npm run start`
3. Use skip tests option for emergency deployments

### **Notifications Don't Work:**
1. Verify `SLACK_WEBHOOK_URL` is correct
2. Check email credentials if using email notifications
3. Ensure notification channels exist

## 🎯 Best Practices

### **For Deployments:**
1. **Test Locally**: Always test builds locally before pushing
2. **Use Staging**: Test on staging before production releases
3. **Tag Properly**: Use semantic versioning for tags (v1.0.0)
4. **Monitor**: Watch deployment notifications and check live site

### **For Emergency Deployments:**
1. Use `workflow_dispatch` with skip tests if needed
2. Always test the deployed site immediately
3. Have rollback plan ready
4. Communicate with team

### **For Version Management:**
1. **Tags for Production**: Only tag stable, tested code
2. **Semantic Versioning**: Use v1.0.0, v1.1.0, v2.0.0 format
3. **Changelog**: Git commit messages become changelog entries

This workflow provides a robust, automated deployment pipeline that ensures high-quality, reliable deployments while maintaining the flexibility for emergency situations. 🚀