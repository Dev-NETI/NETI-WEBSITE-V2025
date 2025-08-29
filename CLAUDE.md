# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing
No testing framework is currently configured.

## Project Architecture

This is a **Next.js 15** application using the **App Router** with **TypeScript** and **Tailwind CSS v4**. The project is a maritime training company website for NETI (NYK-Fil Maritime E-Training Inc).

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Animation**: Framer Motion for page transitions and interactions
- **3D Graphics**: Three.js for interactive elements
- **Icons**: Lucide React

### File Structure
```
src/
├── app/                    # App Router pages and layouts
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout with global components
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── AnimatedTitle.tsx
│   ├── CookieConsent.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx     # Main navigation with mega menu
│   ├── PageTransition.tsx
│   ├── ParticlesBackground.tsx
│   └── VideoHeaderSection.tsx
public/
├── assets/
│   └── images/           # Static images and videos
```

### Key Components

#### Navigation System
- **Desktop**: Horizontal mega menu with dropdowns
- **Mobile**: Full-screen overlay menu
- **Features**: Scroll progress indicator, backdrop blur effects
- **State Management**: Uses React hooks for menu state and active sections

#### Page Transitions
- Uses Framer Motion for smooth page transitions
- Global layout includes PageTransition wrapper
- Consistent animation patterns across components

#### Styling Patterns
- Uses Tailwind CSS utility classes
- Gradient backgrounds and modern design system
- Professional blue/slate color scheme
- Responsive design with mobile-first approach

### Content Management
- Static content embedded in components
- Video assets stored in `/public/assets/images/`
- Logo and brand assets in SVG format
- Professional maritime industry imagery

### Performance Considerations
- Next.js Image optimization for all images
- Framer Motion animations with proper performance settings
- Client-side hydration patterns for interactive components
- Lazy loading implemented where appropriate

## Development Guidelines

### Component Patterns
- All components use TypeScript with proper typing
- Client components marked with "use client" directive
- Consistent use of Framer Motion for animations
- Tailwind CSS for styling with professional design system

### State Management
- Local component state using React hooks
- No global state management library (Redux, Zustand) currently used
- Navigation state handled in Navigation component

### Animation Philosophy
- Smooth, professional animations using Framer Motion
- Scroll-based parallax effects for engagement
- Consistent timing and easing across components
- Performance-optimized with proper will-change properties

### Code Style
- ESLint configured with Next.js and TypeScript rules
- Consistent component structure and naming
- Professional commenting where complex logic exists
- Proper TypeScript interfaces for component props