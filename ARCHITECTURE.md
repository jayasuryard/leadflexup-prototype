# LeadFlexUp - Technical Architecture

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                            │
│  - Hero Section with Features                                  │
│  - Language Selector (EN/HI/TA)                                │
│  - "Get Started" CTA                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────────┐
│                      ONBOARDING FORM                            │
│  Form Fields:                                                   │
│  1. Business Name                                               │
│  2. Business Address                                            │
│  3. Business Category (8 options)                               │
│                                                                 │
│  On Submit:                                                     │
│  - Shows loading animation (2.5s)                               │
│  - Generates analytics data (score: 45 for new businesses)     │
│  - Creates recommendations based on score                       │
│  - Saves to Context + LocalStorage                              │
│  - Redirects to Dashboard                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         v
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Protected)                        │
│                                                                 │
│  ┌─────────────┐  ┌───────────────────────────────────────┐   │
│  │  SIDEBAR    │  │         MAIN CONTENT AREA             │   │
│  │             │  │                                       │   │
│  │ Navigation: │  │  Routes:                              │   │
│  │ - Overview  │  │  /dashboard → Overview                │   │
│  │ - Analytics │  │  /dashboard/analytics                 │   │
│  │ - Competitors│  │  /dashboard/competitors              │   │
│  │ - Recommend │  │  /dashboard/recommendations           │   │
│  │ - Subscribe │  │  /dashboard/subscription              │   │
│  │ - Journey   │  │  /dashboard/journey                   │   │
│  │ - Settings  │  │  /dashboard/settings                  │   │
│  │             │  │                                       │   │
│  │ Score: 45   │  │  Content rendered via React Router    │   │
│  │ Language    │  │  <Outlet />                           │   │
│  │ Logout      │  │                                       │   │
│  └─────────────┘  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Components  │ ───> │  AppContext  │ ───> │ LocalStorage │
│              │ <─── │              │ <─── │              │
└──────────────┘      └──────────────┘      └──────────────┘
                             │
                             │ Provides:
                             │ - language
                             │ - businessData
                             │ - analyticsData
                             │ - recommendations
                             │ - subscription
                             │ - growthProgress
                             │ - isOnboarded
                             │
                             v
                    ┌─────────────────┐
                    │  All Components │
                    │  via useApp()   │
                    │  hook           │
                    └─────────────────┘
```

---

## Component Hierarchy

```
App
├── Router
    ├── AppProvider (Context)
        ├── LandingPage
        │   ├── Hero Section
        │   ├── Features Grid
        │   └── Onboarding Form (conditional)
        │
        └── DashboardLayout (Protected)
            ├── Sidebar Navigation
            │   ├── Logo
            │   ├── Score Card
            │   ├── Nav Links
            │   ├── Language Selector
            │   └── Logout Button
            │
            └── Outlet (Main Content)
                ├── DashboardOverview
                │   ├── Welcome Header
                │   ├── Quick Stats (3 cards)
                │   ├── Digital Presence (large card)
                │   ├── Quick Actions (2 cards)
                │   ├── Recommendations Preview
                │   └── Subscription CTA
                │
                ├── AnalyticsDashboard
                │   ├── Digital Presence Hero Card
                │   ├── Key Metrics (4 stats)
                │   ├── Traffic Trends (Area Chart)
                │   ├── Traffic Sources (Pie Chart)
                │   ├── Social Media Performance
                │   └── Geographic Insights (Bar Chart)
                │
                ├── CompetitorLeaderboard
                │   ├── User Position Card
                │   ├── Leaderboard Table
                │   └── Competitive Insights (3 cards)
                │
                ├── RecommendationsPage
                │   ├── Summary Card
                │   ├── Recommendations List
                │   └── Next Steps CTA
                │
                ├── SubscriptionPlans
                │   ├── 3 Pricing Cards
                │   │   ├── Starter (₹1.50L)
                │   │   ├── Professional (₹3.50L) ⭐
                │   │   └── Enterprise (₹5.00L)
                │   ├── Value Propositions
                │   └── Contact Sales CTA
                │
                └── GrowthJourney
                    ├── Overall Progress Card
                    ├── 5 Journey Steps (expandable)
                    │   ├── Step Header
                    │   ├── Progress Bar
                    │   └── Task Checklist
                    └── Completion Celebration (if 100%)
```

---

## State Management

### **AppContext Provider**
Manages global application state using React Context API:

```javascript
const AppContext = {
  // Language
  language: 'en' | 'hi' | 'ta',
  changeLanguage: (lang) => void,
  
  // Business Data
  businessData: {
    businessName: string,
    businessAddress: string,
    category: string
  },
  onboardBusiness: (data) => void,
  
  // Analytics
  analyticsData: {
    digitalPresence: {...},
    traffic: {...},
    socialMedia: {...},
    geoInsights: {...}
  },
  
  // Recommendations
  recommendations: Array<Recommendation>,
  
  // Subscription
  subscription: Plan | null,
  selectSubscription: (plan) => void,
  
  // Growth Journey
  growthProgress: { [taskKey]: boolean },
  updateGrowthProgress: (stepId, taskId, completed) => void,
  
  // Onboarding Status
  isOnboarded: boolean,
  
  // Reset
  resetApp: () => void
}
```

### **LocalStorage Persistence**
All state is automatically saved to and loaded from `localStorage`:
- **Key**: `leadflexup_data`
- **Auto-save**: On every state change
- **Auto-load**: On component mount

---

## Mock Database Structure

### **mockDatabase.js**

```javascript
// Business Categories
businessCategories = [
  { id, label: { en, hi, ta } }
] // 8 categories

// Subscription Plans
subscriptionPlans = [
  { id, name: { en, hi, ta }, price, features: [] }
] // 3 plans

// Competitor Database
competitorDatabase = {
  [category]: [
    { name, score, website, socialMedia, reviews, monthlyVisits }
  ]
} // 5 competitors per category

// Analytics Generation
generateAnalyticsData(userScore) => {
  digitalPresence: { overall, website, socialMedia, searchVisibility, onlineReviews },
  traffic: { monthly: [], sources: [] },
  socialMedia: { platforms: [], growth: [] },
  geoInsights: { topCities: [], radius: {} }
}

// Recommendation Engine
generateRecommendations(businessData, analyticsData) => [
  { priority, category, title, description, impact, timeline }
]
// Logic:
// - score < 50: Critical/High priority (website, social setup)
// - score 50-70: Medium priority (SEO, reviews)
// - score > 70: Low priority (automation, optimization)

// Growth Journey Steps
growthJourneySteps = [
  { id, title: { en, hi, ta }, description, tasks: [] }
] // 5 steps, 15 total tasks
```

---

## Routing Structure

```
/ (Public)
  └── LandingPage
  
/dashboard (Protected - requires isOnboarded)
  ├── index → DashboardOverview
  ├── /analytics → AnalyticsDashboard
  ├── /competitors → CompetitorLeaderboard
  ├── /recommendations → RecommendationsPage
  ├── /subscription → SubscriptionPlans
  ├── /journey → GrowthJourney
  └── /settings → Settings (placeholder)

* (Fallback) → Redirect to /
```

**Protected Routes:**
- Checks `isOnboarded` from Context
- Redirects to `/` if not onboarded
- Implemented via `<ProtectedRoute>` wrapper

---

## UI Component Library

### **Core Components** (`src/components/ui/`)

1. **Button**
   - Variants: primary, secondary, outline, ghost
   - Sizes: sm, md, lg
   - Loading state with spinner
   - Icon support
   - Framer Motion animations

2. **Card**
   - Card, CardHeader, CardBody, CardFooter
   - Hover effects (optional)
   - Rounded corners, shadows
   - Responsive padding

3. **Input & Select**
   - Form field with label
   - Icon support
   - Focus states with ring
   - Error handling
   - Fully accessible

4. **Badge**
   - Variants: default, primary, success, warning, danger, critical, high, medium, low
   - Color-coded priority system
   - Compact design

5. **ProgressBar & CircularProgress**
   - Animated progress indicators
   - Customizable colors
   - Smooth transitions
   - Score-based color coding

---

## Internationalization (i18n)

### **Translation System**

```javascript
// utils/i18n.js
translations = {
  en: { key: 'English text' },
  hi: { key: 'हिंदी पाठ' },
  ta: { key: 'தமிழ் உரை' }
}

// Usage:
t('heroTitle', language) → Translated string
getLocalizedText(obj, language) → Extract localized text from object
```

### **Supported Languages**
- English (EN) - Default
- Hindi (HI) - Full translation
- Tamil (TA) - Full translation

### **Translation Coverage**
- Landing page (hero, features, CTA)
- Onboarding form
- Dashboard navigation
- All page titles and labels
- Analytics metrics
- Recommendations
- Subscription plans (names and features)
- Growth journey steps

---

## Performance Optimizations

1. **Code Splitting**
   - React Router lazy loading ready
   - Dynamic imports for pages

2. **State Optimization**
   - Context split by concern
   - Memoization where needed
   - Minimal re-renders

3. **Animations**
   - Framer Motion with optimized transitions
   - Hardware-accelerated transforms
   - Stagger effects for lists

4. **Bundle Size**
   - Tree-shaking enabled (Vite)
   - Minimal dependencies
   - Recharts code-split ready

---

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 14+, Android Chrome 90+
- **Features Used**:
  - CSS Grid & Flexbox
  - CSS Custom Properties
  - ES6+ JavaScript
  - LocalStorage API
  - Intersection Observer (Framer Motion)

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## File Size Analysis

**Key Dependencies:**
- react + react-dom: ~140KB (gzipped)
- react-router-dom: ~15KB
- framer-motion: ~70KB
- recharts: ~90KB
- lucide-react: ~5KB (tree-shaken)
- tailwindcss: Compiled CSS ~20KB

**Total Bundle Estimate**: ~400KB (initial load, optimized)

---

## Security Considerations (Production Checklist)

**Current MVP Limitations:**
- ❌ No authentication/authorization
- ❌ No input sanitization (XSS protection needed)
- ❌ No CSRF protection
- ❌ LocalStorage used (not encrypted)
- ❌ No API rate limiting

**For Production:**
- ✅ Add JWT authentication
- ✅ Implement input validation (Zod/Yup)
- ✅ Add HTTPS only
- ✅ Sanitize user inputs
- ✅ Add CORS headers
- ✅ Implement CSP (Content Security Policy)
- ✅ Add rate limiting
- ✅ Use secure cookies for sessions
- ✅ Encrypt sensitive data

---

## Deployment Recommendations

**Platforms:**
- Vercel (Recommended - already integrated analytics)
- Netlify
- AWS Amplify
- GitHub Pages (static build)

**Environment Variables Needed:**
```
VITE_API_BASE_URL=
VITE_ANALYTICS_ID=
VITE_PAYMENT_KEY=
VITE_MAPS_API_KEY=
```

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist/
```

---

## Testing Strategy (Future)

**Recommended Tools:**
- **Unit**: Vitest + React Testing Library
- **E2E**: Playwright or Cypress
- **Visual**: Chromatic for component testing

**Key Test Cases:**
1. Onboarding flow completion
2. Language switching
3. Data persistence (localStorage)
4. Dashboard navigation
5. Growth journey task completion
6. Score calculation accuracy
7. Responsive design breakpoints

---

## API Integration Points (Phase 2)

**Backend Endpoints Needed:**
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/businesses/:id
POST   /api/businesses
GET    /api/analytics/:businessId
GET    /api/competitors/:category
POST   /api/subscriptions
GET    /api/recommendations/:businessId
PATCH  /api/journey/:businessId/:taskId
```

**Third-Party APIs:**
- Google Analytics API (traffic data)
- Google My Business API (reviews, visibility)
- Facebook/Instagram Graph API (social metrics)
- OpenStreetMap Nominatim (geocoding)
- Razorpay/Stripe (payments)

---

## Monitoring & Analytics

**Current Integration:**
- ✅ Vercel Analytics (page views, visitors)
- ✅ Vercel Speed Insights (Core Web Vitals)

**Recommended Additions:**
- Error tracking: Sentry
- User behavior: Mixpanel or Amplitude
- A/B testing: Optimizely or Google Optimize
- Heatmaps: Hotjar or Clarity

---

This architecture document provides a complete technical overview of the LeadFlexUp prototype.
