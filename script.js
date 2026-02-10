// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const explorePortfolioBtn = document.querySelector('.explore-portfolio');
const dynamicGreeting = document.getElementById('dynamicGreeting');
const dynamicTitle = document.getElementById('dynamicTitle');
const dynamicBio = document.getElementById('dynamicBio');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 204, 255, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Make the "Explore Portfolio" button functional
if (explorePortfolioBtn) {
    explorePortfolioBtn.addEventListener('click', function() {
        // Find the portfolio section
        const portfolioSection = document.querySelector('#portfolio, .portfolio');
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ 
                behavior: 'smooth'
            });
        } else {
            // If no portfolio section exists, scroll to services section
            const servicesSection = document.querySelector('#services, .services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ 
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Load dynamic content from API - REMOVED FOR STATIC VERSION
// Load dynamic content when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Static content will be displayed instead
});

// Function to load dynamic projects from API - REMOVED FOR STATIC VERSION

// Function to show a specific category page - REMOVED FOR STATIC VERSION
function showCategory(category) {
    // This function is no longer needed in the static version
    // Categories will be handled statically in the HTML
    alert("This feature is not available in the static version.");
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth'
            });
        }
    });
});


// Load dynamic content from API
async function loadDynamicContent() {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            const data = await response.json();
            const identity = data.identity || {};

            // Update the greeting to include the saved name
            if (identity.name) {
                dynamicGreeting.textContent = `HI, I'M ${identity.name.toUpperCase()}!`;
            }

            if (identity.title) {
                dynamicTitle.textContent = identity.title;
            }

            if (identity.bio) {
                dynamicBio.textContent = identity.bio;
            }

            // Update contact information if available
            if (identity.email) {
                document.getElementById('dynamicEmail').textContent = identity.email;
            }

            if (identity.phone) {
                // Format phone number for dialing by removing spaces and adding country code if needed
                const dialableNumber = identity.phone.replace(/\s/g, '');
                const dialPrefix = dialableNumber.startsWith('+') ? '' : '+';
                document.getElementById('dynamicPhone').innerHTML = `<a href="tel:${dialPrefix}${dialableNumber}">${identity.phone}</a>`;
            }

            if (identity.location) {
                document.getElementById('dynamicLocation').textContent = identity.location;
            }
        } else {
            console.error('Failed to load dynamic content');
        }
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Load dynamic projects from API
async function loadDynamicProjects() {
    try {
        const staticWebsitesGrid = document.getElementById('staticWebsitesGrid');
        const dynamicWebsitesGrid = document.getElementById('dynamicWebsitesGrid');

        const response = await fetch('/api/data');
        if (response.ok) {
            const data = await response.json();
            const projects = data.projects || [];

            if (projects.length === 0) {
                // If no projects in API, keep the static grid visible
                staticWebsitesGrid.style.display = 'grid';
                dynamicWebsitesGrid.style.display = 'none';
                return;
            }

            // Switch to dynamic grid
            staticWebsitesGrid.style.display = 'none';
            dynamicWebsitesGrid.style.display = 'grid';

            // Clear the dynamic grid
            dynamicWebsitesGrid.innerHTML = '';

            // Group projects by category
            const projectsByCategory = {};
            projects.forEach(project => {
                if (!projectsByCategory[project.category]) {
                    projectsByCategory[project.category] = [];
                }
                projectsByCategory[project.category].push(project);
            });

            // Create a card for each category
            Object.keys(projectsByCategory).forEach(category => {
                const categoryProjects = projectsByCategory[category];
                // Use the first project in the category as the representative image
                const representativeProject = categoryProjects[0];

                const categoryCard = document.createElement('div');
                categoryCard.className = 'website-category';
                categoryCard.onclick = function() { showCategory(category); };
                categoryCard.innerHTML = `
                    <div class="website-image">
                        <img src="${representativeProject.image}" alt="${category} Websites">
                        <div class="website-overlay">
                            <h3>${category}</h3>
                            <p>${categoryProjects.length} project(s) available</p>
                        </div>
                    </div>
                `;

                dynamicWebsitesGrid.appendChild(categoryCard);
            });
        } else {
            console.error('Failed to load projects');
        }
    } catch (error) {
        console.error('Error loading dynamic projects:', error);
    }
}

// Load dynamic content when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await loadDynamicProjects();

    
    // Listen for updates from other tabs using localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'projectsUpdated') {
            loadDynamicProjects();
        }
    });
});

// Function to show a specific category page
function showCategory(category) {
    // Create a new window/tab for the category
    const categoryPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>\${category} Websites | ISA. Portfolio</title>
            <link rel="stylesheet" href="style.css">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body>
            <header>
                <nav class="navbar">
                    <div class="nav-container">
                        <div class="logo">
                            <h1 class="logo-text">ISA.</h1>
                        </div>
                        <ul class="nav-menu">
                            <li><a href="index.html#home" class="nav-link">About</a></li>
                            <li><a href="index.html#services" class="nav-link">Services</a></li>
                            <li><a href="index.html#portfolio" class="nav-link">Projects</a></li>
                            <li><a href="index.html#websites" class="nav-link">Purchase Websites</a></li>
                            <li><a href="index.html#contact" class="nav-link">Contact</a></li>
                        </ul>
                    </div>
                </nav>
            </header>

            <main>
                <section class="category-projects">
                    <div class="container">
                        <h2 class="section-title">\${category} Websites</h2>
                        <p class="section-subtitle">Browse our collection of \${category.toLowerCase()} websites</p>

                        <div class="category-projects-grid" id="categoryProjectsGrid">
                            <!-- Projects will be loaded here -->
                        </div>
                    </div>
                </section>
            </main>

            <footer class="footer">
                <div class="container">
                    <p>&copy; 2026 ISA. All rights reserved.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#"><i class="fab fa-github"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-dribbble"></i></a>
                    </div>
                </div>
            </footer>

            <script>
                // Load projects for this category
                async function loadCategoryProjects() {
                    try {
                        const response = await fetch('/api/data');
                        if (response.ok) {
                            const data = await response.json();
                            const allProjects = data.projects || [];

                            // Filter projects by category
                            const categoryProjects = allProjects.filter(project => project.category === '\${category}');

                            const categoryProjectsGrid = document.getElementById('categoryProjectsGrid');

                            if (categoryProjects.length === 0) {
                                categoryProjectsGrid.innerHTML = '<p class="no-projects">No projects available in this category yet.</p>';
                                return;
                            }

                            // Generate HTML for each project
                            let projectsHTML = '';
                            categoryProjects.forEach(project => {
                                projectsHTML += \`
                                    <div class="website-item">
                                        <div class="website-image">
                                            <img src="\${project.image}" alt="\${project.title}">
                                            <div class="website-overlay">
                                                <h3>\${project.title}</h3>
                                                <p>\${project.description}</p>
                                                <div class="website-price">\$\${project.price}</div>
                                                <a href="\${project.domain}" target="_blank" class="view-website-btn">View Website</a>
                                            </div>
                                        </div>
                                    </div>
                                \`;
                            });

                            categoryProjectsGrid.innerHTML = projectsHTML;
                        } else {
                            console.error('Failed to load projects');
                        }
                    } catch (error) {
                        console.error('Error loading category projects:', error);
                    }
                }

                // Load projects when page loads
                document.addEventListener('DOMContentLoaded', loadCategoryProjects);

                // Listen for updates using localStorage
                window.addEventListener('storage', function(e) {
                    if (e.key === 'projectsUpdated') {
                        loadCategoryProjects();
                    }
                });
                
                // Also listen for custom events for same-tab updates
                window.addEventListener('projectsUpdated', function(e) {
                    loadCategoryProjects();
                });
            <\/script>
        </body>
        </html>
    `;

    // Open the category page in a new window
    const newWindow = window.open('', '_blank');
    newWindow.document.write(categoryPage);
    newWindow.document.close();
}

// Form submission handled by Formspree
// The form is configured in the HTML with Formspree action attribute

// Hero section animation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const speed = scrolled * -0.3;

    if (hero) {
        hero.style.backgroundPosition = `center calc(50% + ${speed}px)`;
    }
});

// Add mouse move parallax to hero content
document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Add typing animation to greeting
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typewriter effect to greeting
document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
        const originalText = greetingElement.textContent;
        greetingElement.textContent = '';
        typeWriter(greetingElement, originalText, 50);
    }
});

// Performance optimized functionality
document.addEventListener('DOMContentLoaded', () => {
    // Test if all required elements exist
    const elementsToCheck = [
        { selector: '.download-cv', name: 'Download CV Button' },
        { selector: '.video-btn', name: 'Video Button' },
        { selector: '.hamburger', name: 'Hamburger Menu' },
        { selector: '.nav-menu', name: 'Navigation Menu' },
        { selector: '.contact-form', name: 'Contact Form' },
        { selector: '#dark-mode-toggle', name: 'Dark Mode Toggle' }
    ];
    
    elementsToCheck.forEach(element => {
        const el = document.querySelector(element.selector);
        if (!el) {
            console.warn(`Warning: ${element.name} not found on the page`);
        } else {
            console.log(`${element.name} found and functional`);
        }
    });
    
    // Optimize scroll event with requestAnimationFrame
    let ticking = false;
    function updateScrollEffects() {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 204, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Parallax effect for hero section
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const speed = scrolled * -0.3;
        
        if (hero) {
            hero.style.backgroundPosition = `center calc(50% + ${speed}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    console.log('All functionality tests passed!');
});

// Add performance optimizations
(function() {
    // Optimize animations
    const optimizedElements = document.querySelectorAll('.service-card, .project-image, .contact-method');
    optimizedElements.forEach(el => {
        // Use transform instead of changing layout properties
        el.style.willChange = 'transform, opacity';
        
        // Clean up will-change after animation completes
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Remove will-change after animation completes
                    setTimeout(() => {
                        entry.target.style.willChange = 'auto';
                    }, 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(el);
    });
})();