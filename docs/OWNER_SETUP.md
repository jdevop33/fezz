# Owner Account Setup Guide

This guide will walk you through setting up the initial owner account for your Fezz application. The owner account has full administrative privileges and is required for managing your platform.

## First-Time Setup

When you first deploy your application, no owner account exists. Follow these steps to create your owner account:

1. Start your application
   ```
   npm run dev
   ```

2. Navigate to the setup page in your browser:
   ```
   http://localhost:5173/setup
   ```

3. You'll see the "System Setup" page with two options:
   - **Create New Account**: Create a new user account with owner privileges (recommended for first-time setup)
   - **Use Existing Account**: Promote an existing user to owner status

4. For a new installation, select "Create New Account" and fill in:
   - Email Address
   - Owner Name
   - Password
   - Confirm Password

5. Click "Create Owner Account" and wait for the confirmation screen.

6. Once setup completes, you'll be automatically redirected to the admin dashboard.

## Security Measures

The setup page has several security measures:

1. **Access Restriction**: Once an owner exists, the setup page becomes inaccessible.

2. **Uniqueness Check**: The system prevents creating multiple owner accounts through normal channels.

3. **Emergency Access**: In emergencies, an admin token can be used to access the setup page:
   ```
   http://localhost:5173/setup?admin-setup=YOUR_TOKEN
   ```

## Verification

To verify that your owner account has been correctly set up, run:

```
node scripts/verify-owner-setup.js
```

This script will:
- Check if an owner account exists
- Display owner details if found
- Provide setup instructions if needed
- Generate an emergency admin token for secure storage

## Important Notes

- Only create one owner account for your platform
- The owner account can create additional admin accounts through the admin dashboard
- Keep your owner credentials secure - this account has full access to manage your entire platform
- If you need to recover access, use the emergency admin token provided by the verification script

## Next Steps

After creating your owner account:

1. Log in with your owner credentials
2. Navigate to the admin dashboard
3. Set up any additional admin accounts needed for your team
4. Configure system settings
5. Manage products and other content

For more information on administrative functions, refer to the [Admin Guide](/docs/ADMIN_GUIDE.md).