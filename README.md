# Streamline Suite 🚀

A comprehensive business management platform built with modern web technologies. Streamline Suite provides an all-in-one solution for managing quotations, invoices, inventory, expenses, analytics, staff, payroll, and taxes.

## ✨ Features

### Core Business Modules
- **📊 Dashboard** - Real-time business metrics and analytics overview
- **📝 Quotations** - Create and manage customer quotations
- **🧾 Invoices** - Generate and track invoices
- **📦 Inventory** - Comprehensive inventory management system
- **💰 Expenses** - Track and categorize business expenses
- **📈 Analytics** - Business intelligence and reporting
- **👥 Staff Management** - Employee management and profiles
- **💵 Payroll** - Automated payroll processing
- **🧾 Tax Management** - Tax calculations and compliance
- **⚙️ Admin Panel** - System administration tools
- **🔧 Settings** - Application configuration

### Technical Features
- **🎨 Dark/Light Theme** - Seamless theme switching with system preference detection
- **📱 Responsive Design** - Mobile-first approach with collapsible sidebar
- **🔐 Authentication** - Secure login and signup system
- **🗂️ State Management** - Redux Toolkit for efficient state management
- **🎯 Modern UI** - Clean, intuitive interface with Tailwind CSS
- **⚡ Performance** - Built with Next.js 16 and React 19 for optimal performance

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### State Management
- **Redux Toolkit** - Modern Redux for predictable state management
- **React Redux** - Official React bindings for Redux

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization
- **Heroicons** - Beautiful SVG icons
- **Recharts** - Composable charting library

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Hot Reload** - Fast development with instant updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd streamline-suite-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
streamline-suite-fe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── (public)/          # Public pages (landing, about, etc.)
│   │   ├── globals.css        # Global styles and CSS variables
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Sidebar.tsx        # Collapsible sidebar navigation
│   │   ├── Icons.tsx          # SVG icon components
│   │   └── ...               # Other business modules
│   ├── contexts/             # React Context providers
│   │   ├── CompanyContext.tsx # Company data context
│   │   └── ThemeContext.tsx   # Theme management context
│   ├── layouts/              # Layout components
│   │   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   │   └── PublicWebsiteLayout.tsx # Public pages layout
│   ├── providers/            # Redux and theme providers
│   │   ├── ReduxProvider.tsx  # Redux store provider
│   │   └── ThemeProvider.tsx  # Theme management provider
│   ├── store/                # Redux store configuration
│   │   ├── index.ts          # Store setup and configuration
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   └── slices/           # Redux slices
│   │       ├── authSlice.ts  # Authentication state
│   │       ├── uiSlice.ts    # UI state (theme, sidebar, etc.)
│   │       └── companySlice.ts # Company data state
│   └── types.ts              # TypeScript type definitions
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── next.config.mjs           # Next.js configuration
├── eslint.config.mjs         # ESLint configuration
├── jsconfig.json             # JavaScript/TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## 🎨 Theme System

The application features a sophisticated theme system with:

- **Light Theme** - Clean, professional light interface
- **Dark Theme** - Modern dark interface for low-light environments
- **System Theme** - Automatically adapts to user's system preference
- **CSS Variables** - Seamless theme switching without page reload
- **Persistent Storage** - Theme preference saved in localStorage

### Theme Configuration
Themes are managed through Redux state and applied via CSS variables defined in `globals.css`. The system supports:
- Custom color palettes for each theme
- Smooth transitions between themes
- System preference detection and synchronization

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Code Style Guidelines

- **TypeScript First** - All new code should be written in TypeScript
- **Component Structure** - Use functional components with hooks
- **State Management** - Use Redux Toolkit for complex state, local state for simple UI state
- **Styling** - Use Tailwind CSS classes, avoid custom CSS when possible
- **File Naming** - PascalCase for components, camelCase for utilities

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy on Vercel

The easiest deployment method is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Deployment Options

- **Netlify** - Connect your Git repository for automatic deployments
- **AWS Amplify** - Deploy with AWS's hosting service
- **Docker** - Containerize the application for any cloud provider
- **Static Export** - Generate static files for traditional web hosting

## 📊 Business Modules

### Dashboard
- Real-time business metrics and KPIs
- Sales analytics with interactive charts
- Recent activity feed
- Low stock alerts and notifications
- Quick access to all business functions

### Quotation Management
- Professional quotation templates
- Customer management integration
- Automatic quotation numbering
- PDF generation and email delivery
- Quotation tracking and follow-up

### Invoice System
- Convert quotations to invoices seamlessly
- Multiple payment method support
- Automated payment reminders
- Tax calculations and compliance
- Revenue tracking and reporting

### Inventory Control
- Real-time stock tracking
- Low stock alerts and reorder points
- Product categorization and search
- Supplier management
- Inventory valuation reports

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔮 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] API integrations (accounting software, payment gateways)
- [ ] Multi-tenant architecture
- [ ] Advanced user permissions and roles
- [ ] Real-time collaboration features

---

Built with ❤️ using Next.js, React, and TypeScript
