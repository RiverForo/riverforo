#!/bin/bash

# RiverForo Deployment Script
# This script helps push the RiverForo application to GitHub and deploy it to Vercel

echo "===== RiverForo Deployment Script ====="
echo "This script will help you push the code to GitHub and deploy to Vercel"
echo ""

# Set variables
REPO_URL="https://github.com/RiverForo/riverforo.git"
DEPLOY_DIR="/home/ubuntu/riverforo-deployment"

echo "Step 1: Preparing the deployment package..."
cd $DEPLOY_DIR

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  echo "Git repository initialized."
else
  echo "Git repository already initialized."
fi

# Configure git user (use placeholder values)
echo "Configuring git user..."
git config user.name "RiverForo Admin"
git config user.email "admin@riverforo.com"
echo "Git user configured."

# Add all files to git
echo "Adding files to git..."
git add .
echo "Files added to git."

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit of RiverForo platform"
echo "Changes committed."

# Add remote repository
echo "Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL
echo "Remote repository added."

echo ""
echo "Step 2: Ready to push to GitHub"
echo "To push the code to GitHub, you'll need to authenticate."
echo "You can use either:"
echo "1. Your GitHub username and password"
echo "2. A Personal Access Token (more secure)"
echo ""
echo "Run the following command to push to GitHub:"
echo "git push -u origin main"
echo ""
echo "After pushing to GitHub, follow these steps to deploy to Vercel:"
echo "1. Go to https://vercel.com and log in"
echo "2. Click 'Add New...' → 'Project'"
echo "3. Select the 'riverforo' repository from the list"
echo "4. Vercel will automatically detect the project configuration"
echo "5. Click 'Deploy'"
echo ""
echo "Once deployed, Vercel will provide a URL (e.g., https://riverforo.vercel.app)"
echo "This is your live RiverForo.com platform!"
echo ""
echo "===== End of Deployment Script ====="
