# RiverForo.com Deployment Package

This package contains everything you need to deploy RiverForo.com, a comprehensive forum platform for River Plate fans with Spanish language support and Google AdSense integration.

## Package Contents

1. **Backend Code**
   - Complete Express.js API with all forum functionality
   - Authentication system with JWT and social login
   - MongoDB models and controllers
   - Pusher integration for real-time features

2. **Frontend Code**
   - React application with River Plate branding
   - Responsive design for all devices
   - Multilingual support (Spanish/English)
   - Google AdSense integration

3. **Database Scripts**
   - MongoDB initialization script
   - Initial data setup (categories, admin user, welcome thread)

4. **Deployment Configuration**
   - Vercel configuration files
   - Environment variables setup
   - GitHub repository structure

5. **Documentation**
   - Step-by-step deployment instructions
   - Database setup guide
   - Maintenance procedures
   - User and admin guides

## Deployment Steps Overview

1. **Set Up GitHub Repository**
   - Create repository under RiverForo username
   - Upload code from this package

2. **Initialize MongoDB Database**
   - Run the database initialization script locally
   - Verify data creation

3. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Configure environment variables
   - Deploy application

4. **Verify Deployment**
   - Test application functionality
   - Verify multilingual support
   - Check Google AdSense integration

5. **Connect Custom Domain**
   - Set up riverforo.com domain in Vercel
   - Configure DNS settings

## Access Information

- **Admin Account**
  - Username: admin
  - Password: riverplate85

- **MongoDB Atlas**
  - Connection String: mongodb+srv://rodimargonari:riverplate85@river-foro-cluster0.dr5mydi.mongodb.net/?retryWrites=true&w=majority&appName=River-Foro-Cluster0

- **Pusher**
  - App ID: 1978163
  - Key: 2baff66ce4eb56c9ecc1
  - Secret: ff5ad14bd7af680622dc
  - Cluster: us2

## Support

For any questions or issues during deployment, please refer to the detailed documentation included in this package or contact support@riverforo.com.
