# Finance Manager

## Overview

Finance Manager is a full-stack web application for personal financial management. Built with modern technologies, it provides users with tools to track transactions, manage budgets, categorize expenses, and analyze spending patterns through interactive dashboards and reports. The application features a clean, responsive interface with comprehensive financial analytics and visualization capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Chart.js for financial data visualization and analytics
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for end-to-end type safety
- **Architecture Pattern**: RESTful API with organized route handlers and controllers
- **Validation**: Zod schemas for request validation and type inference
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Custom request logging with response time tracking

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Connection**: Neon serverless PostgreSQL for cloud database hosting
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Authentication & Security
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Input Validation**: Comprehensive request validation using Zod schemas
- **CORS**: Configured for cross-origin resource sharing

### Development Environment
- **Hot Reload**: Vite HMR for instant frontend updates
- **Development Server**: Express middleware integration with Vite
- **TypeScript**: Strict type checking across frontend, backend, and shared code
- **Path Aliases**: Configured module resolution for clean imports

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: TypeScript-first ORM with migrations

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Data Fetching & Validation
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation and type inference

### Charts & Analytics
- **Chart.js**: Canvas-based charting library for financial visualizations

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **React Hook Form**: Form state management
- **Wouter**: Lightweight routing solution

### Deployment & Hosting
- **Replit**: Development and hosting platform
- **Vite Build**: Production optimization and bundling