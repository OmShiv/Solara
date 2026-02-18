# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solara is a React Native mobile app for tracking celestial bodies (Sun, Moon, planets) using augmented reality and 3D visualization. It features AR sky overlays, interactive 3D maps, and timeline controls for viewing past/future celestial positions.

**Tech Stack:**
- Frontend: React Native 0.81 with Expo SDK 54
- Backend: Express.js 5 with TypeScript
- Database: PostgreSQL with Drizzle ORM (optional)
- Navigation: React Navigation 7 (native stack + bottom tabs)

## Development Commands

### Starting Development Servers

**Local development:**
```bash
# Start Express backend (port 5000)
npm run server:dev

# Start Expo dev server (port 8081)
npx expo start
```

**Replit environment:**
```bash
npm run expo:dev  # Uses REPLIT_DEV_DOMAIN environment variables
```

### Building and Testing

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking (no emit)
npm run check:types

# Format code with Prettier
npm run format

# Check formatting
npm run check:format
```

### Production and Deployment

```bash
# Build static Expo bundles for Expo Go
npm run expo:static:build

# Build Express server for production
npm run server:build

# Run production server
npm run server:prod
```

### Database

```bash
# Push Drizzle schema to database
npm run db:push
```

## Architecture

### Path Aliases

- `@/*` → `./client/*` (frontend code)
- `@shared/*` → `./shared/*` (shared schemas and types)

### Navigation Structure

The app uses a nested navigation structure:
```
RootStackNavigator (Native Stack)
├── Main (headerShown: false)
│   └── MainTabNavigator (Bottom Tabs)
│       ├── ARViewScreen (Camera + AR overlays)
│       ├── MapViewScreen (3D bird's-eye view)
│       └── SearchStackNavigator (Stack)
│           └── SearchScreen (Celestial body search)
└── Settings (Modal presentation)
```

### State Management

**CelestialContext** (`client/contexts/CelestialContext.tsx`): Central state provider managing:
- Selected celestial body and time range
- Location (GPS or manual coordinates)
- Timeline slider state and waypoint data
- Camera and permission states
- Persistent storage using AsyncStorage

All screens consume this context via the `useCelestial()` hook.

### Celestial Calculations

All astronomy calculations are **client-side** in `client/lib/celestial.ts`:
- Uses simplified astronomical algorithms (inspired by Jean Meeus)
- Calculates positions (azimuth/altitude) for Sun, Moon, and planets
- Generates waypoint arcs for day/week/month time ranges
- **No internet required** - purely mathematical calculations

Key functions:
- `getCelestialPosition(bodyId, date, location)` - Get current position
- `generateWaypoints(bodyId, timeRange, location, baseDate)` - Generate arc trajectory

### Server Architecture

Express server (`server/index.ts`) provides:
1. **Static Expo manifest routing** - Serves platform-specific manifests for Expo Go
2. **CORS configuration** - Handles localhost and Replit domains
3. **Landing page** - Template-based HTML page with app info
4. **API routes** - Registered via `registerRoutes()` from `server/routes.ts`

The server dynamically detects the platform (iOS/Android) via:
- URL path (`/ios`, `/android`)
- `expo-platform` header on `/` or `/manifest`

### Design System

Theme constants in `client/constants/theme.ts`:
- Deep space blue theme (`#001F54` background) optimized for night viewing
- Accent color: `#F7B801` (amber/gold)
- Celestial blue: `#4DA6FF` for markers
- Uses Nunito font family

### Components Organization

**Core UI Components:**
- `ThemedText`, `ThemedView` - Theme-aware base components
- `TranslucentPanel` - Frosted glass effect panels
- `Card`, `Button`, `Spacer` - Reusable UI elements

**Celestial-Specific Components:**
- `CelestialArcOverlay` - AR camera overlay with arc paths
- `MapArcOverlay` - 3D map view arc rendering
- `TimelineSlider` - Interactive timeline scrubber
- `TimeRangeSelector` - Day/Week/Month toggle
- `FloatingControls` - AR floating action buttons

## Environment Variables

Create a `.env` file:
```env
SESSION_SECRET=your_session_secret_here
DATABASE_URL=postgresql://user:password@localhost:5432/solara  # Optional
REPLIT_DEV_DOMAIN=localhost  # Auto-set in Replit
```

## Permissions

The app requires:
- **Camera** - For AR sky overlay (iOS: `NSCameraUsageDescription`)
- **Location** - For accurate calculations (iOS: `NSLocationWhenInUseUsageDescription`)

Both are configured in `app.json` for iOS and Android.

## Code Style Guidelines

- Use TypeScript strict mode
- Expo SDK conventions (no default exports for components except screens/navigators)
- React functional components with hooks
- Path aliases for clean imports (`@/components` not `../../components`)
- Prettier formatting (see `.prettierrc` if exists)
