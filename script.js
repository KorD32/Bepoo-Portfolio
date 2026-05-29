// Lightbox functionality
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const media = element.querySelector('img, video');
    
    if (media.tagName === 'VIDEO') {
        const video = document.createElement('video');
        video.src = media.src;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '85vh';
        content.innerHTML = '';
        content.appendChild(video);
    } else {
        content.innerHTML = `<img src="${media.src}" alt="${media.alt}">`;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop any playing video
        const video = document.querySelector('#lightbox-content video');
        if (video) video.pause();
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox({ target: { classList: { contains: () => true } } });
    }
});

// Scroll animation with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Create floating pixel particles
function createPixels() {
    const gridBg = document.querySelector('.grid-bg');
    if (!gridBg) return;
    
    const pixelCount = 20;
    
    for (let i = 0; i < pixelCount; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        
        // Random position
        pixel.style.left = Math.random() * 100 + '%';
        
        // Random size (4-8px for variety)
        const size = Math.floor(Math.random() * 2 + 1) * 4;
        pixel.style.width = size + 'px';
        pixel.style.height = size + 'px';
        
        // Random animation delay and duration
        pixel.style.animationDelay = Math.random() * 15 + 's';
        pixel.style.animationDuration = (Math.random() * 10 + 12) + 's';
        
        gridBg.appendChild(pixel);
    }
}

// Initialize observers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, ' +
        '.section-header, .about-text, .skills-section, .skills-list, ' +
        '.contact-content, .contact-links, .portfolio-hero, .portfolio-toolbar, ' +
        '.portfolio-show-more-container, footer'
    );
    fadeElements.forEach(el => observer.observe(el));
    
    initFeaturedProjectsShowMore();
    initPortfolioShowMore();
    initClientsMarquee();
    createPixels();
});

function initPageTransitions() {
    document.body.classList.add('page-ready');

    requestAnimationFrame(() => {
        document.body.classList.add('page-visible');
    });

    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            const url = new URL(link.href, window.location.href);
            const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
            const isSamePageHash = url.pathname === window.location.pathname && url.hash;

            if (
                isModifiedClick ||
                link.target === '_blank' ||
                link.hasAttribute('download') ||
                !href ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                url.origin !== window.location.origin ||
                isSamePageHash
            ) {
                return;
            }

            event.preventDefault();
            document.body.classList.add('page-leaving');

            window.setTimeout(() => {
                window.location.href = url.href;
            }, 220);
        });
    });
}

function initClientsMarquee() {
    const track = document.querySelector('#clients .clients-track');
    const primaryList = track?.querySelector('.clients-list:not([aria-hidden="true"])');

    if (!track || !primaryList) return;

    track.querySelectorAll('.clients-list[aria-hidden="true"]').forEach(list => list.remove());

    const duplicateList = primaryList.cloneNode(true);
    duplicateList.setAttribute('aria-hidden', 'true');

    duplicateList.querySelectorAll('a').forEach(link => {
        link.setAttribute('tabindex', '-1');
    });

    duplicateList.querySelectorAll('img').forEach(image => {
        image.setAttribute('alt', '');
    });

    track.appendChild(duplicateList);
}

function initFeaturedProjectsShowMore() {
    const featuredGrid = document.getElementById('featured-projects-grid');
    const showMoreButton = document.getElementById('featured-show-more');

    if (!featuredGrid || !showMoreButton) return;

    showMoreButton.addEventListener('click', () => {
        featuredGrid.classList.remove('is-collapsed');

        const revealedCards = featuredGrid.querySelectorAll('.featured-project-card:nth-child(n+4)');
        revealedCards.forEach(card => {
            observer.observe(card);
            card.classList.add('visible');
        });

        showMoreButton.hidden = true;
    });
}

function initPortfolioShowMore() {
    const portfolioGrids = document.querySelectorAll('.portfolio-page .portfolio-grid.portfolio-collapsible');

    portfolioGrids.forEach(grid => {
        const showMoreButton = grid.nextElementSibling?.querySelector('[data-show-more-grid]');
        if (!showMoreButton) return;

        const updateButtonState = () => {
            if (!grid.classList.contains('is-collapsed')) {
                showMoreButton.hidden = true;
                return;
            }

            const hiddenCards = Array.from(grid.querySelectorAll(':scope > .portfolio-item'))
                .filter(card => getComputedStyle(card).display === 'none');

            showMoreButton.hidden = hiddenCards.length === 0;
        };

        showMoreButton.addEventListener('click', () => {
            grid.classList.remove('is-collapsed');

            const revealedCards = grid.querySelectorAll(':scope > .portfolio-item');
            revealedCards.forEach(card => {
                observer.observe(card);
                card.classList.add('visible');
            });

            const hiddenItems = document.getElementById('hidden-items');
            if (hiddenItems && grid.closest('#models')) {
                hiddenItems.classList.add('show');
                hiddenItems.querySelectorAll('.portfolio-item').forEach(item => {
                    observer.observe(item);
                    item.classList.add('visible');
                });
            }

            showMoreButton.hidden = true;
        });

        updateButtonState();
        window.addEventListener('resize', updateButtonState);
    });
}


// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Video hover play functionality
document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.portfolio-item video');
    
    videoItems.forEach(video => {
        const parent = video.closest('.portfolio-item');
        
        parent.addEventListener('mouseenter', () => {
            video.play().catch(() => {
                // Video play failed, likely due to autoplay restrictions
            });
        });
        
        parent.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
});

// Load More Items functionality
function loadMoreItems() {
    const hiddenItems = document.getElementById('hidden-items');
    const viewMoreBtn = document.getElementById('view-more-btn');
    
    if (hiddenItems) {
        // Show hidden items
        hiddenItems.classList.add('show');
        
        // Observe new fade-in elements for animations
        const newItems = hiddenItems.querySelectorAll('.portfolio-item');
        newItems.forEach(item => observer.observe(item));
        
        // Hide the "View More" button
        if (viewMoreBtn) {
            viewMoreBtn.style.display = 'none';
        }
        
        // Smooth scroll to the new items
        hiddenItems.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
