document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // Infinite Carousel 3D Logic
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track) {
        // We do NOT set display:flex on the container via JS anymore to avoid layout bugs.
        // The CSS handles layout.

        const updateActiveClasses = () => {
            const slides = Array.from(track.children);
            slides.forEach(slide => slide.classList.remove('active-slide'));

            // To achieve the "Center Focus" look, we always highlight the middle element.
            // With 5 items, index 2 is the middle.
            const centerIndex = Math.floor(slides.length / 2);
            if (slides[centerIndex]) {
                slides[centerIndex].classList.add('active-slide');
            }
        };

        // Initialize Center State
        updateActiveClasses();

        // Move Next (Right Arrow)
        const moveNext = () => {
            // To move "Next", we want the current items to shift Left.
            // After shifting, we take the *first* item and move it to the *end* (append).
            // Then we reset the shift.

            const firstSlide = track.firstElementChild;
            const slideWidth = firstSlide.getBoundingClientRect().width;
            // Get gap from computed style
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            const amountToMove = slideWidth + gap;

            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${amountToMove}px)`;

            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                // Move the first item to the END
                track.appendChild(firstSlide);
                // Reset transform to 0 (since the items physically shifted)
                track.style.transform = 'translateX(0)';
                // Re-calculate active center
                updateActiveClasses();
            }, { once: true });
        };

        // Move Prev (Left Arrow)
        const movePrev = () => {
            // To move "Prev", we shift items Right.
            // First we need to take the *last* item and move it to the *start* (prepend).
            // BUT we must do this instantly and offset the track so it *looks* like nothing happened yet.

            const lastSlide = track.lastElementChild;
            const slideWidth = lastSlide.getBoundingClientRect().width;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            const amountToMove = slideWidth + gap;

            track.style.transition = 'none';
            track.prepend(lastSlide);
            // Offset to the left so the new first item is hidden
            track.style.transform = `translateX(-${amountToMove}px)`;

            // Force reflow
            void track.offsetWidth;

            // Now animate to 0
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = 'translateX(0)';

            track.addEventListener('transitionend', () => {
                updateActiveClasses();
            }, { once: true });
        };

        nextBtn.addEventListener('click', () => {
            // Simple debounce to prevent rapid clicking braking layout
            if (track.style.transition !== 'none' && track.style.transition !== '') return;
            moveNext();
        });

        prevBtn.addEventListener('click', () => {
            movePrev();
        });

        // Auto play (optional, slow)
        // setInterval(moveNext, 5000);
    }

    // Timeline Toggle Logic
    const toggleBtn = document.getElementById('toggle-others');
    const othersSection = document.getElementById('others-timeline');

    if (toggleBtn && othersSection) {
        toggleBtn.addEventListener('click', () => {
            othersSection.classList.toggle('visible');
            const isVisible = othersSection.classList.contains('visible');

            toggleBtn.innerHTML = isVisible
                ? 'Hide Older Experience <i class="fas fa-chevron-up"></i>'
                : 'Show Older Experience <i class="fas fa-chevron-down"></i>';
        });
    }

});
