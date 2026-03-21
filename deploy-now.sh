#!/bin/bash
echo "🚀 Deploying Gene Carlo Gallardo Portfolio..."

# Add the push script to git
git add push-commands.sh

# Commit any remaining changes  
git commit -m "Add deployment script"

# Add GitHub remote
git remote add origin https://github.com/notanotherpeter-a11y/portfolio.git

# Push to GitHub
git push -u origin main

echo "✅ Portfolio deployed successfully!"
echo "🌐 Repository: https://github.com/notanotherpeter-a11y/portfolio"
echo "⚙️ Configure Pages: https://github.com/notanotherpeter-a11y/portfolio/settings/pages"
echo "🎯 Add custom domain: gene-carlo.com"
