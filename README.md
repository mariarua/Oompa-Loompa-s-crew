# Oompa Loompa's Crew - Documentation

## 📋 Project Overview

A modern web application built with **React + TypeScript + Vite** that allows users to explore and view detailed information about Oompa Loompas. The application implements advanced features including **infinite scroll**, **intelligent caching system with IndexedDB**, **real-time filtering**, and **state management with Redux Toolkit**.

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/           # Reusable components
│   ├── CharacterCard.tsx    # Individual character card
│   ├── CharacterDetail.tsx  # Detailed character view
│   ├── CharacterGrid.tsx    # Grid with infinite scroll
│   ├── Header.tsx           # Navigation header
│   ├── HeroSection.tsx      # Main home section
│   ├── HomeHeader.tsx       # Home-specific header
│   ├── Layout.tsx           # Base application layout
│   ├── LoadingScreen.tsx    # Initial loading screen
│   ├── SearchBar.tsx        # Search bar with filters
│   └── StateDisplay.tsx     # State components (loading, error, not found)
├── hooks/                # Custom hooks
│   └── useHomePageData.ts   # Home page data management hook
├── pages/                # Main pages
│   ├── DetailPage.tsx       # Character detail page
│   └── HomePage.tsx         # Main page with character list
├── services/             # External services
│   └── api.ts              # API client for Oompa Loompas
├── store/                # Redux state management
│   ├── hooks.ts            # Typed Redux hooks
│   ├── index.ts            # Store configuration
│   └── slices/
│       └── oompaLoompaSlice.ts  # Main slice with thunks
├── types/                # TypeScript type definitions
│   ├── api.ts              # API response types
│   ├── index.ts            # Centralized exports
│   ├── oompaLoompa.ts      # Main entity types
│   └── state.ts            # Redux state types
├── utils/                # Utilities and helpers
│   ├── constants.ts        # Application constants
│   ├── dataTransforms.ts   # Data transformations
│   └── oompaLoompaDB.ts    # IndexedDB manager
└── App.tsx               # Root component with routing
```

## 🛠️ Technology Stack

### Frontend

- **React 19** - UI Framework
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **React Router DOM** - SPA navigation
- **Tailwind CSS** - Styling framework

### State Management

- **Redux Toolkit** - Global state management
- **React Redux** - React bindings for Redux
- **Redux Thunk** - Middleware for async actions

### Data Persistence

- **IndexedDB** - Browser database (custom implementation)

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific rules

## 🔧 Setup and Installation

### Environment Variables

The application requires a single environment variable:

```env
VITE_API_BASE_URL=https://your-api-base-url.com/api
```

### Available Commands

```bash
# Install dependencies
npm install

# Local development
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Build preview
npm run preview
```

## 🗃️ Intelligent Caching System

### Architecture Decisions

During development, **three options** were evaluated for data persistence:

1. **LocalStorage** - Limited to ~5-10MB, inadequate for large volumes
2. **Cookies** - Very limited in size, only for small data
3. **IndexedDB** ✅ - **Chosen solution** for unlimited capacity and performance

### Why IndexedDB?

- **Capacity**: No practical storage limits
- **Performance**: Non-blocking asynchronous operations
- **Structure**: Relational database in the browser
- **Persistence**: Data survives browser closure
- **Data types**: Native support for complex objects

### Cache System Implementation

```typescript
class OompaLoompaDB {
  // Stores complete character pages
  async savePage(page: number, characters: MinimalOompaLoompa[]): Promise<void>;

  // Retrieves pages from cache
  async getPage(page: number): Promise<MinimalOompaLoompa[] | null>;

  // Stores complete character details
  async saveCharacterDetail(detail: OompaLoompa): Promise<void>;

  // Retrieves details from cache
  async getCharacterDetail(id: number): Promise<OompaLoompa | null>;

  // Metadata management (total pages, timestamps)
  async saveMetadata(key: string, value: string | number): Promise<void>;
  async getMetadata(key: string): Promise<string | number | null>;
}
```

### Expiration Strategy

- **Cache duration**: 24 hours
- **Automatic cleanup**: Every hour expired data is removed
- **Timestamp validation**: Each record includes `savedAt`

## 📊 State Management with Redux

### Main Store

```typescript
interface OompaLoompaState {
  data: MinimalOompaLoompa[]; // Character list
  loading: boolean; // Loading state
  error: string | null; // Error messages
  currentPage: number; // Current page for infinite scroll
  totalPages: number; // Total available pages
  hasMore: boolean; // Whether more data is available
  filter?: string; // Active search filter
  loadingDetailId: number | null; // ID of detail being loaded
  detailsCache: Record<number, OompaLoompa>; // In-memory details cache
  lastFetch: number | null; // Last update timestamp
}
```

### Async Thunks

#### 1. Cache Initialization

```typescript
export const initializeFromCache = createAsyncThunk<CacheInitData>(
  "oompaLoompas/initializeFromCache",
  async () => {
    const { allCharacters, lastPage } = await oompaDB.getAllCachedPages();
    return { allCharacters: allCharacters || [], lastPage: lastPage || 0 };
  }
);
```

#### 2. Page Loading

```typescript
export const loadOompaLoompasPage = createAsyncThunk<PageLoadResult, number>(
  "oompaLoompas/loadPage",
  async (page: number) => {
    // 1. Check cache first
    const cachedData = await oompaDB.getPage(page);
    if (cachedData) {
      console.log(`🗃️ Loading from IndexedDB cache! Page ${page}`);
      return { data: cachedData, fromCache: true, page, total };
    }

    // 2. If no cache, query API
    console.log(`🌐 Fetching from API... Page ${page}`);
    const apiData = await oompaLoompaApi.getPage(page);

    // 3. Save to cache for future queries
    await oompaDB.savePage(page, minimalData);
    return { data: minimalData, fromCache: false, page, total: apiData.total };
  }
);
```

#### 3. Detail Loading

```typescript
export const loadOompaLoompaDetail = createAsyncThunk<DetailLoadResult, number>(
  "oompaLoompas/loadDetail",
  async (id: number) => {
    // 1. Search in cache
    const cachedDetail = await oompaDB.getCharacterDetail(id);
    if (cachedDetail) {
      console.log(`🗃️ Retrieved character ${id} from cache`);
      return { data: cachedDetail, fromCache: true };
    }

    // 2. Query API if not in cache
    console.log(`🌐 Fetching from API... Detail ${id}`);
    const detail = await oompaLoompaApi.getDetail(id);

    // 3. Save for future queries
    await oompaDB.saveCharacterDetail(detail);
    return { data: detail, fromCache: false };
  }
);
```

## 🔄 Cache Logging System

### Implemented Console Messages

The application includes a comprehensive logging system for tracking cache behavior:

```typescript
export const MESSAGES = {
  CACHE_INIT: "🗃️ Initializing from IndexedDB cache...",
  CACHE_FOUND: "🗃️ Loading from IndexedDB cache!",
  CACHE_MISS: "📥 No cache found, loading from API...",
  API_FETCH: "🌐 Fetching from API...",
  CACHE_SAVED: "💾 Saved to cache successfully",
  CACHE_ERROR: "❌ Error with cache operation:",
  API_ERROR: "❌ API response invalid:",
} as const;
```

### Production Log Examples

```bash
# Application startup
🗃️ Initializing from IndexedDB cache...
🗃️ Initialized 125 characters from cache!

# Loading new pages
📄 Loading page 6...
🌐 Fetching from API... Page 6
💾 Saved to cache successfully

# Accessing cached pages
📄 Loading page 3...
🗃️ Loading from IndexedDB cache! Page 3

# Loading character details
👤 Loading detail for character 15...
🗃️ Retrieved character 15 from cache

# Loading statistics
📊 Page 6: +25 new, 150 total, has more: true
```

## 🎯 Key Features

### 1. Intelligent Infinite Scroll

- **Intersection Observer API** for scroll detection
- **Automatic loading** of new pages
- **Automatic duplicate removal**
- **Visual loading state** during fetch

### 2. Search System

- **Real-time filtering** without additional requests
- **Search by name and profession**
- **Implicit debouncing** via Redux
- **Custom empty state** for "no results"

### 3. Navigation and Routing

- **React Router DOM** for SPA
- **Programmatic navigation** between views
- **Friendly URLs** for details (`/:id`)
- **Automatic breadcrumb** with "Back to list" button

### 4. State Management

- **Differentiated loading states** (initial vs. pagination)
- **Robust error handling** with automatic retry
- **Informative empty states**
- **Consistent visual feedback**

## 📱 Key Components

### CharacterGrid - Infinite Scroll

```typescript
const CharacterGrid = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && shouldShowInfiniteScroll) {
          dispatch(loadOompaLoompasPage(currentPage));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [dispatch, currentPage, loading]);
};
```

### useHomePageData - Custom Hook

```typescript
export const useHomePageData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeData = async () => {
      // 1. Try loading from cache
      const result = await dispatch(initializeFromCache());

      // 2. If no cache, load first page from API
      if (!result.payload?.allCharacters?.length) {
        dispatch(loadOompaLoompasPage(1));
      }
    };

    if (data.length === 0 && !loading) {
      initializeData();
    }
  }, [dispatch, data.length, loading]);
};
```

## 📄 Environment Variables

### Required Configuration

Create a `.env` file in the project root:

```env
# Base URL for Oompa Loompa API
VITE_API_BASE_URL=https://your-api-base-url.com/api
```

### Configuration for Different Environments

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.staging
VITE_API_BASE_URL=https://staging-api.example.com

# .env.production
VITE_API_BASE_URL=https://your-production-api.com/api
```

## 🎯 Key Technical Decisions

### Cache Strategy: Why IndexedDB?

**Comparison of Storage Options:**

| Feature             | LocalStorage  | Cookies        | IndexedDB ✅    |
| ------------------- | ------------- | -------------- | --------------- |
| **Storage Limit**   | ~5-10MB       | ~4KB           | Unlimited       |
| **Performance**     | Synchronous   | Limited        | Async (Fast)    |
| **Data Types**      | Strings only  | Strings only   | Any object      |
| **Persistence**     | Domain-scoped | Request-scoped | Domain-scoped   |
| **Browser Support** | Universal     | Universal      | Modern browsers |

### State Management: Redux Toolkit Benefits

- **Immutable updates** with Immer under the hood
- **Built-in DevTools** integration
- **Thunk middleware** included by default
- **TypeScript support** out of the box
- **Reduced boilerplate** compared to vanilla Redux

### Build Tool: Vite Advantages

- **Lightning-fast** development server
- **Native ES modules** in development
- **Optimized production builds** with Rollup
- **TypeScript support** without configuration
- **Plugin ecosystem** for extensibility

## 🔧 Advanced Features

### Intersection Observer Implementation

```typescript
const INTERSECTION_CONFIG = {
  threshold: 0.1,
  rootMargin: "100px", // Start loading before user reaches the end
} as const;

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !loading && hasMore) {
      dispatch(loadOompaLoompasPage(currentPage));
    }
  }, INTERSECTION_CONFIG);

  if (loadMoreRef.current) observer.observe(loadMoreRef.current);
  return () => observer.disconnect();
}, [dispatch, currentPage, loading, hasMore]);
```

### Smart Duplicate Prevention

```typescript
export const removeDuplicates = <T extends { id: number }>(
  existing: T[],
  newItems: T[]
): T[] => {
  const existingIds = new Set(existing.map((item) => item.id));
  return newItems.filter((item) => !existingIds.has(item.id));
};
```

### Type-Safe API Client

```typescript
class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(
      `HTTP ${response.status}: Failed to fetch data`,
      response.status
    );
  }
  return response.json();
};
```

## 📊 Performance Monitoring

### Cache Performance Metrics

```typescript
// Built-in performance tracking
const trackCachePerformance = () => {
  const cacheHits = performance.getEntriesByName("cache-hit").length;
  const apiCalls = performance.getEntriesByName("api-call").length;
  const hitRate = (cacheHits / (cacheHits + apiCalls)) * 100;

  console.log(`Cache hit rate: ${hitRate.toFixed(1)}%`);
};
```

### Bundle Size Optimization

- **Tree shaking** enabled by default with Vite
- **Code splitting** at route level
- **Dynamic imports** for large utilities
- **Asset optimization** (images, fonts)

---

### Quick Start Summary

1. **Clone** the repository
2. **Install** dependencies: `npm install`
3. **Configure** environment: Copy `.env.example` to `.env` and set your API URL
4. **Start** development: `npm run dev`
5. **Build** for production: `npm run build`

The application will automatically initialize the IndexedDB cache and start loading Oompa Loompas data. Check the browser console to see the detailed cache logging in action!
