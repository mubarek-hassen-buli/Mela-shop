# 📱 Project Documentation

> A comprehensive technical reference for the mobile application built by **Melaverse Technology and Promotion**

---

## 📋 Table of Contents

- [System Overview](#-system-overview)
- [App Features](#-app-features)
- [User Roles](#-user-roles)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Frontend Folder Structure](#-frontend-folder-structure)
- [Backend Folder Structure](#-backend-folder-structure)
- [Authentication Flow](#-authentication-flow)
- [API Design Conventions](#-api-design-conventions)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)

---

## 🧭 System Overview

This is a full-stack mobile application built with **React Native Expo** on the frontend and **NestJS** on the backend. The app serves two distinct user types — a standard **User** and an **Admin** — where both roles interact through the **same mobile application**. The Admin dashboard is embedded directly within the mobile app, accessible only to users with the `admin` role.

The system is powered by a **PostgreSQL database hosted on Neon**, managed through **Drizzle ORM**, authenticated via **Clerk**, and supports media uploads through **Cloudinary**. Data fetching is handled by **TanStack Query** and global state is managed by **Zustand**.

---

## ✨ App Features

### User-Facing Features
- 🔐 Secure sign-up and sign-in (Clerk — email/password, Google OAuth, Apple Sign-In)
- 👤 Profile management and avatar upload (Cloudinary)
- 📊 Personal dashboard with analytics charts (react-native-gifted-charts)
- 🔔 Push notifications (expo-notifications)
- 🌐 Role-aware navigation — users only see their permitted screens

### Admin-Facing Features (Mobile Dashboard)
- 📋 Full user management (view, search, promote/demote, deactivate)
- 📈 Analytics dashboard with bar, line, pie, and donut charts
- 🛠️ Content/resource management
- 🔔 Broadcast push notifications to all users
- 🧾 Audit logs and activity monitoring
- ⚙️ App settings and configuration controls

---

## 👥 User Roles

The application supports two roles assigned at the database level. **Every new user who registers defaults to the `user` role.** The `admin` role must be explicitly assigned by an existing admin.

| Role | Description | Default |
|------|-------------|---------|
| `user` | Standard application user with access to personal features | ✅ Yes |
| `admin` | Full access including the in-app admin dashboard | ❌ No |

### Role Assignment Flow

1. User registers via Clerk (email/password or OAuth).
2. A webhook fires from Clerk to the NestJS backend (`/webhooks/clerk`).
3. NestJS creates a corresponding user record in Neon with `role: 'user'` by default.
4. An existing admin can promote a user to `admin` via the Admin Dashboard.
5. The `role` field is stored in the `users` table in Neon and is included in the JWT claims passed to the backend on every request.

```
Registration → Clerk creates user → Webhook → NestJS creates DB record → role: 'user'
Admin promotes user → PATCH /users/:id/role → role: 'admin'
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Responsibility |
|---|---|---|
| **React Native** | Latest | Core mobile UI framework for iOS and Android |
| **Expo** | SDK 51+ | Managed workflow, native modules, EAS build pipeline |
| **Expo Router** | v3+ | File-based navigation, deep linking, layout groups |
| **NativeWind** | v4 | Tailwind CSS utility styling for React Native |
| **Clerk (`@clerk/clerk-expo`)** | Latest | Authentication UI, session management, secure token storage |
| **TanStack Query** | v5 | Server state management, caching, background refetching |
| **Zustand** | v4 | Lightweight global client-side state management |
| **react-native-gifted-charts** | Latest | Bar, line, area, pie, donut, and stacked charts |
| **React Hook Form + Zod** | Latest | Form handling and schema-based validation |
| **Axios** | Latest | HTTP client with interceptors for auth headers |
| **expo-secure-store** | Latest | Secure local storage for sensitive data (tokens) |
| **expo-notifications** | Latest | Push notification registration and handling |
| **expo-image-picker** | Latest | Camera and gallery access for media uploads |
| **expo-haptics** | Latest | Haptic feedback for improved UX polish |
| **Sentry (`@sentry/react-native`)** | Latest | Crash reporting and error monitoring in production |

---

### Backend

| Technology | Version | Responsibility |
|---|---|---|
| **NestJS** | v10+ | Modular backend framework — controllers, services, guards, pipes |
| **Drizzle ORM** | Latest | Type-safe PostgreSQL queries and schema management |
| **Neon (PostgreSQL)** | Latest | Serverless PostgreSQL database — primary data store |
| **Clerk (`@clerk/backend`)** | Latest | JWT verification and user identity validation on the server |
| **Cloudinary** | Latest | Image and media upload, transformation, and delivery |
| **`@nestjs/swagger`** | Latest | Auto-generated OpenAPI/Swagger API documentation |
| **`@nestjs/throttler`** | Latest | Rate limiting to protect API endpoints |
| **`@nestjs/config`** | Latest | Environment variable management and configuration |
| **Helmet** | Latest | HTTP security headers middleware |
| **Zod** | Latest | Runtime schema validation for request DTOs |
| **drizzle-zod** | Latest | Auto-generates Zod schemas from Drizzle table definitions |

---

### Infrastructure & Tooling

| Tool | Responsibility |
|---|---|
| **Neon** | Serverless PostgreSQL with branching for dev/staging/prod |
| **Cloudinary** | Media CDN — image upload, optimization, and delivery |
| **Clerk** | Authentication provider — users, sessions, OAuth, webhooks |
| **EAS Build** | Expo Application Services for cloud builds (iOS + Android) |
| **EAS Submit** | Automated submission to App Store and Google Play |
| **Sentry** | Error monitoring and performance tracing |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Expo App                     │
│                                                             │
│   ┌────────────┐   ┌──────────────┐   ┌────────────────┐   │
│   │ Expo Router │   │    Clerk     │   │  NativeWind UI │   │
│   │ Navigation  │   │  Auth SDK    │   │   Components   │   │
│   └────────────┘   └──────────────┘   └────────────────┘   │
│                                                             │
│   ┌──────────────────────┐   ┌───────────────────────────┐  │
│   │   TanStack Query     │   │         Zustand           │  │
│   │  (Server State)      │   │     (Client State)        │  │
│   └──────────────────────┘   └───────────────────────────┘  │
│                   │                                         │
│              Axios (JWT in headers)                         │
└───────────────────│─────────────────────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────────────────────┐
│                    NestJS Backend                            │
│                                                             │
│   ┌────────────┐   ┌──────────────┐   ┌────────────────┐   │
│   │   Guards   │   │  Controllers │   │    Services    │   │
│   │ (Clerk JWT)│   │  (REST API)  │   │ (Business Logic│   │
│   └────────────┘   └──────────────┘   └────────────────┘   │
│                                                             │
│   ┌──────────────────────┐   ┌───────────────────────────┐  │
│   │     Drizzle ORM      │   │    Cloudinary SDK         │  │
│   └──────────────────────┘   └───────────────────────────┘  │
│                   │                                         │
└───────────────────│─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│                  Neon (PostgreSQL)                           │
│           users | [your tables] | sessions                  │
└─────────────────────────────────────────────────────────────┘
                    ▲
                    │ Webhooks
┌───────────────────┴─────────────────────────────────────────┐
│                       Clerk                                  │
│        (Identity Provider — OAuth, Sessions, JWTs)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Frontend Folder Structure

```
mobile/
├── app/                          # Expo Router — file-based routing
│   ├── (auth)/                   # Auth group — unauthenticated routes
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── _layout.tsx
│   ├── (user)/                   # User group — authenticated user routes
│   │   ├── _layout.tsx           # Bottom tab layout for users
│   │   ├── index.tsx             # Home / dashboard screen
│   │   ├── profile.tsx
│   │   ├── notifications.tsx
│   │   └── settings.tsx
│   ├── (admin)/                  # Admin group — admin-only routes
│   │   ├── _layout.tsx           # Admin tab/stack layout
│   │   ├── index.tsx             # Admin dashboard screen
│   │   ├── users/
│   │   │   ├── index.tsx         # User list
│   │   │   └── [id].tsx          # Single user detail / edit
│   │   ├── analytics.tsx
│   │   ├── notifications.tsx     # Broadcast notifications
│   │   └── settings.tsx
│   ├── _layout.tsx               # Root layout (Clerk provider, fonts, etc.)
│   └── +not-found.tsx
│
├── src/
│   ├── api/                      # Axios instance and API call functions
│   │   ├── axios.ts              # Base Axios instance with interceptors
│   │   ├── auth.api.ts
│   │   ├── users.api.ts
│   │   └── [feature].api.ts
│   │
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Shared across user and admin
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ScreenWrapper.tsx
│   │   ├── charts/               # Chart components (gifted-charts wrappers)
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── DonutChart.tsx
│   │   ├── forms/                # Reusable form field components
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   └── FormError.tsx
│   │   └── admin/                # Admin-specific components
│   │       ├── StatCard.tsx
│   │       ├── UserRow.tsx
│   │       └── RoleBadge.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCurrentUser.ts     # Returns current user with role
│   │   ├── useIsAdmin.ts         # Boolean — is current user admin?
│   │   ├── useUpload.ts          # Cloudinary upload hook
│   │   └── useNotifications.ts   # Push notification registration
│   │
│   ├── store/                    # Zustand stores
│   │   ├── auth.store.ts         # Auth state (user object, role)
│   │   ├── ui.store.ts           # UI state (modals, theme, etc.)
│   │   └── index.ts
│   │
│   ├── queries/                  # TanStack Query hooks
│   │   ├── users.queries.ts
│   │   ├── analytics.queries.ts
│   │   └── [feature].queries.ts
│   │
│   ├── lib/                      # Third-party config and utilities
│   │   ├── clerk.ts              # Clerk configuration
│   │   ├── queryClient.ts        # TanStack Query client setup
│   │   └── sentry.ts             # Sentry initialization
│   │
│   ├── constants/                # App-wide constants
│   │   ├── colors.ts
│   │   ├── roles.ts              # Role constants: 'user' | 'admin'
│   │   └── routes.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   └── utils/                    # Pure helper functions
│       ├── format.ts             # Date, number, currency formatters
│       ├── validators.ts
│       └── storage.ts            # expo-secure-store helpers
│
├── assets/                       # Static assets
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── app.json                      # Expo app configuration
├── babel.config.js
├── tailwind.config.js            # NativeWind / Tailwind config
├── tsconfig.json
├── .env                          # Environment variables (never commit)
├── .env.example
└── package.json
```

---

## 📁 Backend Folder Structure

```
backend/
├── src/
│   ├── main.ts                   # App entry point — bootstrap, Helmet, Swagger
│   ├── app.module.ts             # Root module
│   │
│   ├── config/                   # Environment and app configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── cloudinary.config.ts
│   │
│   ├── database/                 # Drizzle ORM setup
│   │   ├── database.module.ts
│   │   ├── database.service.ts   # Neon connection and Drizzle client
│   │   └── schema/               # Drizzle table definitions
│   │       ├── users.schema.ts
│   │       ├── [feature].schema.ts
│   │       └── index.ts
│   │
│   ├── common/                   # Shared across all modules
│   │   ├── guards/
│   │   │   ├── clerk-auth.guard.ts     # Verifies Clerk JWT on every request
│   │   │   └── roles.guard.ts          # Checks user role (admin/user)
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts  # Extracts user from request
│   │   │   └── roles.decorator.ts         # @Roles('admin') decorator
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   # Global error formatting
│   │   ├── interceptors/
│   │   │   └── response-transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts     # Zod-based DTO validation
│   │   └── types/
│   │       ├── user.types.ts
│   │       └── request.types.ts
│   │
│   ├── modules/                  # Feature modules — one folder per domain
│   │   │
│   │   ├── webhooks/             # Clerk webhook handler
│   │   │   ├── webhooks.module.ts
│   │   │   ├── webhooks.controller.ts   # POST /webhooks/clerk
│   │   │   └── webhooks.service.ts      # Creates user in DB on Clerk event
│   │   │
│   │   ├── users/                # User management
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts      # GET /users, GET /users/:id, PATCH, DELETE
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts      # All Drizzle queries for users
│   │   │   ├── dto/
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── update-role.dto.ts
│   │   │   └── users.schema.ts          # Zod schemas (via drizzle-zod)
│   │   │
│   │   ├── auth/                 # Auth utilities (Clerk verification helpers)
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts          # verifyClerkToken(), getUserFromToken()
│   │   │
│   │   ├── analytics/            # Admin analytics endpoints
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts  # GET /analytics/overview, /users, /activity
│   │   │   └── analytics.service.ts
│   │   │
│   │   ├── media/                # Cloudinary media upload
│   │   │   ├── media.module.ts
│   │   │   ├── media.controller.ts      # POST /media/upload
│   │   │   └── media.service.ts         # Cloudinary SDK integration
│   │   │
│   │   └── notifications/        # Push notifications
│   │       ├── notifications.module.ts
│   │       ├── notifications.controller.ts  # POST /notifications/broadcast
│   │       └── notifications.service.ts     # Expo push notification sender
│   │
├── drizzle/                      # Drizzle migration files
│   ├── migrations/
│   │   └── 0001_initial.sql
│   └── drizzle.config.ts
│
├── test/                         # E2E and unit tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                          # Never commit — use .env.example
├── .env.example
├── tsconfig.json
├── nest-cli.json
└── package.json
```

---

## 🔐 Authentication Flow

### Registration

```
1. User opens app → Clerk sign-up screen
2. User submits credentials / OAuth
3. Clerk creates user (stores in Clerk's system)
4. Clerk fires webhook → POST /webhooks/clerk
5. NestJS webhook handler receives event
6. NestJS creates user record in Neon:
   {
     clerk_id: "user_xxx",
     email: "user@example.com",
     role: "user",           ← always default
     created_at: now()
   }
7. App receives Clerk session → JWT stored securely via expo-secure-store
```

### Authenticated Requests

```
1. Axios interceptor reads Clerk session token
2. Attaches it as: Authorization: Bearer <clerk_jwt>
3. NestJS ClerkAuthGuard verifies JWT via @clerk/backend
4. CurrentUser decorator extracts clerk_id
5. UsersRepository fetches user from Neon by clerk_id
6. Role is attached to request object
7. RolesGuard checks role if route is @Roles('admin')
```

### Role Guard Example (Backend)

```typescript
// Admin-only route example
@Get('admin/users')
@UseGuards(ClerkAuthGuard, RolesGuard)
@Roles('admin')
getAllUsers(@CurrentUser() user: UserEntity) {
  return this.usersService.findAll();
}
```

### Role-Based Navigation (Frontend)

```typescript
// app/(auth)/_layout.tsx — redirects based on role after login
const { role } = useAuthStore();

useEffect(() => {
  if (role === 'admin') router.replace('/(admin)');
  else router.replace('/(user)');
}, [role]);
```

---

## 📡 API Design Conventions

All API responses follow a consistent envelope format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Users fetched successfully",
  "timestamp": "2025-04-19T10:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You do not have permission to access this resource",
  "statusCode": 403,
  "timestamp": "2025-04-19T10:00:00.000Z"
}
```

### Core Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/webhooks/clerk` | Public (Clerk) | Sync Clerk user to Neon on registration |
| `GET` | `/users/me` | Authenticated | Get current user profile |
| `PATCH` | `/users/me` | Authenticated | Update own profile |
| `GET` | `/users` | Admin only | List all users |
| `GET` | `/users/:id` | Admin only | Get single user detail |
| `PATCH` | `/users/:id/role` | Admin only | Promote/demote user role |
| `DELETE` | `/users/:id` | Admin only | Deactivate a user |
| `GET` | `/analytics/overview` | Admin only | App-wide stats |
| `POST` | `/media/upload` | Authenticated | Upload image to Cloudinary |
| `POST` | `/notifications/broadcast` | Admin only | Send push to all users |

---

## 🌍 Environment Variables

### Frontend (`mobile/.env`)

```env
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# API
EXPO_PUBLIC_API_BASE_URL=https://your-api.com/api

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
PORT=3000
NODE_ENV=development
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- A Neon account and database
- A Clerk account and application
- A Cloudinary account

---

### Backend Setup

```bash
# 1. Clone and install
cd backend
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Run database migrations
npm run db:migrate

# 4. Start development server
npm run start:dev
```

---

### Frontend Setup

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Start Expo dev server
npx expo start

# 4. Run on device / simulator
# Press 'a' for Android, 'i' for iOS
```

---

### Database Migrations (Drizzle)

```bash
# Generate a new migration after schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```

---

### Build & Deploy (EAS)

```bash
# Configure EAS (first time only)
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 🏢 Built by

**Melaverse Technology and Promotion**
Ethiopia 🇪🇹

---

*This documentation is maintained alongside the codebase. Update it whenever the stack, structure, or features change.*