# Event Guardian - Real-Time Tracking System

## Overview

Event Guardian is a comprehensive real-time tracking system designed for large-scale events like Kumbh Mela. The application provides live monitoring, emergency response capabilities, and location tracking for attendees using wearable devices. Built with a modern full-stack architecture, it features a React frontend with shadcn/ui components, Express.js backend, and PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful API with JSON responses

### Database Schema
The application uses three main tables:
1. **trackers**: Stores device information, status, location, and battery data
2. **emergency_contacts**: Manages emergency response contacts by type
3. **locations**: Tracks location history for each device

## Key Components

### Data Models
- **Tracker**: Core entity representing a tracking device with real-time status
- **Emergency Contact**: Contact information for emergency, security, and medical personnel
- **Location**: Historical location data for tracking movement patterns

### Frontend Components
- **Dashboard**: Main interface showing real-time tracking overview
- **MapView**: Interactive map component for visualizing tracker locations
- **TrackingPanel**: Control panel for managing trackers and emergency contacts
- **StatsOverview**: Real-time statistics and system health indicators
- **TrackingTable**: Detailed tabular view of all active trackers

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Route Handlers**: RESTful endpoints for tracker and emergency contact management
- **Real-time Updates**: Periodic data refresh for live tracking capabilities

## Data Flow

1. **Device Registration**: Trackers are registered with unique IDs and assigned to groups
2. **Location Updates**: Devices continuously send location and status updates
3. **Real-time Monitoring**: Frontend polls backend every 5 seconds for live updates
4. **Emergency Response**: Alert system triggers notifications to emergency contacts
5. **Status Management**: Automatic status updates based on device behavior and location

## External Dependencies

### Production Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-zod for type-safe database operations
- **UI Framework**: Complete shadcn/ui component suite with Radix UI primitives
- **State Management**: @tanstack/react-query for server state synchronization
- **Validation**: zod for runtime type checking and validation
- **Date Handling**: date-fns for date manipulation and formatting

### Development Dependencies
- **Build Tools**: Vite with React plugin and TypeScript support
- **Runtime**: tsx for TypeScript execution in development
- **Database Tools**: drizzle-kit for schema management and migrations
- **Replit Integration**: Custom plugins for Replit environment compatibility

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL for database connectivity
- **Asset Handling**: Static file serving with development middleware

### Production Build
- **Frontend**: Vite build with optimized bundling and code splitting
- **Backend**: esbuild compilation to ESM format with external package handling
- **Database**: Drizzle push for schema deployment
- **Deployment**: Single-command deployment with integrated build process

### Architecture Decisions

1. **Drizzle ORM Choice**: Selected for type safety, performance, and PostgreSQL compatibility
2. **In-Memory Storage Fallback**: Implemented for development and testing without database dependency
3. **Real-time Polling**: Chosen over WebSockets for simplicity and reliability in event environments
4. **Monorepo Structure**: Shared schema between frontend and backend for type consistency
5. **shadcn/ui Integration**: Provides consistent, accessible UI components with customization flexibility

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```