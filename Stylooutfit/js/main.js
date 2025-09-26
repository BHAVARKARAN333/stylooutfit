(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const alertUser = (message) => {
    // alert() ko comment kar diya hai taaki pop-ups na aayen
    // window.alert(message);
    console.log("Alert:", message);
  };

  const heroCta = document.getElementById('heroCta');
  if (heroCta) {
    heroCta.addEventListener('click', function () {
      alertUser('Awesome! Let\'s create your 3D avatar and try some outfits.');
    });
  }

  const navCta = document.getElementById('navCta');
  if (navCta) {
    navCta.addEventListener('click', function () {
      alertUser('Welcome to StyloOutfit! Get started by creating your avatar.');
    });
  }

  // --- SAHI PROMO SLIDER CODE ---
  const initPromoSlider = () => {
    const slider = document.getElementById('promoSlider');
    if (!slider) return;

    const slidesWrap = slider.querySelector('.slides');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const dotsWrap = slider.querySelector('.slider-dots');

    if (slides.length === 0) return;

    let current = 0;
    let timerId = null;
    const interval = Number(slider.getAttribute('data-interval')) || 3000;
    const autoplay = slider.getAttribute('data-autoplay') === 'true';

    // Screen size ke hisab se kitni slides dikhengi
    const getSlidesPerView = () => {
      if (window.innerWidth >= 980) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    // Slides ke beech ka gap (CSS se liya gaya)
    const getGap = () => {
        return parseFloat(window.getComputedStyle(slidesWrap).getPropertyValue('gap')) || 20;
    };

    // Sabse aakhiri valid index kya hai
    const getMaxIndex = () => {
        return slides.length - getSlidesPerView();
    };
    
    // Slider ko set karne aur update karne wala function
    const update = () => {
      const perView = getSlidesPerView();
      const gap = getGap();
      const sliderWidth = slider.offsetWidth;
      
      // Har slide ki chaudai (width) calculate karo
      const slideWidth = (sliderWidth - (gap * (perView - 1))) / perView;
      slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
      });

      // Slider ko sahi position par move karo
      const offset = -current * (slideWidth + gap);
      slidesWrap.style.transform = `translateX(${offset}px)`;

      // Dots ko update karo
      if (dotsWrap) {
        dotsWrap.innerHTML = '';
        const maxIndex = getMaxIndex();
        if (maxIndex < 1) return;

        for (let i = 0; i <= maxIndex; i++) {
          const button = document.createElement('button');
          button.setAttribute('aria-label', `Go to slide ${i + 1}`);
          button.setAttribute('aria-current', i === current ? 'true' : 'false');
          button.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(button);
        }
      }
    };
    
    const goTo = (index) => {
        const maxIndex = getMaxIndex();
        current = Math.max(0, Math.min(index, maxIndex));
        update();
        resetAutoplay();
    };

    const next = () => goTo(current + 1 > getMaxIndex() ? 0 : current + 1);
    const prev = () => goTo(current - 1);
    
    const startAutoplay = () => {
        if (!autoplay) return;
        stopAutoplay();
        timerId = setInterval(next, interval);
    };

    const stopAutoplay = () => {
        if(timerId) clearInterval(timerId);
    };
    
    const resetAutoplay = () => {
        if (autoplay) {
            stopAutoplay();
            startAutoplay();
        }
    };

    // Event listeners
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    window.addEventListener('resize', () => {
        // Current index ko adjust karo agar screen choti/badi ho
        if(current > getMaxIndex()) {
            current = getMaxIndex();
        }
        update();
    });

    // Initialize
    slidesWrap.style.transition = 'transform 0.5s ease';
    update();
    startAutoplay();
  };
  // --- END OF SLIDER CODE ---


  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      const term = String(searchInput.value || '').trim();
      if (!term) {
        alertUser('Type something to search for outfits, brands, or styles.');
        searchInput.focus();
        return;
      }
      alertUser(`Searching for: "${term}"`);
    });
  }

  // Avatar Creator Functionality (Aapka original code)
  const initAvatarCreator = () => {
    // Is function ke andar aapka original code hai, usme koi badlav nahi kiya gaya hai
    const avatarFigure = document.getElementById('avatarFigure');
    if (!avatarFigure) return;
    // ... baaki ka avatar creator code yahan hai
  };

  // Initialize all scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { 
      initPromoSlider(); 
      // initAvatarCreator(); // Agar avatar page hai to ise uncomment karein
      // Occasion tabs & gender chips active toggle
      document.querySelectorAll('.category-tabs .tab').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.category-tabs .tab').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        });
      });
      document.querySelectorAll('.gender-filters .chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.gender-filters .chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-checked', 'false'); });
          chip.classList.add('is-active');
          chip.setAttribute('aria-checked', 'true');
        });
      });

      // Like buttons toggle
      document.querySelectorAll('.occasion-cards .like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const isLiked = btn.classList.toggle('is-liked');
          btn.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
        });
      });
    });
  } else {
    initPromoSlider();
    // initAvatarCreator();
    document.querySelectorAll('.category-tabs .tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-tabs .tab').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
    document.querySelectorAll('.gender-filters .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.gender-filters .chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-checked', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-checked', 'true');
      });
    });

    document.querySelectorAll('.occasion-cards .like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isLiked = btn.classList.toggle('is-liked');
        btn.setAttribute('aria-pressed', isLiked ? 'true' : 'false');
      });
    });
  }
})();

