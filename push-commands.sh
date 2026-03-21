#!/bin/bash
# Portfolio Git Push Commands
# Run these after creating the repository on GitHub

cd /Users/king/.openclaw/workspace/gene-portfolio

# Remove the conflicting remote
git remote remove origin

# Add the correct remote for new repository
git remote add origin https://github.com/notanotherpeter-a11y/portfolio.git

# Push to the new repository
git push -u origin main

echo "✅ Portfolio pushed successfully to GitHub!"
echo "🌐 Your repository: https://github.com/notanotherpeter-a11y/portfolio"
echo "⚙️ Pages settings: https://github.com/notanotherpeter-a11y/portfolio/settings/pages"