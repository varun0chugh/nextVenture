NexusVenture - E-Learning Platform
Project Overview

NexusVenture is a full-featured e-learning platform that enables instructors to create and manage courses while allowing students to enroll and access educational content. The platform is built with modern web technologies and follows best practices for security, state management, and user experience.

Technical Stack

Frontend
React with TypeScript for type safety
Vite as the build tool and development server
TailwindCSS for styling
Lucide React for icons
React Router for navigation
Zustand for state management

Backend
Supabase for:
Authentication
Database
Row Level Security (RLS)
Real-time updates
Core Features
1. Authentication System
Email/password authentication
User registration and login
Protected routes
Session management
Automatic profile creation for new users

3. Role-Based Access Control
Three user roles:
Admin: Full system access
Instructor: Course management capabilities
Student: Course enrollment and consumption

5. Course Management
Course creation and editing
Course listing and details
Course enrollment
Content management
Pricing management

7. Dashboard
Role-specific views
Course overview
User management
Progress tracking

Component Structure

Pages

Home: Landing page with platform overview
Login/Signup: Authentication pages
Dashboard: Main user interface
Products: Course catalog
Payment: Course purchase flow

Components

Navbar: Navigation and user status
Course Card: Course display component
Loading States: Consistent loading indicators
Error Handling: Standardized error displays

Getting Started

Clone the repository
Install dependencies: npm install
Set up Supabase environment variables
Run migrations
Start development server: npm run dev
