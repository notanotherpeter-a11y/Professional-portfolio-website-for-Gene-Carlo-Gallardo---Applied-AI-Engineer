#!/bin/bash

# Portfolio Deployment Script
# Gene Carlo Gallardo Portfolio

echo "🚀 Starting portfolio deployment process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
print_status "Checking required files..."

if [ ! -f "index.html" ]; then
    print_error "index.html not found!"
    exit 1
fi

if [ ! -f "styles.css" ]; then
    print_error "styles.css not found!"
    exit 1
fi

if [ ! -f "script.js" ]; then
    print_error "script.js not found!"
    exit 1
fi

print_success "All required files found"

# Check for CV file
if [ ! -f "cv.pdf" ]; then
    print_warning "cv.pdf not found - remember to add Gene's CV file"
    echo "You can add it later and redeploy"
fi

# Validate HTML (if html-validate is available)
if command -v npx &> /dev/null; then
    print_status "Validating HTML structure..."
    if npx html-validate index.html 2>/dev/null; then
        print_success "HTML validation passed"
    else
        print_warning "HTML validation skipped (validator not available)"
    fi
fi

# Check for deployment platform
echo
echo "Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) GitHub Pages"
echo "4) Manual upload instructions"
echo "5) Skip deployment"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_status "Preparing for Vercel deployment..."
        if command -v vercel &> /dev/null; then
            echo "Running: vercel --prod"
            vercel --prod
        else
            print_warning "Vercel CLI not installed"
            echo "Install with: npm i -g vercel"
            echo "Then run: vercel --prod"
        fi
        ;;
    2)
        print_status "Preparing for Netlify deployment..."
        if command -v netlify &> /dev/null; then
            echo "Running: netlify deploy --prod --dir=."
            netlify deploy --prod --dir=.
        else
            print_warning "Netlify CLI not installed"
            echo "Install with: npm i -g netlify-cli"
            echo "Then run: netlify deploy --prod --dir=."
        fi
        ;;
    3)
        print_status "GitHub Pages deployment instructions:"
        echo "1. Create a new repository on GitHub"
        echo "2. Upload all files to the repository"
        echo "3. Go to Settings > Pages"
        echo "4. Select 'Deploy from a branch'"
        echo "5. Choose 'main' branch and '/ (root)'"
        echo "6. Save and wait for deployment"
        ;;
    4)
        print_status "Manual deployment instructions:"
        echo "1. Upload all files to your web server"
        echo "2. Ensure index.html is in the root directory"
        echo "3. Configure your domain to point to the server"
        echo "4. Test the website functionality"
        echo "5. Submit sitemap.xml to Google Search Console"
        ;;
    5)
        print_status "Deployment skipped"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Post-deployment checklist
echo
print_status "Post-deployment checklist:"
echo "□ Test website on mobile and desktop"
echo "□ Verify contact form works (if Formspree configured)"
echo "□ Check all internal links"
echo "□ Validate CV download link"
echo "□ Test social media links"
echo "□ Submit to Google Search Console"
echo "□ Set up Google Analytics (optional)"
echo "□ Update LinkedIn profile with website URL"

print_success "Deployment process completed!"
echo
echo "🌟 Your portfolio is ready to showcase your AI engineering expertise!"
echo "📝 Remember to keep your projects and experience updated"
echo "📊 Monitor performance with regular Lighthouse checks"

# Final reminder
if [ ! -f "cv.pdf" ]; then
    echo
    print_warning "Don't forget to add cv.pdf and redeploy!"
fi