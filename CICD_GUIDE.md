# CI/CD Implementation Guide 🚀

This guide covers the complete CI/CD pipeline implementation for Streamline Suite, including continuous integration, automated testing, security scanning, and deployment automation.

## 🏗️ Pipeline Overview

Our CI/CD pipeline consists of multiple workflows that ensure code quality, security, and reliable deployments:

### 📋 Workflow Structure
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Pull Request  │    │   Push to Main   │    │   Scheduled     │
│                 │    │                  │    │                 │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ • Code Quality  │    │ • Full CI Suite  │    │ • Dependencies  │
│ • Unit Tests    │    │ • Security Scan  │    │ • Security Audit│
│ • Build Check   │    │ • Deploy Staging │    │ • Health Checks │
│ • Lint/Format   │    │ • Deploy Prod    │    │                 │
│ • Type Check    │    │ • Post-Deploy   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Setup Instructions

### 1. **Repository Setup**

#### GitHub Secrets Configuration
Add these secrets to your GitHub repository (`Settings > Secrets and Variables > Actions`):

```bash
# Deployment Secrets
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# Alternative Deployment Options
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_netlify_site_id

# AWS Deployment (if using)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_id

# Environment URLs
PRODUCTION_URL=https://your-production-domain.com
STAGING_URL=https://your-staging-domain.com
MONITORING_URL=https://your-monitoring-dashboard.com

# Security & Quality
SNYK_TOKEN=your_snyk_token
CODECOV_TOKEN=your_codecov_token

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url
SECURITY_SLACK_WEBHOOK_URL=your_security_slack_webhook
EMAIL_USERNAME=your_notification_email
EMAIL_PASSWORD=your_email_password
TEAM_EMAIL=team@yourcompany.com
```

#### 🔑 How to Get Secret Values

##### **SNYK_TOKEN** - Security Vulnerability Scanning
1. **Sign up at [Snyk.io](https://snyk.io)**
   - Go to https://snyk.io and create a free account
   - You can sign up with GitHub for easier integration

2. **Get Your API Token**
   - After logging in, click your profile picture (top right)
   - Select **"Account Settings"**
   - Scroll down to **"API Token"** section
   - Click **"Show"** next to your token
   - Copy the token (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

3. **Add to GitHub Secrets**
   - **Secret Name**: `SNYK_TOKEN`
   - **Secret Value**: Paste your Snyk API token

##### **CODECOV_TOKEN** - Code Coverage Reporting
1. **Sign up at [Codecov.io](https://codecov.io)**
   - Go to https://codecov.io and sign up with your GitHub account
   - This automatically syncs your repositories

2. **Find Your Repository Token**
   - After login, you'll see your repositories listed
   - Click on your `streamline-suite-fe` repository
   - Go to **"Settings"** tab in Codecov
   - Copy the **"Repository Upload Token"**
   - Format looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

3. **Add to GitHub Secrets**
   - **Secret Name**: `CODECOV_TOKEN`
   - **Secret Value**: Paste your Codecov repository token

##### **VERCEL_TOKEN** - Deployment Platform
1. **Sign up at [Vercel.com](https://vercel.com)**
   - Go to https://vercel.com and sign up with GitHub
   - Import your `streamline-suite-fe` repository

2. **Get API Token**
   - Go to Vercel Dashboard → **Settings** → **Tokens**
   - Click **"Create Token"**
   - Give it a name (e.g., "GitHub Actions")
   - Set expiration (or no expiration)
   - Copy the generated token

3. **Get Organization and Project IDs**
   - In your project dashboard, go to **Settings** → **General**
   - Copy **"Project ID"** and **"Team ID"** (Organization ID)

4. **Add to GitHub Secrets**
   - **VERCEL_TOKEN**: Your API token
   - **VERCEL_ORG_ID**: Your team/organization ID
   - **VERCEL_PROJECT_ID**: Your project ID

##### **SLACK_WEBHOOK_URL** - Team Notifications (Optional)
1. **Create Slack App**
   - Go to https://api.slack.com/apps
   - Click **"Create New App"** → **"From scratch"**
   - Name it "Streamline Suite Bot" and select your workspace

2. **Enable Incoming Webhooks**
   - In your app settings, go to **"Incoming Webhooks"**
   - Turn on **"Activate Incoming Webhooks"**
   - Click **"Add New Webhook to Workspace"**
   - Choose the channel for notifications (e.g., #deployments)
   - Copy the webhook URL

3. **Add to GitHub Secrets**
   - **Secret Name**: `SLACK_WEBHOOK_URL`
   - **Secret Value**: Your webhook URL (starts with `https://hooks.slack.com/`)

##### **Optional Secrets** (Can be skipped initially)
- **NETLIFY_AUTH_TOKEN**: Only if using Netlify instead of Vercel
- **AWS_*** secrets**: Only if deploying to AWS
- **EMAIL_*** secrets**: Only if you want email notifications
- **MONITORING_URL**: Add your monitoring dashboard URL when you set one up
```

#### Environment Configuration
Create these environment files:

**.env.example**
```bash
# Application
NEXT_PUBLIC_APP_NAME=Streamline Suite
NEXT_PUBLIC_APP_VERSION=1.0.0

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.streamlinesuite.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.streamlinesuite.com

# Authentication
NEXT_PUBLIC_AUTH_PROVIDER=auth0
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=false
NEXT_PUBLIC_DEBUG_MODE=false
```

### 2. **Install Required Dependencies**

```bash
# Install all CI/CD related dependencies
npm install --save-dev \
  @lhci/cli \
  @next/bundle-analyzer \
  @playwright/test \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  @types/jest \
  cross-env \
  husky \
  jest \
  jest-environment-jsdom \
  lint-staged \
  next-sitemap \
  prettier \
  rimraf

# Install Playwright browsers
npx playwright install
```

### 3. **Configure Git Hooks**

```bash
# Initialize Husky
npx husky-init
npm run prepare

# Add pre-commit hook
echo 'npx lint-staged' > .husky/pre-commit

# Add pre-push hook  
echo 'npm run type-check && npm run test:ci' > .husky/pre-push
```

## 📊 Workflow Breakdown

### 🔍 **CI Workflow** (`.github/workflows/ci.yml`)

**Triggered on**: Pull requests, pushes to main/develop

**Jobs Include**:
- **Lint & Format**: ESLint, Prettier, TypeScript checks
- **Build**: Application build verification
- **Test**: Unit tests across Node.js versions (18, 20)
- **Security**: npm audit, Snyk security scanning
- **Accessibility**: Automated a11y testing
- **Performance**: Lighthouse CI for performance metrics
- **Bundle Analysis**: Bundle size monitoring

**Key Features**:
- **Parallel Execution**: Jobs run concurrently for faster feedback
- **Matrix Testing**: Tests across multiple Node.js versions
- **Skip Logic**: Avoids duplicate runs for same content
- **Artifact Storage**: Preserves build outputs and reports
- **Dependabot Integration**: Auto-merge for dependency updates

### 🚀 **Deploy Workflow** (`.github/workflows/deploy.yml`)

**Triggered on**: Pushes to main, tags, manual dispatch

**Deployment Stages**:
1. **Pre-deployment**: Version calculation, environment determination
2. **Build Production**: Optimized production build
3. **Test Production**: Production-ready testing suite
4. **Deploy**: Multi-platform deployment (Vercel, Netlify, AWS)
5. **Post-deploy**: Smoke tests, live site validation
6. **Release**: GitHub release creation with changelog
7. **Notify**: Team notifications via Slack/Email

**Deployment Targets**:
- **Vercel**: Primary deployment platform
- **Netlify**: Alternative deployment option  
- **AWS S3 + CloudFront**: Custom infrastructure option

### 🔄 **Dependency Updates** (`.github/workflows/dependency-updates.yml`)

**Triggered on**: Weekly schedule (Mondays 9 AM UTC), manual dispatch

**Features**:
- **Automated Updates**: Minor and patch version updates
- **Security Auditing**: Vulnerability scanning and reporting
- **Pull Request Creation**: Automated PRs with update summaries
- **Test Validation**: Ensures updates don't break functionality
- **Security Alerts**: Creates issues for security vulnerabilities

## 🧪 Testing Strategy

### **Test Types Implemented**:

#### 1. **Unit Tests** (`npm run test:ci`)
- Component testing with React Testing Library
- Redux store testing
- Utility function testing
- 70% coverage threshold requirement

#### 2. **Integration Tests** (`npm run test:integration`)
- Component interaction testing
- API integration testing
- State management integration

#### 3. **End-to-End Tests** (`npm run test:e2e`)
- Full user journey testing
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness testing

#### 4. **Accessibility Tests** (`npm run test:a11y`)
- WCAG 2.1 AA compliance testing
- Screen reader compatibility
- Keyboard navigation testing

#### 5. **Performance Tests**
- Lighthouse CI for Core Web Vitals
- Bundle size analysis
- Runtime performance monitoring

#### 6. **Security Tests**
- Dependency vulnerability scanning
- OWASP security checks
- Code security analysis with Snyk

### **Test Configuration Files**:

#### **jest.config.js**
```javascript
// Comprehensive Jest configuration with:
// - Next.js integration
// - TypeScript support  
// - Module path mapping
// - Coverage thresholds
// - Custom test environment setup
```

#### **playwright.config.ts**  
```typescript
// Playwright E2E testing configuration with:
// - Multi-browser testing
// - Mobile device simulation
// - Screenshot/video capture on failure
// - Parallel test execution
```

## 📈 Quality Gates

### **Pull Request Requirements**:
- [ ] All lint checks pass
- [ ] TypeScript compilation succeeds  
- [ ] Unit test coverage ≥ 70%
- [ ] Build completes successfully
- [ ] No security vulnerabilities
- [ ] Accessibility tests pass

### **Deployment Requirements**:
- [ ] All CI checks pass
- [ ] Production build succeeds
- [ ] E2E tests pass
- [ ] Performance benchmarks met
- [ ] Security audit clean

## 🔧 Configuration Files

### **Package.json Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "type-check": "tsc --noEmit",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "lighthouse:ci": "lhci autorun",
    "analyze": "cross-env ANALYZE=true next build"
  }
}
```

### **Lighthouse CI** (`.lighthouserc.js`)
```javascript
// Performance benchmarks:
// - Performance: ≥ 80%
// - Accessibility: ≥ 90% 
// - Best Practices: ≥ 85%
// - SEO: ≥ 80%
```

### **Prettier Configuration** (`.prettierrc.json`)
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## 🚀 Deployment Strategies

### **Environment Strategy**:
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Development │    │   Staging   │    │ Production  │
│             │    │             │    │             │
│ • Feature   │───▶│ • Integration│───▶│ • Live Site │
│   branches  │    │   testing   │    │             │
│ • Local dev │    │ • QA review │    │ • User      │
│             │    │             │    │   traffic   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **Deployment Triggers**:
- **Staging**: Push to `develop` branch
- **Production**: Push to `main` branch or tagged release
- **Manual**: Workflow dispatch for emergency deployments

### **Rollback Strategy**:
- **Vercel**: Instant rollback to previous deployment
- **Git-based**: Revert commit and redeploy  
- **Feature Flags**: Disable features without redeployment

## 📊 Monitoring & Observability

### **Metrics Tracked**:
- **Build Performance**: Build time, bundle size
- **Test Results**: Coverage percentages, test duration
- **Deployment Success**: Success rate, deployment time
- **Performance**: Core Web Vitals, Lighthouse scores
- **Security**: Vulnerability count, audit results

### **Alerts & Notifications**:
- **Slack Integration**: Real-time deployment notifications
- **Email Alerts**: Critical failure notifications  
- **GitHub Issues**: Automated security vulnerability issues
- **Status Dashboards**: Deployment and performance monitoring

## 🔒 Security Implementation

### **Security Scanning**:
- **Dependency Auditing**: Weekly automated scans
- **Code Analysis**: Snyk integration for vulnerability detection
- **Secret Detection**: GitHub Advanced Security (if available)
- **License Compliance**: Dependency license checking

### **Security Policies**:
- **Vulnerability Response**: High/Critical issues block deployment
- **Dependency Updates**: Automated updates for security patches
- **Access Control**: Least privilege for deployment secrets
- **Audit Logging**: All deployment actions logged

## 🛠️ Troubleshooting

### **Common Issues & Solutions**:

#### **Build Failures**:
```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version  # Should be 18.x or 20.x
```

#### **Test Failures**:
```bash
# Run tests locally with verbose output
npm run test -- --verbose

# Check test coverage
npm run test:ci

# Debug specific test
npm run test -- --testNamePattern="ComponentName"
```

#### **Deployment Issues**:
```bash
# Verify environment variables
echo $VERCEL_TOKEN
echo $VERCEL_PROJECT_ID

# Test local production build
npm run build
npm run start
```

#### **Performance Issues**:
```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse locally
npm install -g @lhci/cli
lhci autorun
```

### **Debug Commands**:
```bash
# Check workflow status
gh workflow list
gh run list --workflow=ci.yml

# View workflow logs
gh run view [RUN_ID] --log

# Restart failed workflow
gh run rerun [RUN_ID]
```

## 📚 Best Practices

### **Development Workflow**:
1. **Feature Branches**: Always work in feature branches
2. **Small PRs**: Keep pull requests focused and small
3. **Test Coverage**: Maintain high test coverage
4. **Code Reviews**: Require reviews before merging
5. **Conventional Commits**: Use semantic commit messages

### **Deployment Practices**:
1. **Gradual Rollouts**: Use feature flags for new features
2. **Health Checks**: Monitor post-deployment metrics
3. **Rollback Plans**: Always have rollback procedures ready
4. **Documentation**: Keep deployment docs updated
5. **Team Communication**: Notify team of deployments

### **Security Practices**:
1. **Secret Management**: Use GitHub Secrets, never commit secrets
2. **Dependency Updates**: Keep dependencies up to date
3. **Audit Regular**: Regular security audits and reviews
4. **Access Control**: Limit who can deploy to production
5. **Incident Response**: Have security incident procedures

## 🎯 Performance Optimization

### **CI/CD Performance Tips**:
- **Caching**: Use dependency caching for faster builds
- **Parallel Jobs**: Run independent jobs in parallel  
- **Skip Logic**: Avoid unnecessary runs for unchanged code
- **Artifact Reuse**: Share build artifacts between jobs
- **Resource Limits**: Optimize resource usage in workflows

### **Build Optimization**:
```javascript
// next.config.js optimizations
module.exports = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analyzer
  webpack: (config) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(new BundleAnalyzerPlugin())
    }
    return config
  }
}
```

## 📋 Checklist for New Projects

### **Initial Setup**:
- [ ] Add all required GitHub secrets
- [ ] Configure environment variables
- [ ] Set up deployment platforms (Vercel/Netlify)
- [ ] Install and configure dependencies
- [ ] Set up Git hooks with Husky
- [ ] Configure branch protection rules

### **Testing Setup**:
- [ ] Configure Jest and testing environment
- [ ] Set up Playwright for E2E tests
- [ ] Configure Lighthouse CI
- [ ] Set coverage thresholds
- [ ] Add accessibility testing

### **Security Setup**:
- [ ] Enable Dependabot
- [ ] Configure Snyk scanning
- [ ] Set up security issue templates
- [ ] Configure security notifications
- [ ] Enable secret scanning (if available)

### **Monitoring Setup**:
- [ ] Set up Slack/email notifications
- [ ] Configure deployment dashboards
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure performance monitoring
- [ ] Set up health check endpoints

---

This CI/CD implementation provides a robust, secure, and efficient pipeline that ensures high-quality deployments while maintaining developer productivity. The automated workflows reduce manual effort and human error while providing comprehensive testing and security scanning.

For questions or issues with the CI/CD pipeline, refer to the troubleshooting section or create an issue using our GitHub issue templates. 🚀