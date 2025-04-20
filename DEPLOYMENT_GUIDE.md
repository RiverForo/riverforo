# RiverForo Deployment Guide

This document provides step-by-step instructions for deploying the RiverForo.com platform to Vercel using GitHub integration.

## Prerequisites

- GitHub account (username: RiverForo)
- Vercel account
- MongoDB Atlas account with configured database
- Pusher account with configured application

## Deployment Steps

### 1. Create GitHub Repository

1. Log in to GitHub with the RiverForo account
2. Create a new repository named "riverforo"
3. Make the repository public or private based on your preference

### 2. Push Code to GitHub

```bash
# Initialize git repository
cd /home/ubuntu/riverforo-deployment
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit of RiverForo platform"

# Add remote repository
git remote add origin https://github.com/RiverForo/riverforo.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel

1. Log in to Vercel (https://vercel.com)
2. Click "Import Project" or "New Project"
3. Select the GitHub repository "RiverForo/riverforo"
4. Vercel will automatically detect the project configuration
5. Confirm the following settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: None (uses configuration from vercel.json)
   - Output Directory: None (uses configuration from vercel.json)
6. Click "Deploy"

### 4. Verify Deployment

1. Once deployment is complete, Vercel will provide a URL (e.g., https://riverforo.vercel.app)
2. Visit the URL to verify the application is working correctly
3. Test key functionality:
   - User registration and login
   - Viewing forum categories
   - Creating and viewing threads
   - Real-time notifications

### 5. Connect Custom Domain (Future Step)

1. In the Vercel dashboard, go to the project settings
2. Click on "Domains"
3. Add your custom domain (riverforo.com)
4. Follow Vercel's instructions to configure DNS settings at your domain registrar (GoDaddy)

## Environment Variables

All necessary environment variables are configured in the vercel.json file:

- MongoDB connection string
- Pusher credentials
- JWT configuration
- Admin user details
- Google AdSense client ID

## Maintenance

For future updates:
1. Make changes to the local repository
2. Commit and push to GitHub
3. Vercel will automatically deploy the updates

## Support

If you encounter any issues during deployment, please refer to:
- Vercel documentation: https://vercel.com/docs
- MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- Pusher documentation: https://pusher.com/docs
