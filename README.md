# Solara - Celestial Body Tracker

A React Native mobile app that tracks and visualizes celestial bodies (Sun, Moon, and planets) using augmented reality and 3D visualization. Built with Expo SDK 54 and Express.js.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## Features

- **AR Sky View** — Point your phone at the sky and see celestial body positions overlaid on your live camera feed with glowing arc paths and waypoint markers
- **Interactive 3D Map** — Bird's-eye overhead visualization showing complete celestial trajectories with compass bearings and altitude indicators
- **Timeline Controls** — Scrub through time with day, week, and month views to see past and future celestial positions
- **Celestial Search** — Find and track the Sun, Moon, Mercury, Venus, Mars, Jupiter, and Saturn with real-time data
- **Location-Based** — GPS positioning or manual coordinate entry for accurate celestial calculations
- **Offline Calculations** — All astronomy math runs on-device with no internet required

## Screenshots

The app uses a deep space blue theme (#001F54) optimized for outdoor night viewing.

## Tech Stack

**Frontend:**
- React Native 0.81 with Expo SDK 54
- React Navigation 7 (bottom tabs + native stack)
- React Native Reanimated for animations
- React Native SVG for arc rendering
- Expo Camera, Location, Haptics, Sensors
- TanStack React Query for data fetching

**Backend:**
- Express.js 5 with TypeScript
- Drizzle ORM with PostgreSQL
- Static Expo Go deployment support

## Project Structure

```
solara/
├── client/                    # React Native frontend
│   ├── App.tsx                # Root app component
│   ├── index.js               # Entry point
│   ├── components/
│   │   ├── ARHeader.tsx       # AR view header
│   │   ├── Button.tsx         # Reusable button
│   │   ├── Card.tsx           # Card with elevation
│   │   ├── CelestialArcOverlay.tsx  # AR arc rendering
│   │   ├── CelestialListItem.tsx    # Search result item
│   │   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   │   ├── ErrorFallback.tsx  # Error fallback UI
│   │   ├── FloatingControls.tsx     # AR floating controls
│   │   ├── HeaderTitle.tsx    # Custom header title
│   │   ├── MapArcOverlay.tsx  # 3D map arc rendering
│   │   ├── Spacer.tsx         # Layout spacer
│   │   ├── ThemedText.tsx     # Themed text component
│   │   ├── ThemedView.tsx     # Themed view component
│   │   ├── TimelineSlider.tsx # Interactive timeline
│   │   ├── TimeRangeSelector.tsx    # Day/Week/Month selector
│   │   └── TranslucentPanel.tsx     # Frosted glass panel
│   ├── constants/
│   │   └── theme.ts           # Colors, spacing, typography
│   ├── contexts/
│   │   └── CelestialContext.tsx     # Celestial data provider
│   ├── hooks/
│   │   ├── useColorScheme.ts  # Color scheme hook
│   │   ├── useScreenOptions.ts # Screen options hook
│   │   └── useTheme.ts        # Theme hook
│   ├── lib/
│   │   ├── celestial.ts       # Astronomy calculations
│   │   ├── query-client.ts    # API client setup
│   │   └── storage.ts         # AsyncStorage wrapper
│   ├── navigation/
│   │   ├── MainTabNavigator.tsx     # Bottom tab navigator
│   │   ├── RootStackNavigator.tsx   # Root stack navigator
│   │   └── SearchStackNavigator.tsx # Search stack
│   └── screens/
│       ├── ARViewScreen.tsx   # AR camera overlay
│       ├── MapViewScreen.tsx  # 3D map view
│       ├── SearchScreen.tsx   # Celestial body search
│       └── SettingsScreen.tsx # Settings & location
├── server/                    # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes
│   ├── storage.ts             # Data storage layer
│   └── templates/
│       └── landing-page.html  # Landing page
├── shared/
│   └── schema.ts              # Database schema (Drizzle)
├── scripts/
│   └── build.js               # Static build for Expo Go
├── assets/
│   └── images/                # App icons & images
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── drizzle.config.ts          # Drizzle ORM config
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Prerequisites

- **Node.js** 20 or later
- **npm** 9 or later
- **PostgreSQL** database (optional, for backend persistence)
- **Expo Go** app on your iOS or Android device (for mobile testing)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/solara.git
cd solara
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root directory:

```env
# Required for backend
SESSION_SECRET=your_session_secret_here

# Optional: PostgreSQL database URL
DATABASE_URL=postgresql://user:password@localhost:5432/solara

# Set automatically in Replit, set manually for local dev
REPLIT_DEV_DOMAIN=localhost
```

### 4. Start the development servers

**Backend (Express API on port 5000):**

```bash
npm run server:dev
```

**Frontend (Expo dev server on port 8081):**

```bash
npx expo start
```

### 5. Run on your device

- **iOS/Android:** Open Expo Go and scan the QR code from the terminal
- **Web:** Press `w` in the terminal or visit `http://localhost:8081`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run server:dev` | Start Express backend in development mode |
| `npm run expo:dev` | Start Expo dev server (Replit environment) |
| `npx expo start` | Start Expo dev server (local development) |
| `npm run expo:static:build` | Build static bundles for Expo Go deployment |
| `npm run server:build` | Build Express server for production |
| `npm run server:prod` | Run production Express server |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run check:types` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Celestial Calculations

All celestial position calculations are performed client-side in `client/lib/celestial.ts` using simplified astronomical algorithms. The library computes:

- **Solar position** — Right ascension, declination, altitude, and azimuth
- **Lunar position** — Including lunar phase calculations
- **Planetary positions** — Mercury, Venus, Mars, Jupiter, Saturn using orbital elements
- **Rise/Set times** — Approximate rise and set times for each body
- **Arc paths** — Full trajectory arcs across the sky for any time range

These calculations provide accuracy suitable for visual sky tracking and do not require an internet connection.

## Design System

The app uses a deep space blue theme designed for night sky observation:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#001F54` | Main background |
| Primary | `#0A1128` | Cards, panels |
| Accent | `#F7B801` | Highlights, selected items |
| Celestial Blue | `#4DA6FF` | Celestial body markers |
| Text Primary | `#E8E8E8` | Main text |
| Text Secondary | `#A0A0B0` | Secondary text |

## Deployment

### Expo Go (Testing)

The app includes a static build system for deploying to Expo Go without a running Metro server:

```bash
npm run expo:static:build
npm run server:prod
```

### Production

Build and deploy the Express server:

```bash
npm run server:build
npm run server:prod
```

## Permissions

The app requests the following device permissions:

- **Camera** — For AR sky overlay mode
- **Location** — For accurate celestial position calculations based on GPS coordinates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Celestial calculations inspired by Jean Meeus' "Astronomical Algorithms"
- Design inspired by Star Walk 2
- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
