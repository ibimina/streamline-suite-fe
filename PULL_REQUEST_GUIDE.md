# Pull Request Guide 🔄

This guide outlines the process and standards for contributing to Streamline Suite through Pull Requests.

## 📋 Before You Start

### Prerequisites
- [ ] Fork the repository to your GitHub account
- [ ] Clone your fork locally
- [ ] Set up the development environment (see [README.md](./README.md))
- [ ] Create a new branch for your feature/fix
- [ ] Ensure you have the latest changes from the main branch

### Branch Naming Convention
Use descriptive branch names that follow this pattern:
```
<type>/<short-description>
```

**Types:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `hotfix/` - Critical fixes that need immediate attention
- `refactor/` - Code refactoring without functional changes
- `docs/` - Documentation updates
- `style/` - Code style/formatting changes
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks, dependency updates

**Examples:**
```bash
feature/dark-theme-implementation
fix/sidebar-navigation-bug
refactor/redux-store-structure
docs/api-documentation-update
hotfix/login-authentication-issue
```

## 🚀 Creating a Pull Request

### Step 1: Prepare Your Branch
```bash
# Create and checkout a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Stage and commit your changes
git add .
git commit -m "feat: implement dark theme toggle functionality"

# Push to your fork
git push origin feature/your-feature-name
```

### Step 2: Commit Message Standards
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Changes that don't affect code meaning (formatting, etc.)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvements
- `test` - Adding missing tests or correcting existing tests
- `chore` - Changes to build process or auxiliary tools

**Examples:**
```bash
feat(auth): add OAuth2 login integration
fix(sidebar): resolve navigation link routing issues
docs(readme): update installation instructions
refactor(store): migrate from Context API to Redux Toolkit
style(components): apply consistent formatting across components
```

### Step 3: Pre-PR Checklist
Before creating your PR, ensure:

- [ ] **Code Quality**
  - [ ] Code follows project style guidelines
  - [ ] No ESLint errors or warnings
  - [ ] TypeScript types are properly defined
  - [ ] No console.log statements in production code

- [ ] **Functionality**
  - [ ] Feature works as expected
  - [ ] No breaking changes (or properly documented)
  - [ ] Responsive design is maintained
  - [ ] Dark/light theme compatibility verified

- [ ] **Testing**
  - [ ] Manual testing completed
  - [ ] All existing functionality still works
  - [ ] Cross-browser compatibility checked (Chrome, Firefox, Safari, Edge)

- [ ] **Documentation**
  - [ ] Code is properly commented
  - [ ] README updated if needed
  - [ ] New features documented

### Step 4: Create the Pull Request
1. Navigate to the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch as the source
4. Fill out the PR template (see below)
5. Request reviews from appropriate team members

## 📝 Pull Request Template

Use this template when creating your PR:

```markdown
## 🎯 Description
Brief description of what this PR does and why.

## 🔄 Type of Change
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/formatting changes
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test updates

## 📋 Changes Made
- Change 1: Description of specific change
- Change 2: Description of specific change
- Change 3: Description of specific change

## 🧪 Testing Done
- [ ] Tested locally in development environment
- [ ] Tested in both light and dark themes
- [ ] Tested responsive design on mobile/tablet/desktop
- [ ] Verified no breaking changes to existing features
- [ ] Cross-browser testing completed

## 📷 Screenshots (if applicable)
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## 🔗 Related Issues
- Closes #123
- Relates to #456
- Fixes #789

## 📝 Additional Notes
Any additional information, considerations, or context for reviewers.

## ✅ Reviewer Checklist
- [ ] Code follows project conventions
- [ ] Changes are well-documented
- [ ] No unnecessary code changes
- [ ] Performance impact considered
- [ ] Security implications reviewed
```

## 👥 Review Process

### For Contributors
1. **Self-Review**: Review your own PR first
2. **Request Reviews**: Tag appropriate reviewers
3. **Respond to Feedback**: Address all review comments promptly
4. **Update Documentation**: Keep PR description updated with changes

### For Reviewers
1. **Timely Reviews**: Aim to review within 24-48 hours
2. **Constructive Feedback**: Provide clear, actionable feedback
3. **Test Locally**: Pull and test significant changes
4. **Approve When Ready**: Only approve when confident in the changes

### Review Criteria
Reviewers should check for:

- [ ] **Code Quality**
  - Clean, readable code
  - Proper error handling
  - Performance considerations
  - Security best practices

- [ ] **Functionality**
  - Feature works as described
  - No regression in existing features
  - Edge cases handled properly

- [ ] **Design & UX**
  - Consistent with design system
  - Responsive across devices
  - Accessibility considerations
  - Theme compatibility

- [ ] **Architecture**
  - Follows project patterns
  - Proper separation of concerns
  - Maintainable code structure

## 🔄 PR Lifecycle

### Draft PRs
- Use draft PRs for work in progress
- Good for getting early feedback
- Mark as ready for review when complete

### Review States
- **Changes Requested**: Address feedback before re-requesting review
- **Approved**: PR is ready for merge
- **Merged**: Changes are now in the main branch

### Merge Requirements
Before merging, ensure:
- [ ] At least one approval from a code owner
- [ ] All CI checks pass
- [ ] No merge conflicts
- [ ] Branch is up to date with main

## 🚨 Common Issues & Solutions

### Merge Conflicts
```bash
# Update your branch with latest main
git checkout main
git pull upstream main
git checkout your-branch
git rebase main

# Resolve conflicts and continue
git add .
git rebase --continue
git push --force-with-lease origin your-branch
```

### Failed CI Checks
- **ESLint Errors**: Run `npm run lint` locally and fix issues
- **TypeScript Errors**: Run `npm run build` and address type issues
- **Test Failures**: Ensure all tests pass with `npm test`

### Large PRs
If your PR is getting large:
- Consider breaking it into smaller, focused PRs
- Use draft PRs to get feedback early
- Document the overall plan in the PR description

## 📊 PR Guidelines by Component

### Frontend Components
- Include screenshots for UI changes
- Test in both themes (light/dark)
- Verify responsive design
- Check accessibility (keyboard navigation, screen readers)

### State Management (Redux)
- Document state shape changes
- Ensure backwards compatibility
- Test state persistence
- Update related selectors/actions

### API Integration
- Document new endpoints
- Handle error cases
- Update TypeScript interfaces
- Test with mock data

### Styling Changes
- Follow Tailwind CSS conventions
- Maintain design system consistency
- Test across different screen sizes
- Verify theme compatibility

## 🏆 Best Practices

### Do's ✅
- Keep PRs focused and small when possible
- Write clear, descriptive commit messages
- Test thoroughly before requesting review
- Respond to feedback promptly and professionally
- Update documentation for new features
- Use semantic commit messages

### Don'ts ❌
- Don't mix unrelated changes in one PR
- Don't force push after someone has reviewed
- Don't ignore CI failures
- Don't merge without proper review
- Don't leave debug code or console.logs
- Don't submit PRs with merge conflicts

## 📞 Getting Help

If you need help with your PR:
- Ask questions in PR comments
- Reach out to maintainers
- Check existing issues and PRs for similar problems
- Refer to project documentation

## 🎉 After Your PR is Merged

1. **Clean Up**: Delete your feature branch
2. **Update Local**: Pull latest changes to your main branch
3. **Celebrate**: Your contribution is now part of Streamline Suite! 🎉

```bash
# Clean up after merge
git checkout main
git pull upstream main
git branch -d your-branch-name
git push origin --delete your-branch-name
```

---

Thank you for contributing to Streamline Suite! Your efforts help make this project better for everyone. 🚀