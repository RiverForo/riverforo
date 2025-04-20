# RiverForo.com Deployment Instructions

This document provides comprehensive instructions for deploying the RiverForo.com platform using your Vercel, MongoDB Atlas, and Pusher accounts.

## Prerequisites

Before deployment, ensure you have:

1. A GitHub account (username: RiverForo)
2. A Vercel account (connected to your GitHub)
3. A MongoDB Atlas account with a cluster created
4. A Pusher account with an app created

## Deployment Steps

### Step 1: Clone the Repository

1. Create a new repository on GitHub named "riverforo"
2. Clone this deployment package to your local machine
3. Push the code to your GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/RiverForo/riverforo.git
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas

1. Log in to your MongoDB Atlas account
2. Navigate to your cluster (River-Foro-Cluster0)
3. Run the initialization script provided in `/init_mongodb.js` to set up:
   - Collections and indexes
   - Admin user (username: admin, password: riverplate85)
   - Initial categories and content

You can run this script using MongoDB Compass or the MongoDB Shell.

### Step 3: Configure Vercel Deployment

1. Log in to your Vercel account
2. Click "Import Project" and select your GitHub repository
3. Configure the following environment variables:

```
MONGODB_URI=mongodb+srv://rodimargonari:riverplate85@river-foro-cluster0.dr5mydi.mongodb.net/?retryWrites=true&w=majority&appName=River-Foro-Cluster0
JWT_SECRET=riverplate85_secret_key
PUSHER_APP_ID=1978163
PUSHER_KEY=2baff66ce4eb56c9ecc1
PUSHER_SECRET=ff5ad14bd7af680622dc
PUSHER_CLUSTER=us2
```

4. Set the build command to: `npm run build`
5. Set the output directory to: `build`

### Step 4: Deploy to Vercel

1. Click "Deploy" to start the deployment process
2. Vercel will build and deploy your application
3. Once deployed, you'll receive a URL (e.g., riverforo.vercel.app)

### Step 5: Verify Deployment

1. Visit your deployment URL
2. Test the following functionality:
   - User registration and login
   - Social login (Google, Facebook)
   - Creating and viewing threads
   - Posting replies
   - Multilingual support (Spanish/English)
   - Real-time notifications
   - Google AdSense integration

### Step 6: Connect Custom Domain (Optional)

To connect your riverforo.com domain:

1. In Vercel, go to your project settings
2. Click on "Domains"
3. Add your custom domain (riverforo.com)
4. Follow Vercel's instructions to update DNS settings in GoDaddy

## Admin Access

After deployment, you can access the admin panel at `/admin` with:
- Username: admin
- Password: riverplate85

## Troubleshooting

If you encounter issues during deployment:

1. **MongoDB Connection Issues**:
   - Verify your IP address is whitelisted in MongoDB Atlas
   - Check that the connection string is correct

2. **Vercel Deployment Failures**:
   - Check the build logs for specific errors
   - Ensure all environment variables are correctly set

3. **Pusher Integration Issues**:
   - Verify Pusher credentials are correct
   - Check that the Pusher channels are properly configured

## Support

For additional support or questions about the deployment process, please contact the development team.

---

© 2025 RiverForo.com - All Rights Reserved
