# Frontend Architecture Document Template

> This template is for frontend-focused architecture design.
> Use this when the target is web app, SPA, component library, etc.

## Output File

`docs/{serviceName}/arch-fe.md`

---

## Template

```markdown
# Frontend Design Doc: {Feature Name}

> Created: {date}
> Service: {serviceName}
> Type: Frontend
> Requirements document: docs/{serviceName}/spec.md
> Backend API reference: docs/{serviceName}/arch-be.md (if exists)

## 0. Summary

### Goal
(Goal this feature aims to achieve - 1-2 sentences)

### Non-goals
- (Items excluded from this scope)

### Success metrics
- (List of success criteria)

---

## 1. Scope

### In scope
- (Items included in this implementation)

### Out of scope
- (Future improvements or excluded items)

---

## 1.5. Tech Stack

```yaml
tech_stack:
  framework: "{framework}"                  # e.g., React 18, Vue 3, Next.js 14
  language: "{language}"                    # e.g., TypeScript 5.x
  state_management: "{state lib}"           # e.g., Zustand, Redux Toolkit, Pinia
  styling: "{styling approach}"             # e.g., Tailwind CSS, styled-components
  routing: "{router lib}"                   # e.g., react-router v6, vue-router
  api_client: "{api lib}"                   # e.g., axios, fetch, react-query
  form_handling: "{form lib}"               # e.g., react-hook-form, Formik, vee-validate
  build_tool: "{bundler}"                   # e.g., Vite, Webpack, Turbopack
  testing: "{test framework}"               # e.g., Vitest, Jest, Playwright
  third_party:                              # External services/SDKs
    - "{service 1}"                         # e.g., Firebase Auth
    - "{service 2}"                         # e.g., Sentry
```

---

## 2. Architecture Impact

### Component Structure

```yaml
component_structure:
  pages:                                    # Route-level components
    - path: "/example"
      component: "ExamplePage"
      file: "src/pages/ExamplePage.tsx"
      description: "{page description}"

  features:                                 # Feature-specific components
    - name: "{feature_name}"
      path: "src/features/{feature_name}/"
      components:
        - name: "{ComponentName}"
          type: "container | presentational"
          description: "{component description}"

  shared:                                   # Reusable components
    - name: "{ComponentName}"
      path: "src/components/{ComponentName}"
      props:
        - name: "{propName}"
          type: "{type}"
          required: true
      description: "{component description}"
```

### File Structure

```
src/
├── pages/                    # Route-level components
│   └── {PageName}/
│       ├── index.tsx
│       ├── {PageName}.tsx
│       └── {PageName}.test.tsx
├── features/                 # Feature modules
│   └── {feature}/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types.ts
├── components/               # Shared UI components
│   └── {ComponentName}/
│       ├── index.tsx
│       ├── {ComponentName}.tsx
│       └── {ComponentName}.stories.tsx
├── hooks/                    # Global custom hooks
├── store/                    # State management
├── api/                      # API layer
├── utils/                    # Utility functions
├── types/                    # Global type definitions
└── styles/                   # Global styles
```

---

## 3. State Management

```yaml
state_management:
  global_state:               # Application-wide state
    - name: "{storeName}"
      file: "src/store/{storeName}.ts"
      state:
        - field: "{fieldName}"
          type: "{type}"
          initial: "{initial value}"
      actions:
        - name: "{actionName}"
          description: "{what it does}"
      selectors:
        - name: "{selectorName}"
          returns: "{return type}"

  server_state:               # API cache state (react-query, SWR, etc.)
    - query_key: "{queryKey}"
      endpoint: "{API endpoint}"
      stale_time: "{duration}"
      cache_time: "{duration}"

  local_state:                # Component-level state
    - component: "{ComponentName}"
      states:
        - name: "{stateName}"
          type: "{type}"
          purpose: "{why this state exists}"
```

---

## 4. Route Definition

```yaml
routes:
  - path: "/"
    component: "HomePage"
    exact: true
    auth_required: false

  - path: "/dashboard"
    component: "DashboardPage"
    auth_required: true
    guards:
      - "AuthGuard"
    children:
      - path: "settings"
        component: "SettingsPage"

  - path: "/example/:id"
    component: "ExampleDetailPage"
    params:
      - name: "id"
        type: "string"
    auth_required: true

  - path: "*"
    component: "NotFoundPage"
    exact: false
```

---

## 5. API Integration

### API Client Configuration

```yaml
api_client:
  base_url: "{API_BASE_URL}"
  timeout: 30000
  headers:
    - name: "Content-Type"
      value: "application/json"
  interceptors:
    request:
      - "addAuthToken"
      - "addRequestId"
    response:
      - "handleUnauthorized"
      - "transformResponse"
```

### API Endpoints (Reference from arch-be.md)

```yaml
api_integration:
  - endpoint: "GET /api/v1/example"
    hook: "useExampleList"
    file: "src/features/example/api/useExampleList.ts"
    options:
      stale_time: "5min"
      retry: 3

  - endpoint: "POST /api/v1/example"
    hook: "useCreateExample"
    file: "src/features/example/api/useCreateExample.ts"
    invalidates:
      - "exampleList"
```

---

## 6. Code Mapping

| Feature | File | Component/Hook | Props/Params | Action |
|---------|------|----------------|--------------|--------|
| {feature} | {file path} | {component or hook name} | {key props} | {what to implement} |

---

## 7. Implementation Plan

### Required Reference Files (Must read before implementation)

| File | Reference Purpose |
|------|------------------|
| {file path 1} | {component patterns, naming conventions} |
| {file path 2} | {styling approach, design tokens} |
| {file path 3} | {state management patterns} |

> When running build skill, read above files first to understand patterns

### Step-by-Step Implementation

1. **Step 1: Types & Interfaces**
   - Define TypeScript types
   - Create API response types

2. **Step 2: API Layer**
   - Create API hooks
   - Set up error handling

3. **Step 3: State Management**
   - Create stores if needed
   - Define selectors

4. **Step 4: Components**
   - Create UI components
   - Implement business logic

5. **Step 5: Pages & Routes**
   - Create page components
   - Configure routes

---

## 8. User Flow Diagram

### {Flow name}

\`\`\`mermaid
flowchart TD
    A[User Action] --> B{Route Guard}
    B -->|Authenticated| C[Page Component]
    B -->|Not Auth| D[Login Page]
    C --> E[Fetch Data]
    E --> F{Loading?}
    F -->|Yes| G[Skeleton]
    F -->|No| H[Render Content]
    H --> I[User Interaction]
    I --> J[Update State]
    J --> K[Optimistic Update]
    K --> L[API Call]
    L -->|Success| M[Invalidate Cache]
    L -->|Error| N[Show Error Toast]
\`\`\`

---

## 9. Style Guide

### Design Tokens

```yaml
design_tokens:
  colors:
    primary: "{color value}"
    secondary: "{color value}"
    error: "{color value}"
    success: "{color value}"
  
  spacing:
    unit: "{base unit}"            # e.g., 4px, 0.25rem
    scale: [1, 2, 4, 6, 8, 12, 16] # multipliers

  typography:
    font_family: "{font family}"
    sizes:
      xs: "{size}"
      sm: "{size}"
      base: "{size}"
      lg: "{size}"
      xl: "{size}"

  breakpoints:
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
```

### Component Styling Convention

```yaml
styling_convention:
  approach: "{Tailwind | CSS Modules | styled-components}"
  naming: "{BEM | utility-first | component-scoped}"
  responsive: "{mobile-first | desktop-first}"
  dark_mode: "{supported | not supported}"
```

---

## 10. Risks & Tradeoffs (Debate Conclusion)

### Chosen Option
- {adopted design approach}

### Rejected Alternatives
- {unadopted items and reasons}

### Reasoning
- Project constraints: {reason}
- Best practice adoption: {applied parts}
- Future improvement points: {what to do later}

### Assumptions
- **Confirmed**: {clearly decided in debate}
- **Estimated**: {assumed due to lack of confirmation - needs verification in implementation}

---

## 11. UX/Performance/A11y Checklist (3 Essential Checks)

### UX States

| State | Component | Handling | User Feedback |
|-------|-----------|----------|---------------|
| Loading | {component} | {skeleton/spinner} | {what user sees} |
| Empty | {component} | {empty state UI} | {message} |
| Error | {component} | {error boundary/toast} | {recovery action} |

### Performance

| Item | Target | Measurement | Optimization |
|------|--------|-------------|--------------|
| LCP | < 2.5s | Lighthouse | {strategy} |
| Bundle size | < {size} | Build output | {code splitting strategy} |
| Re-renders | Minimal | React DevTools | {memo/useMemo strategy} |

### Accessibility

| Item | Requirement | Implementation |
|------|-------------|----------------|
| Keyboard nav | All interactive elements | {tab order, focus management} |
| Screen reader | Semantic HTML + ARIA | {aria labels, roles} |
| Color contrast | WCAG AA (4.5:1) | {contrast check tool} |
| Focus visible | Clear focus indicator | {focus-visible styles} |

> If this section is empty, user experience will suffer - Must complete
```
