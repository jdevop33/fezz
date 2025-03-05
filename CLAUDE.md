# CLAUDE.md - Codebase Guidelines

## Commands
- Build: `npm run build` (vite build)
- Dev: `npm run dev` (vite)
- Lint: `npm run lint` (eslint .)
- Preview: `npm run preview` (vite preview)

## Code Style
- TypeScript with strict type checking (see tsconfig.json)
- React functional components with hooks
- File organization: pages/, components/, lib/
- Naming: PascalCase for components, camelCase for functions/variables
- Imports: grouped by external/internal, no file extensions
- Error handling: try/catch with console.error
- Type definitions using interfaces
- React components as .tsx files

## React Router
- Using createBrowserRouter with React Router v6.x
- Enabled v7 future flags for better performance and stability
- Lazy loading for route components with suspense fallbacks
- Nested routes for dashboard layout with Outlet pattern
- Type-safe routing with helper functions for auth protection

## Design System
- Color palette: primary (blue), secondary (purple), accent (orange), semantic colors
- Dark mode support with ThemeProvider and localStorage persistence
- CSS utility classes: .btn, .btn-primary, .card, .input
- Font: Inter with font-feature-settings for improved readability
- Spacing: Follow 4px/8px grid system for consistent spacing
- Components: Buttons, cards, modals follow consistent radius
- Responsive: Mobile-first approach with sm/md/lg breakpoints
- Animation system with keyframes for consistent motion
- Accessibility: WCAG AA compliance with proper contrast ratios
- Customized scrollbars for improved UX

## Supabase
- Database migrations in supabase/migrations/
- Connection handling in lib/supabase.ts
- Data fetching with error handling and loading states

## Performance Optimization
- Code splitting with React.lazy() and Suspense
- Tailwind JIT for smaller CSS bundles
- Memoization with React.memo and useMemo where appropriate
- Debounced search inputs
- Optimized re-renders with proper state management