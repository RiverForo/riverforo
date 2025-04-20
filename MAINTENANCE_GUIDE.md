# RiverForo.com Maintenance Guide

This document provides comprehensive instructions for maintaining the RiverForo.com platform after deployment.

## Administration

### Accessing Admin Panel

1. Navigate to https://riverforo.vercel.app/admin (or your custom domain)
2. Log in with the admin credentials:
   - Username: admin
   - Password: riverplate85

### User Management

#### Creating Moderators
1. Go to Admin Panel → Users
2. Find the user you want to promote
3. Click "Edit User"
4. Change their role to "moderator"
5. Click "Save Changes"

#### Banning Users
1. Go to Admin Panel → Users
2. Find the problematic user
3. Click "Edit User"
4. Check the "Ban User" option
5. Optionally add a ban reason
6. Click "Save Changes"

### Content Management

#### Creating Categories
1. Go to Admin Panel → Categories
2. Click "Add New Category"
3. Fill in the details:
   - Name (in Spanish and English)
   - Description (in Spanish and English)
   - Slug (URL-friendly name)
   - Order (display position)
   - Permissions
4. Click "Create Category"

#### Pinning Threads
1. Go to the thread you want to pin
2. Click the "..." menu
3. Select "Pin Thread"
4. The thread will appear at the top of its category

#### Locking Threads
1. Go to the thread you want to lock
2. Click the "..." menu
3. Select "Lock Thread"
4. Users will no longer be able to post replies

## Technical Maintenance

### Database Backup

It's recommended to regularly back up your MongoDB database:

1. Log in to MongoDB Atlas
2. Navigate to your cluster
3. Click "..." menu → "Back Up"
4. Choose backup method (continuous or on-demand)
5. Follow the prompts to complete the backup

### Updating the Application

When you need to update the application:

1. Make changes to your local copy
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel will automatically deploy the updates

For major updates:
1. Create a new branch in GitHub
2. Make and test your changes
3. Create a pull request
4. Review and merge to main
5. Vercel will deploy the updated version

### Monitoring

Monitor your application's performance:

1. Vercel Dashboard: Provides deployment logs and basic metrics
2. MongoDB Atlas: Offers database performance metrics
3. Set up error logging with a service like Sentry (optional)

## Monetization Management

### Google AdSense

To update ad placements:

1. Go to Admin Panel → Ads
2. Select the ad placement to edit
3. Update the AdSense code
4. Click "Save Changes"

To add new ad placements:
1. Go to Admin Panel → Ads
2. Click "Add New Placement"
3. Fill in the details:
   - Name
   - Location
   - AdSense code
   - Display options
4. Click "Create Placement"

## Multilingual Support

### Adding/Editing Translations

1. Go to Admin Panel → Languages
2. Select the language to edit
3. Update translations for interface elements
4. Click "Save Changes"

### Adding New Languages

1. Go to Admin Panel → Languages
2. Click "Add New Language"
3. Enter the language name and code
4. Provide translations for all interface elements
5. Click "Create Language"

## Troubleshooting

### Common Issues

#### Slow Performance
- Check MongoDB Atlas metrics for database issues
- Review Vercel deployment logs for backend errors
- Consider upgrading your MongoDB Atlas or Vercel plan if traffic increases

#### Authentication Issues
- Verify JWT_SECRET is properly set in environment variables
- Check user credentials in the database
- Ensure cookies are being properly set and stored

#### Real-time Features Not Working
- Verify Pusher credentials are correct
- Check Pusher dashboard for connection issues
- Ensure client-side code is properly subscribing to channels

## Support Resources

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Vercel Documentation: https://vercel.com/docs
- Pusher Documentation: https://pusher.com/docs
- React Documentation: https://reactjs.org/docs

For additional support, contact the development team at admin@riverforo.com.
