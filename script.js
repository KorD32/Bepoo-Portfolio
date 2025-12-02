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
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale, ' +
        '.section-header, .about-text, .skills-section, .skills-list, ' +
        '.contact-content, .contact-links, footer'
    );
    fadeElements.forEach(el => observer.observe(el));
    
    createPixels();
});


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

