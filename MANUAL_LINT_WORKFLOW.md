# Manual Lint and Commit Workflow 🔧

Since husky hooks are causing Windows compatibility issues, here's a simple
manual workflow:

## ✅ Pre-Commit Checklist

Before making any commit, run this command:

```bash
npm run pre-commit-check
```

This will:

1. **Lint code**: Fix ESLint issues automatically
2. **Type check**: Ensure TypeScript compiles without errors
3. **Format code**: Apply Prettier formatting

## 🚀 Individual Commands

You can also run these individually:

```bash
# Fix linting issues
npm run lint

# Check types
npm run type-check

# Format code
npm run format

# Check format without fixing
npm run format:check

# Lint without fixing
npm run lint:check
```

## 📝 Commit Message Format

Use conventional commits format:

```bash
# Good examples:
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login validation"
git commit -m "docs: update API documentation"

# Or use commitizen for guided commits:
npm run commit
```

## 🔄 Recommended Workflow

1. **Make your changes**
2. **Run pre-commit check**: `npm run pre-commit-check`
3. **Fix any issues** that are reported
4. **Stage your files**: `git add .`
5. **Commit with proper message**: `git commit -m "feat: your feature"`

## ⚠️ Why No Auto-Hooks?

Husky git hooks have compatibility issues on Windows with shell script
execution. This manual approach ensures:

- ✅ Works reliably on Windows
- ✅ No mysterious `/usr/bin/env` errors
- ✅ Clear control over when checks run
- ✅ Same code quality without automation complexity

## 🛠️ Future Setup

Once the Windows shell issues are resolved, we can re-enable automated hooks.
For now, this manual workflow ensures consistent code quality.
