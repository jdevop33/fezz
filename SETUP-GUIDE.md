# Complete Setup Guide for Fezz

This guide provides step-by-step instructions to set up, migrate data, and deploy the Fezz application.

## 1. Initial Setup

### Environment Setup

Set up your environment variables:

```bash
npm run create-env
```

This creates a `.env` file with Firebase configuration.

### Firestore Database Setup

1. Go to https://console.firebase.google.com/project/fezz-452821/firestore
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users
5. Click "Enable"

## 2. Data Migration

If you're migrating from Supabase to Firebase:

1. Add your Supabase credentials to the `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Run the migration script:
   ```bash
   npm run migrate
   ```

3. Verify migration results in the console and `migration-results.json`

## 3. Local Development

Start the development server:

```bash
npm run dev
```

Visit http://localhost:5173/ to see your application running.

## 4. Initial Owner Setup

1. Register a regular user through the signup page
2. Navigate to the setup page: `/setup`
3. Enter the email and password of the user you want to promote to owner
4. Click "Create Owner Account"

Now this user has owner privileges and can manage admins and system settings.

## 5. Deployment

### Manual Deployment

Deploy to Firebase Hosting:

```bash
npm run deploy
```

### CI/CD Setup

1. Generate a Firebase token:
   ```bash
   firebase login:ci
   ```

2. Set up GitHub repository secrets:
   - `FIREBASE_TOKEN`: The token generated above
   - `FIREBASE_API_KEY`: Your Firebase API key
   - `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `FIREBASE_APP_ID`: Your Firebase app ID

3. Push to your GitHub repository's main branch to trigger deployment

## 6. Troubleshooting

### "Not Found" Issues

If you're seeing "Not Found" errors after deployment, check:

1. Firebase Hosting configuration in `firebase.json`
2. Routes in `App.tsx`
3. Browser console for JavaScript errors
4. See `DEPLOYMENT-FIXES.md` for more details

### Authentication Issues

If users can't log in:

1. Check Firebase Authentication is enabled in the Firebase console
2. Verify your Firebase configuration

### Database Access Issues

If users can't access data:

1. Verify Firestore security rules in `firestore.rules`
2. Check user permissions in the code

## 7. Ongoing Maintenance

### Rollbacks

If you need to rollback to a previous version:

1. Go to GitHub Actions > "Rollback Firebase Hosting"
2. Click "Run workflow" and follow the prompts

### Adding New Features

1. Create a new branch
2. Implement the feature
3. Create a pull request
4. Review the preview deployment
5. Merge to main when ready

## Related Documentation

- [CICD.md](CICD.md) - CI/CD pipeline details
- [MIGRATION.md](MIGRATION.md) - Detailed migration instructions 
- [DEPLOYMENT-FIXES.md](DEPLOYMENT-FIXES.md) - Fixes for common deployment issues
- [README-CICD.md](README-CICD.md) - CI/CD setup instructions