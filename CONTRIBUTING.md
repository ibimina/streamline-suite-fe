# Contributing to Streamline Suite 🤝

Thank you for your interest in contributing to Streamline Suite! This guide will help you understand how to contribute effectively to our comprehensive business management platform.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
Help us improve by reporting bugs you encounter:
- Use GitHub Issues with the "bug" label
- Provide detailed reproduction steps
- Include screenshots or recordings when applicable
- Specify your environment (OS, browser, Node.js version)

### ✨ Feature Requests
Suggest new features or enhancements:
- Use GitHub Issues with the "enhancement" label
- Describe the problem the feature would solve
- Provide use cases and examples
- Consider the impact on existing functionality

### 📝 Code Contributions
Contribute code improvements, bug fixes, or new features:
- Follow our [Pull Request Guide](./PULL_REQUEST_GUIDE.md)
- Ensure code meets our quality standards
- Include appropriate tests and documentation
- Maintain backwards compatibility when possible

### 📚 Documentation
Help improve our documentation:
- Fix typos or unclear explanations
- Add examples and tutorials
- Improve API documentation
- Update installation or setup guides

### 🎨 Design & UX
Contribute to user experience improvements:
- UI/UX design suggestions
- Accessibility improvements
- Mobile responsiveness enhancements
- Theme and styling improvements

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- **Node.js 18.x or later** installed
- **Git** for version control
- A **GitHub account** for collaboration
- Basic knowledge of **React, TypeScript, and Next.js**
- Familiarity with **Redux Toolkit** for state management

### Development Environment Setup

1. **Fork and Clone the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/streamline-suite-fe.git
   cd streamline-suite-fe
   ```

2. **Add Upstream Remote**
   ```bash
   # Add the original repo as upstream
   git remote add upstream https://github.com/ORIGINAL_OWNER/streamline-suite-fe.git
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Ensure the application loads correctly
   - Test theme switching (light/dark mode)
   - Verify responsive design on different screen sizes

### Development Workflow

1. **Stay Updated**
   ```bash
   # Regularly sync with upstream
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create Feature Branch**
   ```bash
   # Create a new branch for your work
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write your code following our standards
   - Test your changes thoroughly
   - Ensure no regressions in existing functionality

4. **Commit Changes**
   ```bash
   # Stage and commit with conventional commit format
   git add .
   git commit -m "feat: add dark theme toggle animation"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR through GitHub UI
   ```

## 📋 Code Standards

### Code Style Guidelines

#### TypeScript & React
- **Use TypeScript** for all new code
- **Functional Components** with hooks (no class components)
- **Proper Type Definitions** - avoid `any` type
- **Component Props Interface** - define interfaces for all props
- **Custom Hooks** - extract reusable logic into custom hooks

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, variant = 'primary', children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
    >
      {children}
    </button>
  );
};

// ❌ Bad
const Button = ({ onClick, disabled, variant, children }: any) => {
  // Implementation
};
```

#### State Management
- **Redux Toolkit** for global state
- **Local State** for component-specific UI state
- **Proper Action Types** with TypeScript
- **Normalized State Structure** for complex data

```typescript
// ✅ Good - Redux Slice
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  loading: boolean;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
  },
});
```

#### Styling Guidelines
- **Tailwind CSS** for all styling
- **CSS Variables** for theme values
- **Responsive Design** mobile-first approach
- **Dark Mode** compatibility for all components

```tsx
// ✅ Good - Tailwind with dark mode
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
  <h2 className="text-gray-900 dark:text-white text-xl font-semibold">
    {title}
  </h2>
</div>

// ❌ Bad - Custom CSS or missing dark mode
<div className="custom-card-style">
  <h2 style={{ color: '#000' }}>{title}</h2>
</div>
```

### File Organization

#### Component Structure
```
src/components/
├── ComponentName/
│   ├── index.ts          # Export barrel
│   ├── ComponentName.tsx # Main component
│   ├── ComponentName.test.tsx # Tests
│   └── types.ts          # Component-specific types
```

#### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: camelCase (`userUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Interfaces**: PascalCase with descriptive names (`UserProfileProps`)

### Testing Requirements

#### Unit Tests
- Test component rendering and behavior
- Test Redux actions and reducers
- Test utility functions
- Use React Testing Library for component tests

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Button from './Button';

test('renders button with correct text', () => {
  render(
    <Provider store={store}>
      <Button onClick={() => {}}>Click me</Button>
    </Provider>
  );
  
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

#### Integration Tests
- Test component interactions
- Test Redux state changes
- Test navigation flows
- Test theme switching

### Accessibility Standards

#### Requirements
- **Keyboard Navigation** - All interactive elements accessible via keyboard
- **Screen Reader Support** - Proper ARIA labels and roles
- **Color Contrast** - Meet WCAG 2.1 AA standards
- **Focus Management** - Visible focus indicators

```tsx
// ✅ Good - Accessible component
<button
  onClick={handleClick}
  aria-label="Toggle dark mode"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <MoonIcon className="w-5 h-5" aria-hidden="true" />
</button>

// ❌ Bad - Missing accessibility features
<div onClick={handleClick}>
  <MoonIcon className="w-5 h-5" />
</div>
```

## 🏗️ Architecture Guidelines

### Component Architecture

#### Component Hierarchy
```
App Layout
├── Header (Navigation, User menu, Theme toggle)
├── Sidebar (Main navigation, Collapsible)
└── Main Content
    ├── Dashboard (Business metrics, Charts)
    ├── Business Modules (Quotes, Invoices, etc.)
    └── Settings (Configuration, Preferences)
```

#### State Management Pattern
- **UI State**: Theme, sidebar state, modals, loading states
- **Auth State**: User authentication, permissions, session
- **Business State**: Company data, transactions, inventory
- **Cache State**: API responses, temporary data

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;      // Authentication and user data
  ui: UIState;          // UI state and preferences
  company: CompanyState; // Business data and settings
  // Additional slices as needed
}
```

### API Integration
- Use **RTK Query** for API calls
- Implement proper **error handling**
- Add **loading states** for better UX
- Use **TypeScript interfaces** for API responses

## 🎨 Design System

### Color Palette
Our design system uses CSS variables that adapt to light/dark themes:

```css
/* Light Theme */
--background: #ffffff;
--foreground: #171717;
--primary: #3b82f6;
--secondary: #f1f5f9;
--border: #e2e8f0;

/* Dark Theme */
--background: #0a0a0a;
--foreground: #ededed;
--primary: #3b82f6;
--secondary: #1e293b;
--border: #374151;
```

### Typography Scale
```css
/* Headings */
.text-4xl  /* 36px - Main headings */
.text-3xl  /* 30px - Section headings */
.text-2xl  /* 24px - Subsection headings */
.text-xl   /* 20px - Component headings */
.text-lg   /* 18px - Large text */

/* Body text */
.text-base /* 16px - Default body text */
.text-sm   /* 14px - Small text */
.text-xs   /* 12px - Labels, captions */
```

### Spacing System
Follow Tailwind's spacing scale (4px base unit):
- `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px

## 🐛 Issue Guidelines

### Bug Reports
When reporting bugs, include:

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 11, macOS 13]
- Browser: [e.g., Chrome 118, Firefox 119]
- Node.js: [e.g., 18.17.0]
- App Version: [e.g., 1.2.3]

## Screenshots
Include screenshots or recordings if applicable
```

### Feature Requests
For new features, provide:

```markdown
## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Use Cases
Who would use this feature and how?

## Alternatives Considered
What other solutions did you consider?

## Implementation Notes
Any technical considerations or suggestions
```

## 📊 Business Module Guidelines

### Dashboard Components
- **Real-time Data**: Use proper data fetching and caching
- **Interactive Charts**: Implement with Recharts library
- **Responsive Design**: Ensure charts work on all screen sizes
- **Performance**: Optimize for large datasets

### Form Components
- **Validation**: Use proper form validation (consider react-hook-form)
- **Error Handling**: Clear error messages and states
- **Accessibility**: Proper labels and keyboard navigation
- **Auto-save**: Consider auto-saving for long forms

### Data Tables
- **Sorting**: Implement sortable columns
- **Filtering**: Add search and filter capabilities
- **Pagination**: Handle large datasets efficiently
- **Export**: Allow data export in common formats

## 🚀 Performance Guidelines

### Optimization Strategies
- **Code Splitting**: Use dynamic imports for large components
- **Lazy Loading**: Implement for non-critical components
- **Memoization**: Use React.memo and useMemo appropriately
- **Bundle Analysis**: Regularly analyze bundle size

```typescript
// ✅ Good - Code splitting
const DashboardAnalytics = lazy(() => import('./DashboardAnalytics'));

// ✅ Good - Memoization
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  return <div>{/* component content */}</div>;
});
```

### Bundle Size
- Keep bundle size under reasonable limits
- Use tree shaking for unused code
- Optimize images and assets
- Consider CDN for static assets

## 🔒 Security Guidelines

### Best Practices
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize user-generated content
- **Authentication**: Secure token handling and storage
- **API Security**: Proper error handling without exposing sensitive data

```typescript
// ✅ Good - Secure token handling
const token = localStorage.getItem('authToken');
if (token && !isTokenExpired(token)) {
  // Use token for authenticated requests
}

// ❌ Bad - Exposing sensitive data
console.log('User data:', userData); // Don't log sensitive data
```

## 📚 Documentation Standards

### Code Documentation
- **JSDoc Comments**: For complex functions and classes
- **README Updates**: Keep documentation current
- **API Documentation**: Document all public APIs
- **Examples**: Provide usage examples

```typescript
/**
 * Calculates the total amount including tax for an invoice
 * @param subtotal - The subtotal amount before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @param discountAmount - Optional discount amount to subtract
 * @returns The total amount including tax and after discount
 */
function calculateTotal(
  subtotal: number, 
  taxRate: number, 
  discountAmount: number = 0
): number {
  const discountedAmount = subtotal - discountAmount;
  return discountedAmount + (discountedAmount * taxRate);
}
```

## 🎉 Recognition

### Contributor Recognition
We value all contributions and recognize contributors through:
- **GitHub Contributors** page
- **Release Notes** acknowledgments
- **Community Mentions** in discussions
- **Special Recognition** for significant contributions

### Hall of Fame
Outstanding contributors may be featured in:
- Project README
- Documentation credits
- Community showcases
- Conference presentations

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Pull Request Comments**: For code-specific discussions
- **Email**: For sensitive or private matters

### Mentorship
New contributors can get help through:
- **Good First Issues**: Labeled beginner-friendly issues
- **Pair Programming**: Sessions with experienced contributors
- **Code Reviews**: Learning through feedback
- **Documentation**: Comprehensive guides and examples

## 🏆 Best Practices Summary

### Do's ✅
- **Follow Standards**: Adhere to code style and conventions
- **Test Thoroughly**: Ensure your changes work correctly
- **Document Changes**: Update relevant documentation
- **Communicate Clearly**: Use descriptive commit messages and PR descriptions
- **Be Patient**: Allow time for reviews and feedback
- **Stay Updated**: Keep your fork synchronized with upstream
- **Ask Questions**: Don't hesitate to seek clarification

### Don'ts ❌
- **Break Existing Functionality**: Ensure backwards compatibility
- **Ignore Code Style**: Follow established patterns
- **Skip Testing**: Always test your changes
- **Make Large PRs**: Keep changes focused and manageable
- **Ignore Feedback**: Address review comments promptly
- **Commit Directly**: Always use feature branches
- **Leave Debug Code**: Remove console.logs and debugging code

## 🎯 Contribution Ideas

### Good First Issues
- Fix typos in documentation
- Add missing TypeScript types
- Improve error messages
- Add unit tests for existing components
- Enhance accessibility features

### Intermediate Contributions
- Implement new business features
- Optimize component performance
- Add integration tests
- Improve responsive design
- Enhance theme system

### Advanced Contributions
- Architecture improvements
- New module development
- Performance optimizations
- Security enhancements
- Advanced testing strategies

## 📋 Checklist for New Contributors

Before making your first contribution:

- [ ] Read this contributing guide thoroughly
- [ ] Review the [Pull Request Guide](./PULL_REQUEST_GUIDE.md)
- [ ] Set up your development environment
- [ ] Explore the codebase and understand the architecture
- [ ] Look for "good first issue" labels
- [ ] Join community discussions
- [ ] Introduce yourself in discussions

---

Thank you for contributing to Streamline Suite! Your efforts help create a better business management platform for everyone. Together, we're building something amazing! 🚀

## 📄 License

By contributing to Streamline Suite, you agree that your contributions will be licensed under the same license as the project (MIT License).