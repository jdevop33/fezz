# Pouches Worldwide Platform

A premium e-commerce platform for selling tobacco-free nicotine pouches to wholesale, distributor, and retail customers. Winners

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/jdevop33/fezz)

## Features

- Multi-role user system (retail, wholesale, distributor, admin)
- Product catalog with filtering by flavor, strength, etc.
- Shopping cart with local storage persistence
- Order processing and management
- Wholesale pricing and commission tracking
- Admin dashboard for product, user and order management
- Responsive, mobile-friendly design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **Build Tools**: Vite, ESLint
- **Deployment**: Firebase Hosting

## Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd fezz
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Database Initialization

To initialize the database with sample products and user roles, add the `?init-db` query parameter to the URL:

```
http://localhost:5173/?init-db
```

## Environment Variables

Create `.env.local` for development or use `.env.production` for production:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Feature flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment to Firebase

1. Install the Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize the Firebase project:
```bash
firebase init
```
Select the following options:
- Firestore
- Hosting
- Storage

4. Deploy to Firebase:
```bash
npm run deploy
```

Or, to only deploy the frontend:
```bash
npm run deploy:hosting
```

## Performance Optimizations

The application includes several performance optimizations:

- Code splitting with lazy loading for routes
- Bundle splitting for better caching
- Firebase optimizations (batched writes, efficient queries)
- Image optimization
- Cache headers for static assets
- Preconnect to critical domains
- Font loading optimizations

## License

MIT