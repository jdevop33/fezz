# Firebase Setup and Management Guide

This document provides comprehensive instructions for setting up, configuring, and managing the Firebase infrastructure for the Fezz Wholesale Platform.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Firebase Services Used](#firebase-services-used)
3. [Initial Setup](#initial-setup)
4. [Authentication Configuration](#authentication-configuration)
5. [Database Structure](#database-structure)
6. [Storage Configuration](#storage-configuration)
7. [Security Rules](#security-rules)
8. [Deployment Process](#deployment-process)
9. [Environment Management](#environment-management)
10. [Backup and Recovery](#backup-and-recovery)
11. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Project Overview

The Fezz Wholesale Platform uses Firebase as its backend infrastructure, providing authentication, database, storage, and hosting services. The application follows a role-based access control system with five distinct user roles:

- Retail Customer
- Wholesale Buyer
- Distributor
- Administrator
- Owner

Each role has specific permissions and access levels within the application.

## Firebase Services Used

- **Firebase Authentication**: User authentication with email/password and Google sign-in methods
- **Firestore Database**: NoSQL database for storing all application data
- **Firebase Storage**: File storage for product images and user files
- **Firebase Hosting**: Web application hosting
- **Firebase Security Rules**: Access control for database and storage resources

## Initial Setup

### Creating a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if needed
4. Once created, click on "Web" to add a web application
5. Register your app and copy the Firebase config

### Installing Firebase Tools

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select the following features during initialization:
- Firestore
- Storage
- Hosting
- Emulators (optional for local development)

## Authentication Configuration

### Enabling Authentication Methods

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
   - Optional: Enable email verification
3. Enable Google authentication
   - Configure OAuth consent screen if not already done
4. Optional: Add other providers like Facebook, Twitter, or GitHub

### Setting Up Custom Claims for User Roles

Custom claims are used to define user roles. These are set when a user is created or when their role is changed:

```javascript
// Example function to set custom claims (to be used in Firebase Functions)
async function setUserRole(uid, role) {
  await admin.auth().setCustomUserClaims(uid, { role });
}
```

However, our application primarily uses Firestore to store role information, as shown in the user roles system we've implemented.

## Database Structure

The Firestore database is organized into the following collections:

### Collections

1. **users**: User profiles and role information
   - Fields: email, displayName, role, isAdmin, isOwner, approved, status, etc.

2. **products**: Product catalog
   - Fields: itemPN, description, strength, flavor, price, wholesalePrice, etc.

3. **orders**: Customer orders
   - Fields: userId, items, subtotal, tax, shipping, total, status, etc.

4. **transactions**: Payment transactions
   - Fields: orderId, userId, amount, paymentMethod, status, etc.

5. **commissions**: Distributor and wholesale commissions
   - Fields: userId, orderId, amount, status, etc.

6. **settings**: Application settings and configuration
   - Contains documents for user roles, system settings, etc.

## Storage Configuration

Firebase Storage is organized with the following structure:

1. `/profiles/{userId}/*`: User profile images
2. `/products/{productId}/*`: Product images
3. `/orders/{orderId}/*`: Order-related attachments
4. `/catalog/*`: General catalog images

## Security Rules

Security is managed through Firestore and Storage rules:

### Firestore Rules

Located in `firestore.rules`, these rules define who can access what data:

- Products: Public read, admin/owner-only write
- Users: Own data access, admin management
- Orders: Own orders, or admin/distributor access for assigned orders
- Transactions: Own transactions or admin access
- Commissions: Own commissions or admin access
- Settings: Public read, admin-only write

See the file for detailed implementation of helper functions:
- isAuthenticated()
- getUserData()
- isAdmin()
- isSystemOwner()
- isDistributor()
- isWholesale()
- isResourceOwner(userId)
- hasRole(role)

### Storage Rules

Located in `storage.rules`, these rules define access to files:

- Profiles: Public read, owner/admin write
- Products: Public read, admin-only write
- Orders: Limited access based on roles
- Catalog: Public read, admin-only write

## Deployment Process

The application can be deployed using the `deploy.sh` script in the scripts directory:

```bash
./scripts/deploy.sh
```

This script:
1. Checks for service account credentials
2. Asks for deployment target (dev/staging/production)
3. Builds the application
4. Deploys selected components to Firebase
5. Records deployment in the log

### Deployment Best Practices

1. Always test changes in the development environment first
2. Use the staging environment for pre-production testing
3. Deploy to production only after thorough testing
4. Always backup Firestore data before major changes
5. Monitor application immediately after deployment

## Environment Management

The application supports three environments:

1. **Development**: For development work
   - Project: fezz-dev
   - Looser security rules for easier development
   - Uses emulators when possible

2. **Staging**: For pre-production testing
   - Project: fezz-staging
   - Mirrors production configuration
   - Contains test data

3. **Production**: Live environment
   - Project: fezz
   - Strict security rules
   - Real user data

Environment variables are managed through `.env` files and are documented in `.env.example`.

## Backup and Recovery

### Firestore Backup

Regular Firestore backups should be scheduled:

```bash
# Example backup command using gcloud
gcloud firestore export gs://fezz-backups/$(date +%Y-%m-%d)
```

### Recovery Process

To restore from a backup:

```bash
# Example restore command using gcloud
gcloud firestore import gs://fezz-backups/2023-06-01
```

## Monitoring and Maintenance

### Monitoring Tools

1. **Firebase Console**: Basic monitoring for all services
2. **Google Cloud Monitoring**: Advanced metrics and alerting
3. **Error Reporting**: Automatic error tracking

### Regular Maintenance Tasks

1. Review and update security rules every quarter
2. Check and optimize Firestore indexes
3. Delete unnecessary files from Storage
4. Monitor Authentication methods for potential security issues
5. Check usage metrics to ensure you stay within the free tier limits or budget

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [Firestore Data Modeling Guide](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check Firebase CLI is logged in and has permissions
2. **Security rules rejecting valid requests**: Test rules with the Firebase Rules Playground
3. **Firestore indexes missing**: Check error messages for required indexes and add them to `firestore.indexes.json`

For further assistance, contact the development team lead or refer to the internal documentation.