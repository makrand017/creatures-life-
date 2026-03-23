document.addEventListener('DOMContentLoaded', () => {
    // 0. Global Elements
    const heroTitle = document.getElementById('hero-title');
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');
    
    // 1. Preloader & Initial Animations
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
            // Trigger hero title reveal after preloader
            if (heroTitle) {
                const text = heroTitle.textContent;
                heroTitle.textContent = '';
                [...text].forEach((letter, i) => {
                    const span = document.createElement('span');
                    span.textContent = letter === ' ' ? '\u00A0' : letter;
                    span.classList.add('letter');
                    span.style.transitionDelay = `${i * 0.1}s`;
                    heroTitle.appendChild(span);
                });
                
                setTimeout(() => {
                    heroTitle.classList.add('revealed');
                }, 500);
            }
        }, 2000);
    });

    // 2. Custom Cursor (Magnetic Effect)
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        dotX += (mouseX - dotX);
        dotY += (mouseY - dotY);
        if (cursorDot) cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        if (cursorOutline) cursorOutline.style.transform = `translate(${outlineX - 12}px, ${outlineY - 12}px)`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .res-card, .gallery-item, .view-details-btn, .floor-tab-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(200, 205, 214, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '30px';
                cursorOutline.style.height = '30px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    // 3. Section Transitions & Title Parallax
    const heroVideo = document.querySelector('.hero-video');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar state
        if (scrolled > 80) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Hero Parallax
        if (scrolled < window.innerHeight && heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.4}px)`;
        }

        // Scroll Progress Bar
        if (scrollProgress) {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolledPct = (scrolled / height) * 100;
            scrollProgress.style.width = scrolledPct + "%";
        }
    });

    // 4. Count Up Animation for Vision Stats
    const countUp = (element) => {
        const target = +element.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 20;
        const increment = target / (duration / stepTime);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    };

    // 5. Intersection Observer for Reveals and Stats
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.id === 'vision') {
                    entry.target.querySelectorAll('.stat-number').forEach(num => {
                        if (!num.classList.contains('counted')) {
                            countUp(num);
                            num.classList.add('counted');
                        }
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 6. Residence Modal Logic
    const modal = document.getElementById('residence-modal');
    const collectionData = {
        "1": { label: "COLLECTION ONE", name: "THE SKY STUDIO", size: "650 SQ FT", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", desc: "The Sky Studio reimagines urban efficiency.", view: "City Skyline" },
        "2": { label: "COLLECTION TWO", name: "THE CLOUD RESIDENCE", size: "1,200 SQ FT", img: "https://images.unsplash.com/photo-1600607687940-47a61d6ec67a?auto=format&fit=crop&w=1200&q=80", desc: "Defined by its expansive wraparound terrace.", view: "Triple Aspect / River" },
        "3": { label: "COLLECTION THREE", name: "THE APEX PENTHOUSE", size: "3,400 SQ FT", img: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1200&q=80", desc: "The pinnacle of CREATURES LIFE.", view: "360° Panoramic" }
    };

    const openModal = (id) => {
        const data = collectionData[id];
        if (!data) return;
        document.getElementById('modal-img').src = data.img;
        document.getElementById('modal-label').textContent = data.label;
        document.getElementById('modal-name').textContent = data.name;
        document.getElementById('modal-size').textContent = data.size;
        document.getElementById('modal-view').textContent = data.view;
        document.getElementById('modal-description').textContent = data.desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openModal(e.target.closest('.res-card').getAttribute('data-collection')));
    });

    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

    // 7. Amenities Horizontal Scroll
    const scrollRow = document.querySelector('.amenities-scroll-row');
    const amntProgressBar = document.querySelector('.amenities-progress-bar');
    if (scrollRow) {
        scrollRow.addEventListener('scroll', () => {
            const progress = (scrollRow.scrollLeft / (scrollRow.scrollWidth - scrollRow.clientWidth)) * 100;
            if (amntProgressBar) amntProgressBar.style.width = `${progress}%`;
        });
        document.querySelector('.next-arrow')?.addEventListener('click', () => scrollRow.scrollBy({ left: 380, behavior: 'smooth' }));
        document.querySelector('.prev-arrow')?.addEventListener('click', () => scrollRow.scrollBy({ left: -380, behavior: 'smooth' }));
    }

    // 8. Gallery Multi-Mode Logic
    const galleryImages = [
        { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", title: "Celestial Living Room", desc: "Double-height volumes bathed in perpetual light." },
        { src: "https://images.unsplash.com/photo-1600607687940-47a61d6ec67a?auto=format&fit=crop&w=1200&q=80", title: "Infinity Terrace", desc: "Seamless transitions between sky and sanctuary." },
        { src: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1200&q=80", title: "The Apex Interior", desc: "Crafted with the rarest silver-veined marble." },
        { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", title: "Kinetic Architecture", desc: "A silhouette that breathes with the wind." },
        { src: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80", title: "Zero-G Wellness", desc: "Hydrotherapy pools suspended above the city." }
    ];

    let currentGalleryIndex = 0;
    const lbImg = document.getElementById('lightbox-img');
    const lbCounter = document.getElementById('lightbox-counter');
    const lb = document.getElementById('lightbox');

    const updateLightbox = () => {
        if (lbImg) lbImg.src = galleryImages[currentGalleryIndex].src;
        if (lbCounter) lbCounter.textContent = `${String(currentGalleryIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
    };

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            currentGalleryIndex = parseInt(item.dataset.index);
            updateLightbox();
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', () => {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    });

    // 9. Floor Plans Tab Logic
    const tabUnderline = document.querySelector('.tab-sliding-underline');
    const floorTabBtns = document.querySelectorAll('.floor-tab-btn');
    const updateTabUnderline = (btn) => {
        if (tabUnderline) {
            tabUnderline.style.width = `${btn.offsetWidth}px`;
            tabUnderline.style.left = `${btn.offsetLeft}px`;
        }
    };
    floorTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            floorTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateTabUnderline(btn);
        });
    });

    // 10. Contact Form
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        btn.textContent = 'CONNECTING...';
        btn.disabled = true;
        setTimeout(() => {
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'flex';
                    setTimeout(() => successMessage.classList.add('active'), 50);
                }
            }, 600);
        }, 2000);
    });

    // 11. Mobile Menu Logic
    mobileToggle?.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
    });
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle?.classList.remove('active');
            mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});
