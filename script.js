// Smooth scrolling and navigation
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(13, 17, 23, 0.95)';
        } else {
            nav.style.background = 'rgba(13, 17, 23, 0.8)';
        }
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fact-card, .skill-group, .project-card, .timeline-item, .education-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Staggered animation for skill pills
    const skillGroups = document.querySelectorAll('.skill-group');
    skillGroups.forEach(group => {
        const pills = group.querySelectorAll('.skill-pill');
        pills.forEach((pill, index) => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(20px)';
            pill.style.transition = `opacity 0.4s ease-out ${index * 0.1}s, transform 0.4s ease-out ${index * 0.1}s`;
        });

        const groupObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pills.forEach(pill => {
                        pill.style.opacity = '1';
                        pill.style.transform = 'translateY(0)';
                    });
                    groupObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        groupObserver.observe(group);
    });
});

// Project modal functionality
const projectData = {
    project1: {
        title: "3000 Auto Spa: On-Demand Service Marketplace",
        status: "Built",
        statusClass: "status-built",
        description: "A comprehensive dual-sided mobile marketplace platform for on-demand mobile car detailing services.",
        
        problem: "The Australian mobile detailing market lacked a seamless, professional booking experience. Customers struggled to find reliable services, while service providers had limited tools for managing bookings and routing efficiently.",
        
        solution: "Built a complete ecosystem consisting of customer mobile app, service provider app, and centralised admin dashboard. The platform handles everything from initial booking to payment processing and service completion.",
        
        features: [
            "Customer mobile app with real-time booking",
            "Service provider app with job management",
            "Admin dashboard with analytics and oversight",
            "Intelligent job routing and assignment",
            "Real-time push notifications",
            "Integrated payment processing",
            "Performance analytics and reporting",
            "Multi-service offering management"
        ],
        
        tech: "React Native for mobile apps, Node.js backend, MongoDB database, real-time notifications, geolocation services, payment gateway integration",
        
        outcome: "Platform built and pending App Store submission. Ready for deployment across Melbourne market with expansion plans for national rollout.",
        
        learnings: [
            "Mobile-first design critical for on-demand services",
            "Real-time communication essential for service coordination",
            "Admin oversight tools crucial for marketplace quality control"
        ]
    },
    
    project2: {
        title: "Autonomous AI Customer Service Agent",
        status: "Deployed",
        statusClass: "status-deployed",
        description: "An intelligent conversational AI system that autonomously handles customer enquiries and books appointments.",
        
        problem: "Small businesses were losing potential customers due to delayed responses to enquiries, while staff time was consumed by repetitive communication tasks. After-hours enquiries often went unanswered.",
        
        solution: "Developed an AI agent that understands business context, handles common enquiries, books appointments, and escalates complex issues to humans when appropriate. The system operates 24/7 and maintains conversation context across multiple touchpoints.",
        
        features: [
            "Context-aware dialogue management",
            "Intelligent appointment scheduling",
            "Human escalation logic",
            "Multi-business deployment capability",
            "Configurable business personas",
            "Follow-up communication automation",
            "Integration with existing booking systems",
            "Performance analytics and conversation logs"
        ],
        
        tech: "LLM APIs (OpenAI, Claude), custom conversation flow engine, webhook integrations, calendar API connections, database for context storage",
        
        outcome: "Successfully deployed across multiple client businesses. Handling 80%+ of routine enquiries autonomously, with 24-hour average response time improvement.",
        
        learnings: [
            "Context persistence crucial for natural conversations",
            "Clear escalation triggers prevent customer frustration",
            "Business-specific training data significantly improves accuracy"
        ]
    },
    
    project3: {
        title: "Tax and Invoice Management System",
        status: "Deployed",
        statusClass: "status-deployed",
        description: "An intelligent financial platform that automates invoicing, GST tracking, and compliance reporting for small businesses.",
        
        problem: "Small business owners spent excessive time on manual bookkeeping tasks, often making errors in GST calculations and missing important financial reporting deadlines.",
        
        solution: "Built an automated system that generates invoices, tracks GST obligations, parses financial documents, and produces compliance-ready reports. The platform reduces manual data entry by 90% while improving accuracy.",
        
        features: [
            "Automated invoice generation and tracking",
            "GST calculation and compliance reporting",
            "Document parsing and data extraction",
            "Expense categorization and tracking",
            "Financial dashboard with key metrics",
            "Integration with accounting software",
            "Automated backup and data security",
            "Multi-business entity support"
        ],
        
        tech: "Python for document processing, machine learning for data extraction, React frontend, PostgreSQL database, PDF generation libraries, accounting software APIs",
        
        outcome: "Deployed and actively used by multiple small businesses. Users report 75% time savings on bookkeeping tasks and 100% accuracy improvement in GST reporting.",
        
        learnings: [
            "Document parsing accuracy critical for financial applications",
            "User-friendly interfaces essential for non-technical business owners",
            "Automated compliance features provide significant value"
        ]
    },
    
    project4: {
        title: "Lead Generation and Directory Engine",
        status: "Deployed",
        statusClass: "status-deployed", 
        description: "An automated pipeline that harvests and enriches business contact information from public directories at scale.",
        
        problem: "Sales teams spent hours manually researching prospects and building contact lists, often with incomplete or outdated information. The process was time-consuming and inconsistent.",
        
        solution: "Created an intelligent scraping engine that automatically discovers, extracts, and enriches business contact data from multiple public sources. The system deduplicates information and outputs CRM-ready contact lists.",
        
        features: [
            "Multi-source data extraction",
            "Intelligent deduplication algorithms", 
            "Contact information enrichment",
            "Geographic and industry filtering",
            "CRM-compatible export formats",
            "Data quality scoring and validation",
            "Automated update cycles",
            "Compliance with data protection regulations"
        ],
        
        tech: "Python web scraping frameworks, data processing pipelines, machine learning for deduplication, API integrations, database optimization, cloud deployment",
        
        outcome: "Processing thousands of business records weekly. Sales teams report 10x improvement in lead research efficiency and 40% increase in contact accuracy.",
        
        learnings: [
            "Data quality is more valuable than data quantity",
            "Automated enrichment significantly improves conversion rates",
            "Compliance considerations must be built-in from the start"
        ]
    },
    
    project5: {
        title: "Syntyx Labs: AI SaaS Product Studio",
        status: "Active",
        statusClass: "status-active",
        description: "Gene's software development studio specializing in AI-powered business tools and automation platforms.",
        
        problem: "Small and medium businesses needed enterprise-grade AI capabilities but lacked the budget and technical expertise to build custom solutions.",
        
        solution: "Established a product studio that builds, tests, and delivers AI-powered tools specifically designed for SMB operations. Focus on practical business value rather than technical complexity.",
        
        features: [
            "AI receptionist and customer service tools",
            "Business intelligence and analytics platforms", 
            "Process automation and workflow tools",
            "Custom AI agent development",
            "Integration with existing business systems",
            "Ongoing support and optimization",
            "Scalable SaaS deployment models",
            "Industry-specific solution customization"
        ],
        
        tech: "Full-stack development across multiple technologies, AI/ML model integration, cloud infrastructure, SaaS architecture, API development, database design",
        
        outcome: "Active client base with deployed solutions. Proven track record of delivering practical AI tools that generate measurable business value.",
        
        learnings: [
            "SMB clients value simplicity and reliability over advanced features",
            "Industry-specific customization drives adoption",
            "Ongoing support relationships are crucial for success"
        ]
    }
};

// Open project modal
function openProject(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const project = projectData[projectId];
    
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="project-detail">
            <div class="project-detail-header">
                <div class="project-detail-title-section">
                    <h2 class="project-detail-title">${project.title}</h2>
                    <span class="status-badge ${project.statusClass}">${project.status}</span>
                </div>
                <p class="project-detail-description">${project.description}</p>
            </div>
            
            <div class="project-detail-content">
                <section class="project-detail-section">
                    <h3>The Problem</h3>
                    <p>${project.problem}</p>
                </section>
                
                <section class="project-detail-section">
                    <h3>What Was Built</h3>
                    <p>${project.solution}</p>
                    <div class="project-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </section>
                
                <section class="project-detail-section">
                    <h3>How It Was Built</h3>
                    <p><strong>Technical Approach:</strong> ${project.tech}</p>
                </section>
                
                <section class="project-detail-section">
                    <h3>Outcome</h3>
                    <p>${project.outcome}</p>
                </section>
                
                ${project.learnings ? `
                <section class="project-detail-section">
                    <h3>Key Learnings</h3>
                    <ul>
                        ${project.learnings.map(learning => `<li>${learning}</li>`).join('')}
                    </ul>
                </section>
                ` : ''}
            </div>
            
            <div class="project-detail-footer">
                <button class="btn btn-primary" onclick="closeProject()">← Back to Projects</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add styles for project detail modal
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            .project-detail {
                padding: 2rem;
                max-width: 100%;
            }
            
            .project-detail-header {
                margin-bottom: 2rem;
                padding-bottom: 2rem;
                border-bottom: 1px solid var(--border);
            }
            
            .project-detail-title-section {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .project-detail-title {
                color: var(--text-primary);
                font-size: 2rem;
                font-weight: 600;
                line-height: 1.3;
                margin: 0;
                flex: 1;
                min-width: 300px;
            }
            
            .project-detail-description {
                color: var(--text-secondary);
                font-size: 1.125rem;
                line-height: 1.6;
                margin: 0;
            }
            
            .project-detail-content {
                margin-bottom: 2rem;
            }
            
            .project-detail-section {
                margin-bottom: 2rem;
            }
            
            .project-detail-section h3 {
                color: var(--text-primary);
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .project-detail-section h4 {
                color: var(--text-primary);
                font-size: 1.125rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                margin-top: 1rem;
            }
            
            .project-detail-section p {
                color: var(--text-secondary);
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .project-detail-section ul {
                color: var(--text-secondary);
                line-height: 1.6;
            }
            
            .project-detail-section li {
                margin-bottom: 0.5rem;
                padding-left: 0.5rem;
            }
            
            .project-features {
                margin-top: 1rem;
                padding: 1.5rem;
                background: var(--bg-secondary);
                border-radius: 8px;
                border: 1px solid var(--border);
            }
            
            .project-detail-footer {
                padding-top: 2rem;
                border-top: 1px solid var(--border);
                text-align: center;
            }
            
            @media (max-width: 767px) {
                .project-detail {
                    padding: 1rem;
                }
                
                .project-detail-title {
                    font-size: 1.5rem;
                    min-width: auto;
                }
                
                .project-detail-title-section {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Close project modal
function closeProject() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Modal close events
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close modal when clicking the X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProject);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProject();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProject();
        }
    });
});

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // Form will be handled by Formspree
            // Add any client-side validation or UI feedback here
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Re-enable button after a delay (Formspree will handle the actual submission)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
});

// ===== HERO CANVAS: Neural Network Particle Animation =====
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');

    const CONFIG = {
        count: 72,
        maxDist: 140,
        baseSpeed: 0.35,
        mouseRadius: 180,
        mouseRepel: 0.018,
        colors: ['#2F81F7', '#58A6FF', '#3FB950', '#388bfd'],
        lineColor: '47, 129, 247',
    };

    let width, height, particles;
    const mouse = { x: -9999, y: -9999 };
    let animId;

    function resize() {
        width  = canvas.width  = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;
    }

    function spawn() {
        particles = Array.from({ length: CONFIG.count }, () => ({
            x:  Math.random() * width,
            y:  Math.random() * height,
            vx: (Math.random() - 0.5) * CONFIG.baseSpeed,
            vy: (Math.random() - 0.5) * CONFIG.baseSpeed,
            r:  Math.random() * 1.8 + 0.8,
            color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
            alpha: Math.random() * 0.4 + 0.35,
        }));
    }

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function tick() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion
            const mx = mouse.x - p.x;
            const my = mouse.y - p.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < CONFIG.mouseRadius && md > 0) {
                const force = (1 - md / CONFIG.mouseRadius) * CONFIG.mouseRepel;
                p.vx -= (mx / md) * force;
                p.vy -= (my / md) * force;
            }

            // Dampen + clamp
            p.vx *= 0.992;
            p.vy *= 0.992;
            const spd = Math.hypot(p.vx, p.vy);
            if (spd > CONFIG.baseSpeed * 2.5) {
                p.vx = (p.vx / spd) * CONFIG.baseSpeed * 2.5;
                p.vy = (p.vy / spd) * CONFIG.baseSpeed * 2.5;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Soft bounce
            if (p.x < 0)      { p.x = 0;     p.vx *= -1; }
            if (p.x > width)  { p.x = width;  p.vx *= -1; }
            if (p.y < 0)      { p.y = 0;      p.vy *= -1; }
            if (p.y > height) { p.y = height; p.vy *= -1; }

            // Draw node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Draw edges to nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d  = Math.hypot(dx, dy);
                if (d < CONFIG.maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${(1 - d / CONFIG.maxDist) * 0.25})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(tick);
    }

    resize();
    spawn();
    tick();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        resize();
        spawn();
        tick();
    });
}

// ===== 3D CARD TILT =====
function init3DCardTilt() {
    const cards = document.querySelectorAll('.project-card, .fact-card, .education-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
        });

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width  / 2;
            const cy = rect.height / 2;

            const maxTilt = card.classList.contains('project-card') ? 8 : 6;
            const rotX = ((y - cy) / cy) * -maxTilt;
            const rotY = ((x - cx) / cx) *  maxTilt;

            const glowX = (x / rect.width)  * 100;
            const glowY = (y / rect.height) * 100;

            card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
            card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(47,129,247,0.09) 0%, var(--bg-tertiary) 65%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease, background 0.5s ease, border-color 0.2s ease, box-shadow 0.2s ease';
            card.style.transform  = '';
            card.style.background = '';
        });
    });
}

// ===== 3D TIMELINE SLIDE-IN =====
function initTimelineReveal() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateX(0) perspective(600px) rotateY(0deg)';
                }, i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(el => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateX(-40px) perspective(600px) rotateY(-8deg)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        obs.observe(el);
    });
}

// ===== INIT ALL 3D EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    init3DCardTilt();
    initTimelineReveal();
});

// Utility function for smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Performance optimization: throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    highlightNavLink();
    revealOnScroll();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);
// Hero live clock (Melbourne time)
(function () {
    const el = document.getElementById('hero-clock');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Australia/Melbourne'
    });
    const tick = () => { el.textContent = fmt.format(new Date()) + ' AEST'; };
    tick();
    setInterval(tick, 30000);
})();

// Projects — cursor-follow hover reveal
(function () {
    const preview = document.getElementById('reveal-preview');
    const wrap = document.getElementById('projects-reveal');
    if (!preview || !wrap) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const numEl = preview.querySelector('.reveal-preview-num');
    const titleEl = preview.querySelector('.reveal-preview-title');
    const cards = wrap.querySelectorAll('.project-card');

    let targetX = 0, targetY = 0, curX = 0, curY = 0, active = false, rafId = null;

    const loop = () => {
        curX += (targetX - curX) * 0.18;
        curY += (targetY - curY) * 0.18;
        preview.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${active ? 1 : 0.9})`;
        rafId = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
        targetX = e.clientX + 24;
        targetY = e.clientY + 24;
        if (!rafId) rafId = requestAnimationFrame(loop);
    };

    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            active = true;
            const num = card.dataset.revealNum || '00';
            const title = card.dataset.revealTitle || 'Project';
            const hue = card.dataset.revealHue || '210';
            numEl.textContent = `[ ${num} ]`;
            titleEl.textContent = title;
            preview.style.setProperty('--reveal-hue', hue);
            preview.classList.add('is-active');
        });
        card.addEventListener('mouseleave', () => {
            active = false;
            preview.classList.remove('is-active');
        });
    });

    document.addEventListener('mousemove', onMove, { passive: true });
})();

// FX: Split-text reveal on hero display
(function () {
    const el = document.querySelector('.hero-display[data-split-text]');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lines = el.querySelectorAll('.hero-display-line');
    let idx = 0;
    lines.forEach((line) => {
        const text = line.textContent;
        line.textContent = '';
        for (const ch of text) {
            const span = document.createElement('span');
            span.className = 'split-char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.setProperty('--split-delay', reduce ? '0s' : `${0.04 * idx + 0.15}s`);
            line.appendChild(span);
            idx++;
        }
    });
    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('is-revealed'));
    });
})();

// FX: Cursor spotlight
(function () {
    const sp = document.getElementById('fx-spotlight');
    if (!sp) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, rafId = null, shown = false;
    const loop = () => {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        sp.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        rafId = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!shown) { sp.classList.add('is-on'); shown = true; }
        if (!rafId) rafId = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
        sp.classList.remove('is-on');
        shown = false;
    });
})();

// FX: Project card layered parallax
(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
        let rafId = null, px = 0, py = 0;
        const apply = () => {
            card.style.setProperty('--px', px.toFixed(3));
            card.style.setProperty('--py', py.toFixed(3));
            rafId = null;
        };
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            px = ((e.clientX - r.left) / r.width - 0.5) * 2;   // -1 … 1
            py = ((e.clientY - r.top) / r.height - 0.5) * 2;
            if (!rafId) rafId = requestAnimationFrame(apply);
        }, { passive: true });
        card.addEventListener('mouseleave', () => {
            px = 0; py = 0;
            if (!rafId) rafId = requestAnimationFrame(apply);
        });
    });
})();

// ── Chat Widget ──────────────────────────────────────────────────────────────
(function () {
    const FAQ = [
        {
            triggers: ['who are you', 'about yourself', 'introduce', 'tell me about you'],
            answer: "I'm Gene Carlo Gallardo — Applied AI Engineer and Systems Developer based in Melbourne, VIC, Australia. I run Syntyx Labs Pty Ltd and build AI-powered business systems for clients across Australia: ERPs, CRMs, automation pipelines, animated websites, and custom software that replaces manual work."
        },
        {
            triggers: ['what do you do', 'services', 'what can you build', 'what do you offer', 'help me with'],
            answer: "I build custom business systems:\n• ERP / management dashboards\n• CRM + outreach automation\n• Auto quote & pricing software\n• Animated websites (WebGL, Three.js, scroll effects)\n• AI booking bots & chatbots\n• LinkedIn & email outreach automation\n• Full-stack web apps (React + Supabase + Cloudflare)\n\nMy sweet spot: turning messy manual processes — spreadsheets, WhatsApp groups, paper forms — into clean, automated software."
        },
        {
            triggers: ['what have you built', 'projects', 'portfolio', 'work examples', 'show me'],
            answer: "Recent builds:\n• Manok Manifesto ERP — inventory, POS, payroll for an F&B business\n• Restaurant commissary management system with multi-branch inventory\n• Restaurant ERP with QR ordering + kitchen display system\n• Animated portfolio + landing websites (Three.js, WebGL, scroll effects)\n• Auto quote software — instant pricing calculator for service businesses\n• CRM + outreach dashboard for a 3PL warehousing company (2,800+ prospects)\n• AI tradie booking bot for Australian tradies\n• LinkedIn + email automation system for a logistics client\n• Daily AI-written blog pipeline with SEO/GEO optimisation"
        },
        {
            triggers: ['how much', 'price', 'cost', 'pricing', 'rates', 'charge', 'quote'],
            answer: "Typical ranges (AUD):\n• Custom ERP systems: from $5–8K setup + $300/mo maintenance\n• Websites + animated landing pages: from $3,500 setup\n• AI booking bots + chatbots: from $3,500 setup + $700/mo\n• CRM + outreach automation: from $4K setup\n• Auto quote software: from $2,500 setup\n\nEvery project is scoped individually. Email genecarlogallardo@gmail.com or call 0420 418 888 for a free consult."
        },
        {
            triggers: ['available', 'hire', 'work with', 'take on', 'freelance', 'open to'],
            answer: "Yes — currently open to new projects. I've got clients across Australia and work remote-first. Best first step: email genecarlogallardo@gmail.com with a quick description of what you need and I'll get back to you within 24 hours."
        },
        {
            triggers: ['contact', 'reach you', 'get in touch', 'email', 'phone', 'call', 'whatsapp'],
            answer: "📧 genecarlogallardo@gmail.com\n📞 0420 418 888\n💬 WhatsApp: 0420 418 888\n💼 linkedin.com/in/gene-carlo-gallardo\n\nOr scroll to the contact form below — I reply within 24 hours."
        },
        {
            triggers: ['experience', 'background', 'history', 'cv', 'resume', 'worked at'],
            answer: "Business development contractor and Applied AI Engineer based in Melbourne. Running Syntyx Labs Pty Ltd — building software for clients across F&B, logistics, and real estate since 2024.\n\nDownload my CV from the nav above for the full picture."
        },
        {
            triggers: ['tech', 'stack', 'technologies', 'tools', 'languages', 'framework'],
            answer: "Primary stack:\n• React + Vite + Tailwind + shadcn/ui (frontend)\n• Supabase (database + auth)\n• Cloudflare Workers + Hono (APIs + cron jobs)\n• Python (automation, scraping, AI pipelines)\n• Claude AI SDK + LangChain + n8n (AI & workflow automation)\n• Three.js + WebGL (animated / 3D websites)\n• Playwright (browser automation)\n• GitHub Pages + Vercel + Cloudflare Pages (deployment)"
        },
        {
            triggers: ['location', 'melbourne', 'remote', 'where', 'australia', 'philippines'],
            answer: "Based in Melbourne, VIC, Australia. I've got clients across Australia — remote-first, happy to meet in person if you're in Melbourne."
        },
        {
            triggers: ['company', 'business name', 'syntyx', 'abn', 'registered'],
            answer: "Gene Carlo operates under Syntyx Labs Pty Ltd — an Australian registered business (ABN: 18 681 990 692) based in Melbourne, VIC. We build AI-powered software systems for SMBs."
        },
        {
            triggers: ['industries', 'clients', 'who do you work with', 'what industry', 'niche'],
            answer: "Industries I've built for:\n• Food & beverage (ERPs, POS, kitchen display systems)\n• Logistics & warehousing (CRM, outreach automation)\n• Hospitality (booking bots, management systems)\n• Real estate (lead automation)\n• Trades & services (booking bots, auto quote tools)\n• Professional services (portfolios, LinkedIn automation)\n\nIf your business has repetitive manual work, I can automate it."
        },
        {
            triggers: ['ai', 'artificial intelligence', 'automation', 'chatbot', 'bot'],
            answer: "AI is the core of what I build. Current specialisations:\n• AI chatbots + booking bots (Claude AI SDK)\n• Automated email + LinkedIn outreach sequences\n• AI-generated content pipelines (daily blog posts, social content)\n• LLM-powered data extraction and lead research\n• Workflow automation (n8n, Cloudflare Workers, Python)\n\nAll built on the latest models — Claude 3.5/3.7, GPT-4, and open-source alternatives."
        },
        {
            triggers: ['blog', 'writing', 'posts', 'articles', 'notes'],
            answer: "Check out the Notes & Writing section on this page — articles on building ERPs, the ROI of custom software, Cloudflare Workers for automation, and AI workflows for Australian SMBs. New posts published regularly!"
        }
    ];

    const DEFAULT = "Not sure about that one! For specific questions, reach Gene Carlo directly:\n📧 genecarlogallardo@gmail.com\n📞 0420 418 888";

    function findAnswer(text) {
        const lower = text.toLowerCase().trim();
        for (const item of FAQ) {
            if (item.triggers.some(t => lower.includes(t))) return item.answer;
        }
        return DEFAULT;
    }

    function addMsg(text, type) {
        const msgs = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = 'chat-msg ' + type;
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function handleMessage(text) {
        if (!text.trim()) return;
        const sug = document.getElementById('chat-suggestions');
        if (sug) sug.style.display = 'none';
        addMsg(text, 'user');
        setTimeout(() => addMsg(findAnswer(text), 'bot'), 320);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const trigger  = document.getElementById('chat-trigger');
        const panel    = document.getElementById('chat-panel');
        const closeBtn = document.getElementById('chat-close');
        const input    = document.getElementById('chat-input');
        const send     = document.getElementById('chat-send');
        if (!trigger || !panel) return;

        trigger.addEventListener('click', function () {
            panel.classList.toggle('open');
            if (panel.classList.contains('open')) input.focus();
        });
        closeBtn.addEventListener('click', function () { panel.classList.remove('open'); });

        document.querySelectorAll('.chat-suggestion').forEach(function (btn) {
            btn.addEventListener('click', function () { handleMessage(btn.textContent); });
        });

        send.addEventListener('click', function () { handleMessage(input.value); input.value = ''; });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { handleMessage(input.value); input.value = ''; }
        });
    });
})();
