# Gene Carlo Gallardo - Portfolio Website

A professional portfolio website for Gene Carlo Gallardo, Applied AI Engineer and Systems Developer, built according to comprehensive Product Requirements Document specifications.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Dark Mode**: Professional dark theme with carefully selected color palette  
- **Smooth Animations**: Intersection Observer-based animations with reduced motion support
- **Project Showcase**: Detailed project cards with modal overlays for in-depth case studies
- **SEO Optimized**: Semantic HTML, Open Graph tags, and structured data
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading with 90+ Lighthouse scores

## 🏗️ Architecture

### Tech Stack
- **HTML5**: Semantic markup with proper accessibility attributes
- **CSS3**: Custom properties, Grid, Flexbox, and modern responsive techniques
- **Vanilla JavaScript**: No dependencies, optimized for performance
- **Google Fonts**: Inter font family for typography
- **Formspree**: Contact form handling (requires setup)

### File Structure
```
gene-portfolio/
├── index.html          # Main HTML file with all sections
├── styles.css          # Complete CSS with design system
├── script.js           # JavaScript for interactions and animations  
├── cv.pdf              # Gene's CV (needs to be added)
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Local Development
1. Clone or download the portfolio files
2. Add Gene's CV as `cv.pdf` in the root directory
3. Open `index.html` in a modern web browser
4. For live development, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   ```

### 2. Contact Form Setup
1. Create a Formspree account at https://formspree.io
2. Create a new form and get your form endpoint
3. Replace `your-form-id` in index.html with your actual Formspree form ID:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### 3. Deployment Options

#### Option A: Vercel (Recommended)
1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import the repository
4. Configure custom domain if desired
5. Deploy automatically on every commit

#### Option B: Netlify
1. Drag and drop the folder to Netlify dashboard, or
2. Connect GitHub repository to Netlify
3. Configure custom domain
4. Enable form handling for contact form

#### Option C: GitHub Pages
1. Create a GitHub repository
2. Upload files to repository
3. Enable GitHub Pages in repository settings
4. Configure custom domain if desired

### 4. Custom Domain Setup
1. Purchase domain (recommended: `genecarlogallardo.com`)
2. Configure DNS settings:
   - For Vercel: Add CNAME record pointing to `cname.vercel-dns.com`
   - For Netlify: Add CNAME record pointing to your Netlify subdomain
   - For custom hosting: Point A records to your server IP
3. Update Open Graph URLs in index.html

## 🎨 Customization

### Design System
The CSS uses custom properties for easy customization:

```css
:root {
    --bg-primary: #0D1117;      /* Main background */
    --bg-secondary: #161B22;    /* Card backgrounds */
    --text-primary: #F0F6FC;    /* Headings */
    --text-secondary: #8B949E;  /* Body text */
    --accent-blue: #2F81F7;     /* Links and CTAs */
    --accent-emerald: #3FB950;  /* Success states */
    --accent-amber: #D29922;    /* Warning states */
}
```

### Content Updates
1. **Personal Information**: Update contact details in the Contact section
2. **Project Data**: Modify `projectData` object in script.js
3. **Skills**: Update skill pills in the Skills section
4. **Experience**: Update timeline entries in the Experience section
5. **Education**: Update education cards in the Education section

### Adding New Projects
1. Add project card HTML in the Projects section
2. Add project data to `projectData` object in script.js
3. Create unique project ID and update `onclick` handler

## 📊 Performance

### Optimization Features
- **CSS**: Minified and optimized selectors
- **JavaScript**: Throttled scroll events and efficient DOM queries
- **Images**: Recommend WebP format for any added images
- **Fonts**: Preconnect to Google Fonts with display=swap
- **Animations**: Respect `prefers-reduced-motion` setting

### Expected Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 100

## 🔍 SEO Features

### Implemented
- Semantic HTML structure
- Meta descriptions and Open Graph tags
- Structured data (Person schema)
- Clean URLs and navigation
- Mobile-friendly design
- Fast loading times

### To Add After Deployment
- Google Analytics or Plausible
- Google Search Console verification
- XML sitemap submission
- Social media profile verification

## 🧪 Testing

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Responsive Testing
- Mobile: 375px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px+
- Wide: 1280px+

### Accessibility Testing
- Keyboard navigation throughout
- Screen reader compatibility
- Color contrast ratios meet AA standards
- Focus indicators visible
- Alt text for all images

## 📝 Content Guidelines

### Writing Style (from PRD)
- First person, direct, and confident
- No "aspiring" or "passionate about" language
- Quantify wherever possible
- Avoid unnecessary jargon
- Short sentences preferred
- Active voice throughout

### Project Descriptions
Each project should include:
1. Clear problem statement
2. Solution overview
3. Key features
4. Technical approach
5. Measurable outcomes
6. Lessons learned

## 🔄 Maintenance

### Regular Updates
- Keep contact information current
- Add new projects as they're completed
- Update skills as they're acquired
- Refresh experience section
- Monitor and fix any broken links

### Performance Monitoring
- Check Lighthouse scores quarterly
- Monitor Core Web Vitals
- Test on latest browsers
- Validate HTML and CSS
- Check accessibility compliance

## 📞 Support

For technical issues or customization needs related to this portfolio:
1. Check this README for common solutions
2. Review the code comments for implementation details
3. Test changes locally before deploying
4. Keep backups of working versions

## 📄 License

This portfolio template is created specifically for Gene Carlo Gallardo. The code structure and design system can be referenced for educational purposes, but please create your own unique content and branding.

---

**Built with attention to detail and performance. Ready for professional deployment.** 🚀