# Lint and Commit Rules 📋

This document outlines the linting and commit message rules for Streamline Suite
to ensure code quality and consistency.

## 🔍 Linting Rules

### ESLint Configuration

Our ESLint configuration enforces:

#### Code Quality

- `no-console`: Warn on console.log (except warn/error)
- `no-debugger`: Error on debugger statements
- `@typescript-eslint/no-unused-vars`: Error on unused variables
- `prefer-const`: Enforce const for variables that are never reassigned

#### React/Next.js Best Practices

- `react-hooks/exhaustive-deps`: Enforce exhaustive dependencies in React hooks
- `react/jsx-key`: Require keys in JSX lists
- `react/no-array-index-key`: Warn against using array index as key
- `react/jsx-pascal-case`: Enforce PascalCase for components

#### TypeScript Rules

- `@typescript-eslint/no-explicit-any`: Warn on usage of `any` type
- `@typescript-eslint/prefer-const`: Prefer const assertions
- `@typescript-eslint/no-var-requires`: Error on var requires

#### Import Organization

- Automatic import sorting by type and alphabetically
- No duplicate imports
- Proper grouping: builtin → external → internal → parent → sibling → index

#### Performance

- `react/jsx-no-bind`: Warn on function binding in JSX
- `react/jsx-no-leaked-render`: Prevent leaked renders

### Running Linting

```bash
# Check for linting issues
npm run lint:check

# Fix auto-fixable linting issues
npm run lint

# Type checking
npm run type-check

# Format code
npm run format

# Check formatting without fixing
npm run format:check
```

## 📝 Commit Message Rules

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Commit Rules

- **Header max length**: 72 characters
- **Subject case**: lowercase (no sentence-case, start-case, pascal-case, or
  upper-case)
- **Subject**: Cannot be empty
- **Subject**: Cannot end with a period

### Valid Commit Examples

```bash
feat: add user authentication system
fix: resolve dashboard loading issue
docs: update API documentation
style: format component files
refactor: optimize dashboard performance
test: add unit tests for user service
build: update webpack configuration
ci: add automated deployment workflow
chore: update dependencies
```

### Invalid Commit Examples

```bash
# ❌ Type missing
add user authentication

# ❌ Wrong case
Feat: Add user authentication

# ❌ Ends with period
feat: add user authentication.

# ❌ Too long
feat: add comprehensive user authentication system with social login and email verification

# ❌ Empty subject
feat:
```

## 🪝 Git Hooks

### Cross-Platform Compatibility

Our git hooks are implemented using Node.js scripts for cross-platform
compatibility (Windows, macOS, Linux).

### Pre-commit Hook

Runs automatically before each commit:

1. **Lint-staged**: Formats and lints only staged files
2. **Type checking**: Ensures TypeScript compilation
3. **Auto-fix**: Attempts to fix linting issues automatically

**Script**: `scripts/pre-commit.js`

### Commit-msg Hook

Validates commit messages:

1. **Format validation**: Ensures conventional commit format
2. **Length check**: Enforces 72 character limit
3. **Type validation**: Checks against allowed commit types

**Script**: `scripts/commit-msg.js`

### Pre-push Hook

Runs before pushing to remote:

1. **Final type check**: Ensures no TypeScript errors
2. **Test suite**: Runs full test suite with coverage
3. **Build verification**: Ensures project builds successfully

**Script**: `scripts/pre-push.js`

## 🚀 Using Commitizen

For interactive commit message creation:

```bash
# Install commitizen globally (optional)
npm install -g commitizen

# Create a commit using commitizen
npm run commit
# or if installed globally
git cz
```

This will guide you through creating a proper conventional commit.

## ⚙️ Configuration Files

### ESLint

- `eslint.config.mjs`: Main ESLint configuration
- Rules enforced on `*.ts`, `*.tsx`, `*.js`, `*.jsx` files

### Prettier

- `.prettierrc.json`: Code formatting rules
- Automatic formatting on save and pre-commit

### Commitlint

- Configuration in `package.json` under `commitlint` key
- Extends `@commitlint/config-conventional`

### Husky

- `.husky/pre-commit`: Calls Node.js script for pre-commit validation
- `.husky/commit-msg`: Calls Node.js script for commit message validation
- `.husky/pre-push`: Calls Node.js script for pre-push validation
- `scripts/`: Cross-platform Node.js hook scripts

### Lint-staged

- Configuration in `package.json` under `lint-staged` key
- Processes only staged files for performance

## 🔧 Bypassing Hooks (Emergency Only)

In rare cases where you need to bypass hooks:

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**⚠️ Warning**: Only use these in genuine emergencies. Bypassed commits should
be fixed immediately.

## 📊 Code Quality Metrics

Our linting setup ensures:

- **Zero ESLint warnings** in production builds
- **100% TypeScript compliance**
- **Consistent code formatting**
- **Conventional commit history**
- **Import organization**
- **React best practices**

## 🆘 Troubleshooting

### Common Issues

1. **ESLint errors on commit**

   ```bash
   npm run lint -- --fix
   ```

2. **TypeScript errors**

   ```bash
   npm run type-check
   ```

3. **Formatting issues**

   ```bash
   npm run format
   ```

4. **Commit message rejected**
   - Check format follows conventional commits
   - Ensure message is under 72 characters
   - Use lowercase for subject

5. **Husky hooks not working**
   ```bash
   npx husky install
   ```

### Getting Help

If you encounter persistent issues:

1. Check this documentation
2. Run `npm run lint:check` to see specific errors
3. Use `npm run commit` for guided commit creation
4. Ask for help in team discussions
