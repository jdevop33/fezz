# CLAUDE.md - Codebase Guidelines

## Commands
- Build: `npm run build` (vite build)
- Dev: `npm run dev` (vite)
- Dev with emulators: `npm run dev:emulate` (uses Firebase emulators)
- Lint: `npm run lint` (eslint .)
- Preview: `npm run preview` (vite preview)
- Deploy: `npm run deploy` (builds and deploys to Firebase)
- Emulators: `npm run emulators` (starts Firebase emulators)
- Test: Currently no tests implemented (use `npm run test`)
- Import products: `npm run import:products` (import catalog data)

## Code Style
- TypeScript with strict typing (noUnusedLocals, noUnusedParameters)
- ESLint flat config with typescript-eslint and react-hooks plugins
- React functional components with hooks (no class components)
- File organization: pages/, components/, lib/
- Naming: PascalCase for components, camelCase for functions/variables
- Imports: grouped by external/internal, no file extensions
- Error handling: try/catch with console.error
- Type definitions using interfaces in lib/types.ts
- React components as .tsx files

## React & State Management
- React Router v6.x with createBrowserRouter
- Context API for global state (AuthContext, ProductContext)
- Custom hooks for data operations (useProducts, useCart, useAuth)
- Firebase for backend data and auth
- Supabase integration available as alternative backend

## Design & UI
- Tailwind CSS with custom plugins (@tailwindcss/forms, typography)
- Form handling with react-hook-form
- Dark mode via ThemeProvider and localStorage
- Toast notifications with sonner
- HeadlessUI for accessible components
- Lucide React for icons
- Responsive design with mobile-first approach

## Firebase Integration
- Authentication: Email/password and Google sign-in
- Firestore for data storage with security rules
- Storage integration with rules for user uploads
- Environment-aware configuration with emulator support
- Migration utilities in scripts/ directory
- DataConnect schema in dataconnect/ directory