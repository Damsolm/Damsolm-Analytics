document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CURRENCY SELECTOR FUNCTIONALITY (With localStorage Persistence) ---
  const currencyData = {
    USD: { rate: 1, symbol: '$', code: 'USD' },
    GBP: { rate: 0.79, symbol: '£', code: 'GBP' },
    EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
    CAD: { rate: 1.36, symbol: 'C$', code: 'CAD' },
    AUD: { rate: 1.51, symbol: 'A$', code: 'AUD' },
    JPY: { rate: 156.5, symbol: '¥', code: 'JPY' },
    NGN: { rate: 1480, symbol: '₦', code: 'NGN' },
    INR: { rate: 83.3, symbol: '₹', code: 'INR' },
  };

  const currencySelect = document.getElementById('currency-select');
  const priceDisplays = document.querySelectorAll('.price-display');

  const updatePrices = (currencyCode) => {
    const data = currencyData[currencyCode];
    if (!data) return;

    priceDisplays.forEach(display => {
      const basePrice = parseFloat(display.getAttribute('data-base-price'));
      if (isNaN(basePrice)) return;
      
      let convertedPrice = (basePrice * data.rate);
      let formattedPrice;

      if (currencyCode === 'JPY') {
        // No decimals, format with commas
        formattedPrice = Math.round(convertedPrice).toLocaleString('en-US');
      } else if (currencyCode === 'NGN' && basePrice > 20) {
        // Rounded to nearest 100, formatted with commas
        formattedPrice = (Math.round(convertedPrice / 100) * 100).toLocaleString('en-US');
      } else {
        // Keep decimals (2 places if floating, none if integer) and format with commas
        const decimals = Number.isInteger(convertedPrice) ? 0 : 2;
        formattedPrice = convertedPrice.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
      }

      display.textContent = `${data.symbol}${formattedPrice} ${data.code}`;
    });
  };

  // Get saved currency from localStorage or default to USD
  const savedCurrency = localStorage.getItem('preferredCurrency') || 'USD';

  // Set the initial dropdown value to match saved/default currency
  if (currencySelect) {
    if (currencyData[savedCurrency]) {
      currencySelect.value = savedCurrency;
    }

    // Listen for currency selection change and store preference
    currencySelect.addEventListener('change', (e) => {
      const selectedCurrency = e.target.value;
      updatePrices(selectedCurrency);
      try {
        localStorage.setItem('preferredCurrency', selectedCurrency);
      } catch (err) {
        console.warn('localStorage is unavailable:', err);
      }
    });
  }

  // Initialize prices on page load using the restored currency preference
  updatePrices(currencySelect ? currencySelect.value : savedCurrency);

  // --- 2. INTERSECTION OBSERVER FOR SCROLL REVEAL ---
  const revealItems = document.querySelectorAll('.scroll-reveal');

  if (revealItems.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' 
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }


  // --- 3. FAQ ACCORDION FUNCTIONALITY ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  // --- 4. WAKE-WINDOW CALCULATOR LOGIC ---
  const ageSelect = document.getElementById('baby-age-select');
  const resWakeWindow = document.getElementById('res-wake-window');
  const resNapCount = document.getElementById('res-nap-count');
  const resDaySleep = document.getElementById('res-day-sleep');
  const resScheduleList = document.getElementById('res-schedule-list');
  const resExpertTip = document.getElementById('res-expert-tip');

  const scheduleData = {
    '0-2': {
      wakeWindow: '45 – 60 Mins',
      napCount: '4 – 5 Naps',
      daySleep: '4.5 – 6 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Wake Up & Feed' },
        { time: '7:50 AM', event: 'Nap 1 (Offer in dark room)' },
        { time: '11:00 AM', event: 'Nap 2' },
        { time: '2:15 PM', event: 'Nap 3' },
        { time: '5:30 PM', event: 'Catnap 4' },
        { time: '8:30 PM', event: 'Bedtime Routine & Sleep' }
      ],
      tip: '💡 <strong>Newborn Tip:</strong> Day/night confusion is common at this stage. Keep daytime naps light and noisy, and night feedings quiet and dark.'
    },
    '3-4': {
      wakeWindow: '1.5 – 2 Hours',
      napCount: '3 – 4 Naps',
      daySleep: '3.5 – 4.5 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Morning Wake Up' },
        { time: '8:45 AM', event: 'Nap 1 (~1.5 hours)' },
        { time: '12:15 PM', event: 'Nap 2 (~1.5 hours)' },
        { time: '3:45 PM', event: 'Nap 3 (Short 30-45 min catnap)' },
        { time: '7:15 PM', event: 'Bedtime Routine' },
        { time: '7:30 PM', event: 'Lights Out / Night Sleep' }
      ],
      tip: '💡 <strong>Regression Alert:</strong> At 4 months, sleep architecture permanently shifts. If your baby wakes every 2 hours, they lack self-settling cues. Page 22 breaks down the smooth transition fix.'
    },
    '5-6': {
      wakeWindow: '2 – 2.5 Hours',
      napCount: '3 Naps',
      daySleep: '3 – 3.5 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Desired Wake Time' },
        { time: '9:15 AM', event: 'Nap 1 (approx. 1 hour)' },
        { time: '12:30 PM', event: 'Nap 2 (approx. 1.5 hours)' },
        { time: '4:30 PM', event: 'Nap 3 (Quick 30 min bridge nap)' },
        { time: '7:30 PM', event: 'Bedtime' }
      ],
      tip: '💡 <strong>3-to-2 Nap Shift:</strong> If the 3rd nap is taking 45 minutes of fighting to happen, your baby is ready to drop it. See Chapter 5 for transition rules.'
    },
    '7-8': {
      wakeWindow: '2.5 – 3 Hours',
      napCount: '2 Naps',
      daySleep: '2.5 – 3 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Wake Up' },
        { time: '9:30 AM', event: 'Nap 1 (~1.5 hours)' },
        { time: '2:00 PM', event: 'Nap 2 (~1.5 hours)' },
        { time: '7:00 PM', event: 'Bedtime Routine & Sleep' }
      ],
      tip: '💡 <strong>Troubleshooting Short Naps:</strong> 30-minute nap caps mean under-tiredness at bedtime or over-tiredness at wake windows. Use the 15-minute diagnostic tweak in Chapter 4.'
    },
    '9-11': {
      wakeWindow: '3 – 3.75 Hours',
      napCount: '2 Naps',
      daySleep: '2 – 2.5 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Morning Wake Up' },
        { time: '10:00 AM', event: 'Nap 1 (1 hour)' },
        { time: '2:30 PM', event: 'Nap 2 (1 hour)' },
        { time: '7:30 PM', event: 'Bedtime' }
      ],
      tip: '💡 <strong>Separation Anxiety Peak:</strong> Night wakings at this age are usually driven by milestones (crawling/standing). Avoid creating new dependencies.'
    },
    '12-14': {
      wakeWindow: '3.5 – 4 Hours',
      napCount: '2 Naps (Don\'t drop to 1 yet!)',
      daySleep: '2 – 2.5 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Wake Up' },
        { time: '10:30 AM', event: 'Nap 1 (1 hour)' },
        { time: '3:00 PM', event: 'Nap 2 (1 hour)' },
        { time: '8:00 PM', event: 'Bedtime' }
      ],
      tip: '💡 <strong>12-Month Trap:</strong> Many parents mistake the 12-month nap strike for readiness for 1 nap. It is almost always a temporary regression—keep 2 naps!'
    },
    '15-18': {
      wakeWindow: '4.5 – 5.5 Hours',
      napCount: '1 Nap',
      daySleep: '1.5 – 2.5 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Wake Up & Breakfast' },
        { time: '12:00 PM', event: 'Midday Nap (2 hours)' },
        { time: '2:00 PM', event: 'Nap Ends' },
        { time: '7:30 PM', event: 'Night Sleep' }
      ],
      tip: '💡 <strong>One-Nap Transition:</strong> Offer lunch early (11:30 AM) during the first few weeks of transitioning to prevent overtired melt-downs before nap time.'
    },
    '19-24': {
      wakeWindow: '5.5 – 6 Hours',
      napCount: '1 Nap',
      daySleep: '1.5 – 2 Hours',
      schedule: [
        { time: '7:00 AM', event: 'Wake Up' },
        { time: '12:30 PM', event: 'Afternoon Nap' },
        { time: '2:30 PM', event: 'Wake Up from Nap' },
        { time: '8:00 PM', event: 'Bedtime' }
      ],
      tip: '💡 <strong>Bedtime Battles:</strong> Toddler stall tactics start around now. The one-page "Explain to Partner" card included with the guide keeps both parents unified.'
    }
  };

  const updateCalculator = (ageKey) => {
    const data = scheduleData[ageKey];
    if (!data) return;

    if (resWakeWindow) resWakeWindow.textContent = data.wakeWindow;
    if (resNapCount) resNapCount.textContent = data.napCount;
    if (resDaySleep) resDaySleep.textContent = data.daySleep;
    if (resExpertTip) resExpertTip.innerHTML = data.tip;

    if (resScheduleList) {
      resScheduleList.innerHTML = data.schedule.map(item => `
        <div class="timeline-item">
          <span class="timeline-time">${item.time}</span>
          <span class="timeline-event">${item.event}</span>
        </div>
      `).join('');
    }
  };

  if (ageSelect) {
    ageSelect.addEventListener('change', (e) => updateCalculator(e.target.value));
    updateCalculator(ageSelect.value);
  }


  // --- 5. STICKY BOTTOM BAR VISIBILITY LOGIC (MOBILE) ---
  const stickyBar = document.getElementById('stickyBar');
  const pricingSection = document.getElementById('pricing');

  if (stickyBar && pricingSection) {
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        stickyBar.classList.remove('visible');
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight;
      const pricingSectionTop = pricingSection.offsetTop;

      if (window.scrollY > 400 && scrollPosition < pricingSectionTop + 200) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
  }


  // --- 6. SMOOTH SCROLL HANDLER ---
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.footer-link-modal)');
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerEl = document.querySelector('.main-header');
        const headerOffset = headerEl ? headerEl.offsetHeight : 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // --- 7. LEGAL MODAL HANDLER (Terms & Privacy) ---
  const legalModal = document.getElementById('legalModal');
  const legalModalBody = document.getElementById('legalModalBody');
  const legalOverlay = document.getElementById('legalOverlay');
  const legalClose = document.getElementById('legalClose');
  const modalTriggers = document.querySelectorAll('.footer-link-modal');

  const legalTexts = {
    terms: `
      <h3>Terms & Conditions</h3>
      <p>By purchasing and downloading <strong>The Baby Sleep Detective</strong>, you receive a non-exclusive, non-transferable personal license to access the PDF guide for personal use within your household.</p>
      <p>Re-distribution, resale, or sharing digital copies with unauthorized third parties is prohibited. Due to the instant delivery nature of digital files, refunds are granted in accordance with our 7-Day Money-Back Guarantee upon written request to support.</p>
    `,
    privacy: `
      <h3>Privacy Policy</h3>
      <p>At <strong>The Baby Sleep Club</strong>, your privacy is extremely important to us. We collect minimal personal information (such as your email address and payment details) strictly necessary to process digital product downloads and deliver lifetime update communications.</p>
      <p>We do not sell, rent, or trade your personal data to third parties. All financial processing is conducted via secure, encrypted payment processors.</p>
    `
  };

  const openModal = (type) => {
    if (legalTexts[type] && legalModal && legalModalBody) {
      legalModalBody.innerHTML = legalTexts[type];
      legalModal.classList.add('open');
      legalModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (legalModal) {
      legalModal.classList.remove('open');
      legalModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      openModal(modalType);
    });
  });

  if (legalClose) legalClose.addEventListener('click', closeModal);
  if (legalOverlay) legalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && legalModal.classList.contains('open')) {
      closeModal();
    }
  });

});