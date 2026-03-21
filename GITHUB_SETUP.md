# 🚀 GitHub Setup Instructions

## ✅ Git Repository Initialized
Your portfolio is now ready to push to GitHub! I've:
- ✅ Initialized git repository
- ✅ Added .gitignore file
- ✅ Made initial commit with all files
- ✅ Ready for GitHub remote setup

## 📋 NEXT STEPS (You need to do these):

### STEP 1: Create GitHub Repository
1. **Go to:** https://github.com/notanotherpeter
2. **Click:** "New repository" (green button)
3. **Repository name:** `portfolio` or `gene-portfolio` 
4. **Description:** "Professional portfolio website for Gene Carlo Gallardo - Applied AI Engineer"
5. **Public/Private:** Choose Public (recommended for portfolio)
6. **DON'T initialize** with README, .gitignore, or license (we already have these)
7. **Click:** "Create repository"

### STEP 2: Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these in terminal:

```bash
# Navigate to portfolio folder
cd /Users/king/.openclaw/workspace/gene-portfolio

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/notanotherpeter/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### STEP 3: Enable GitHub Pages (Free Hosting!)
1. **Go to your new repository** on GitHub
2. **Click:** Settings tab
3. **Scroll to:** Pages section (left sidebar)
4. **Source:** Deploy from a branch
5. **Branch:** main
6. **Folder:** / (root)
7. **Click:** Save

**Your portfolio will be live at:** `https://notanotherpeter.github.io/portfolio`

### STEP 4: Optional - Custom Domain Setup
If you buy `genecarlo.com`:
1. **In GitHub Pages settings:** Add custom domain: `genecarlo.com`
2. **In domain registrar:** Add CNAME record pointing to `notanotherpeter.github.io`
3. **Wait 24 hours** for DNS propagation

## 🎯 COMMANDS SUMMARY

```bash
# In terminal, copy these commands one by one:

cd /Users/king/.openclaw/workspace/gene-portfolio

git remote add origin https://github.com/notanotherpeter/portfolio.git

git branch -M main

git push -u origin main
```

## ✅ AFTER SETUP

**Free hosting options:**
- **GitHub Pages:** `https://notanotherpeter.github.io/portfolio`
- **With custom domain:** `https://genecarlo.com`

**Benefits:**
- ✅ Free hosting forever
- ✅ Automatic deployments on file changes
- ✅ Version control for portfolio updates
- ✅ Professional GitHub presence

## 🔄 FUTURE UPDATES

To update your live portfolio:
```bash
cd /Users/king/.openclaw/workspace/gene-portfolio
git add .
git commit -m "Update portfolio content"
git push
```
Website updates automatically within minutes!

## 🚨 IMPORTANT
Don't forget to update the domain URLs in the files if you get a custom domain!