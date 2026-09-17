/**
 * The Baby Sleep Detective - Core Landing Page Functionality
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. PRICING & CURRENCY CONVERSION DATA
     ========================================================= */
  const BASE_PRICE = {
    original: 18.45,
    current: 11.99,
    currency: 'USD'
  };

  // Fixed prices for specific regional currencies to prevent floating precision issues
  const FIXED_REGIONAL_PRICES = {
    NGN: { original: 29500, current: 19000, symbol: '₦' },
    ZAR: { original: 340, current: 220, symbol: 'R' },
    GHS: { original: 280, current: 180, symbol: 'GH₵' },
    KES: { original: 2400, current: 1550, symbol: 'KSh' }
  };

  // Approximate conversion rates relative to 1 USD for floating currencies
  const FX_RATES = {
    USD: { rate: 1.0, symbol: '$' },
    GBP: { rate: 0.79, symbol: '£' },
    EUR: { rate: 0.92, symbol: '€' },
    CAD: { rate: 1.35, symbol: 'C$' },
    AUD: { rate: 1.52, symbol: 'A$' },
    JPY: { rate: 155.0, symbol: '¥' },
    INR: { rate: 83.2, symbol: '₹' }
  };

  const currencySelect = document.getElementById('currency-select');
  const priceDisplays = document.querySelectorAll('.price-display');
  const discountBadge = document.getElementById('discount-percentage');

  /**
   * Safely formats currency amounts, handling integers for JPY and 2 decimal places otherwise
   */
  function formatPrice(amount, symbol, currencyCode) {
    if (currencyCode === 'JPY') {
      return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
    }
    const formattedAmount = (Math.round(amount * 100) / 100).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${symbol}${formattedAmount} ${currencyCode}`;
  }

  /**
   * Updates all price displays across the landing page when currency changes
   */
  function updateCurrency(currencyCode) {
    let orig, curr, symbol;

    if (FIXED_REGIONAL_PRICES[currencyCode]) {
      orig = FIXED_REGIONAL_PRICES[currencyCode].original;
      curr = FIXED_REGIONAL_PRICES[currencyCode].current;
      symbol = FIXED_REGIONAL_PRICES[currencyCode].symbol;
    } else if (FX_RATES[currencyCode]) {
      const config = FX_RATES[currencyCode];
      orig = BASE_PRICE.original * config.rate;
      curr = BASE_PRICE.current * config.rate;
      symbol = config.symbol;
    } else {
      orig = BASE_PRICE.original;
      curr = BASE_PRICE.current;
      symbol = '$';
      currencyCode = 'USD';
    }

    // Update discount badge calculation
    if (discountBadge) {
      const discountPercent = Math.round(((orig - curr) / orig) * 100);
      discountBadge.textContent = `${discountPercent}%`;
    }

    // Update DOM nodes
    const origFormatted = formatPrice(orig, symbol, currencyCode);
    const currFormatted = formatPrice(curr, symbol, currencyCode);

    document.querySelectorAll('.original-price').forEach(el => el.textContent = origFormatted);
    document.querySelectorAll('.current-price').forEach(el => el.textContent = currFormatted);

    // Save user choice safely
    try {
      localStorage.setItem('preferred_currency', currencyCode);
    } catch (e) {
      /* Browser storage disabled or private mode fallback */
    }
  }

  // Load saved currency preference if available
  let savedCurrency = 'USD';
  try {
    savedCurrency = localStorage.getItem('preferred_currency') || 'USD';
  } catch (e) {
    savedCurrency = 'USD';
  }

  if (currencySelect) {
    currencySelect.value = savedCurrency;
    updateCurrency(savedCurrency);
    currencySelect.addEventListener('change', (e) => updateCurrency(e.target.value));
  }

  /* =========================================================
     2. WAKE-WINDOW & NAP SCHEDULE CALCULATOR
     ========================================================= */
  const SCHEDULE_DATABASE = {
    '0-2': {
      wakeWindow: '45–90 Mins',
      naps: '4–5 Naps',
      daySleep: '4–5 Hours',
      schedule: [
        ['7:00 AM', 'Wake & Feed'],
        ['8:00 AM', 'Nap 1'],
        ['10:30 AM', 'Wake & Feed'],
        ['11:45 AM', 'Nap 2'],
        ['2:00 PM', 'Wake & Feed'],
        ['3:15 PM', 'Nap 3'],
        ['5:00 PM', 'Wake & Catnap'],
        ['7:30 PM', 'Bedtime Routine']
      ],
      tip: '💡 <strong>Newborn Focus:</strong> At this stage, focus on day/night circadian rhythm lighting cues rather than strict timelines.'
    },
    '3-4': {
      wakeWindow: '1.5–2 Hours',
      naps: '3–4 Naps',
      daySleep: '3.5–4 Hours',
      schedule: [
        ['7:00 AM', 'Morning Wake Up'],
        ['8:45 AM', 'Nap 1'],
        ['10:15 AM', 'Wake & Feed'],
        ['12:15 PM', 'Nap 2'],
        ['2:00 PM', 'Wake & Feed'],
        ['4:00 PM', 'Nap 3 (Catnap)'],
        ['4:45 PM', 'Wake & Feed'],
        ['7:00 PM', 'Bedtime']
      ],
      tip: '💡 <strong>4-Month Regression Tip:</strong> Sleep cycles mature now. Ensure room is pitch dark to encourage connecting sleep cycles.'
    },
    '5-6': {
      wakeWindow: '2–2.5 Hours',
      naps: '3 Naps',
      daySleep: '3–3.5 Hours',
      schedule: [
        ['7:00 AM', 'Wake Up & Feed'],
        ['9:15 AM', 'Nap 1 (1.5 hrs)'],
        ['10:45 AM', 'Wake & Play'],
        ['1:00 PM', 'Nap 2 (1.5 hrs)'],
        ['2:30 PM', 'Wake & Feed'],
        ['4:45 PM', 'Nap 3 (30 min catnap)'],
        ['5:15 PM', 'Wake Up'],
        ['7:30 PM', 'Bedtime']
      ],
      tip: '💡 <strong>Nap Consolidation:</strong> Cap the 3rd nap to 30 minutes so it does not interfere with night sleep onset.'
    },
    '7-8': {
      wakeWindow: '2.5–3.5 Hours',
      naps: '2 Naps',
      daySleep: '2.5–3 Hours',
      schedule: [
        ['7:00 AM', 'Morning Wake Up'],
        ['9:30 AM', 'Nap 1'],
        ['11:00 AM', 'Wake & Snack/Feed'],
        ['2:30 PM', 'Nap 2'],
        ['4:00 PM', 'Wake & Play'],
        ['7:30 PM', 'Bedtime']
      ],
      tip: '💡 <strong>2-Nap Transition:</strong> If bedtime falls earlier during this transition, that is completely normal and prevents overtiredness.'
    },
    '9-11': {
      wakeWindow: '3–4 Hours',
      naps: '2 Naps',
      daySleep: '2.5–3 Hours',
      schedule: [
        ['7:00 AM', 'Wake & Breakfast'],
        ['10:00 AM', 'Nap 1 (1.25 hrs)'],
        ['11:15 AM', 'Wake & Lunch'],
        ['2:30 PM', 'Nap 2 (1.25 hrs)'],
        ['3:45 PM', 'Wake & Snack'],
        ['7:45 PM', 'Bedtime Routine']
      ],
      tip: '💡 <strong>Crawler Stage:</strong> Physical milestones can cause short night wakeups. Practice standing/crawling heavily during morning awake windows.'
    },
    '12-14': {
      wakeWindow: '3.5–4.5 Hours',
      naps: '2 Naps',
      daySleep: '2–2.5 Hours',
      schedule: [
        ['7:00 AM', 'Morning Wake Up'],
        ['10:30 AM', 'Nap 1 (1 hr)'],
        ['11:30 AM', 'Wake & Lunch'],
        ['3:30 PM', 'Nap 2 (1 hr)'],
        ['4:30 PM', 'Wake & Play'],
        ['8:00 PM', 'Bedtime']
      ],
      tip: '💡 <strong>12-Month False Sign:</strong> Resist shifting to 1 nap too early! Most toddlers are not ready for 1 nap until 15-18 months.'
    },
    '15-18': {
      wakeWindow: '5–6 Hours',
      naps: '1 Nap',
      daySleep: '2–2.5 Hours',
      schedule: [
        ['7:00 AM', 'Morning Wake Up'],
        ['12:00 PM', 'Midday Nap (2 hrs)'],
        ['2:00 PM', 'Wake & Snack'],
        ['7:30 PM', 'Bedtime Routine']
      ],
      tip: '💡 <strong>1-Nap Routine:</strong> Place lunch before the nap so hunger does not cause an early nap wake-up.'
    },
    '19-24': {
      wakeWindow: '5.5–6 Hours',
      naps: '1 Nap',
      daySleep: '1.5–2 Hours',
      schedule: [
        ['7:00 AM', 'Wake Up'],
        ['12:30 PM', 'Nap (1.5-2 hrs)'],
        ['2:30 PM', 'Wake & Afternoon Fun'],
        ['8:00 PM', 'Night Bedtime']
      ],
      tip: '💡 <strong>Toddler Independence:</strong> Use a consistent bedtime routine chart to reduce stall tactics before sleep.'
    }
  };

  const ageSelect = document.getElementById('baby-age-select');
  const resWakeWindow = document.getElementById('res-wake-window');
  const resNapCount = document.getElementById('res-nap-count');
  const resDaySleep = document.getElementById('res-day-sleep');
  const resScheduleList = document.getElementById('res-schedule-list');
  const resExpertTip = document.getElementById('res-expert-tip');

  function renderCalculator(ageKey) {
    const data = SCHEDULE_DATABASE[ageKey];
    if (!data) return;

    if (resWakeWindow) resWakeWindow.textContent = data.wakeWindow;
    if (resNapCount) resNapCount.textContent = data.naps;
    if (resDaySleep) resDaySleep.textContent = data.daySleep;
    if (resExpertTip) resExpertTip.innerHTML = data.tip;

    // Use DocumentFragment to prevent reflow layout shifts
    if (resScheduleList) {
      const fragment = document.createDocumentFragment();

      data.schedule.forEach(([time, activity]) => {
        const row = document.createElement('div');
        row.className = 'schedule-row';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'schedule-time';
        timeSpan.textContent = time;

        const actSpan = document.createElement('span');
        actSpan.className = 'schedule-activity';
        actSpan.textContent = activity;

        row.appendChild(timeSpan);
        row.appendChild(actSpan);
        fragment.appendChild(row);
      });

      resScheduleList.innerHTML = '';
      resScheduleList.appendChild(fragment);
    }
  }

  if (ageSelect) {
    renderCalculator(ageSelect.value);
    ageSelect.addEventListener('change', (e) => renderCalculator(e.target.value));
  }

  /* =========================================================
     3. FAQ ACCORDION INTERACTION
     ========================================================= */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isExpanded) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================================
     4. ACCESSIBLE LEGAL MODAL WITH FOCUS TRAPPING
     ========================================================= */
  const modal = document.getElementById('legalModal');
  const modalOverlay = document.getElementById('legalOverlay');
  const modalClose = document.getElementById('legalClose');
  const modalBody = document.getElementById('legalModalBody');
  const modalTriggers = document.querySelectorAll('[data-modal]');

  let previousActiveElement = null;

  const LEGAL_CONTENT = {
    terms: `
      <h2>Terms & Conditions</h2>
      <p>By purchasing or using The Baby Sleep Detective guide, you agree to the following terms:</p>
      <p><strong>Digital Product Policy:</strong> All materials provided are digital downloads in PDF format. Due to the immediate delivery of digital goods, access is provided instantly upon completion of checkout.</p>
      <p><strong>Medical Disclaimer:</strong> The content in this guide is for informational purposes only and is not a substitute for professional pediatric medical advice, diagnosis, or treatment.</p>
    `,
    privacy: `
      <h2>Privacy Policy</h2>
      <p>Your privacy is important to us. Here is how your information is handled:</p>
      <p><strong>Data Collection:</strong> We collect basic customer details (email address and currency preference) strictly to process your digital order and send purchase receipts.</p>
      <p><strong>Third-Party Processors:</strong> Payments are processed via encrypted payment gateways. We never store or view your full credit card credentials.</p>
    `
  };

  function openModal(type) {
    if (!modal || !modalBody || !LEGAL_CONTENT[type]) return;

    previousActiveElement = document.activeElement;
    modalBody.innerHTML = LEGAL_CONTENT[type];
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      openModal(modalType);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // Keyboard Navigation: Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  /* =========================================================
     5. MOBILE STICKY BAR & SCROLL OBSERVER
     ========================================================= */
  const stickyBar = document.querySelector('.sticky-bar');
  const stickyClose = document.querySelector('.sticky-close');

  if (stickyClose && stickyBar) {
    stickyClose.addEventListener('click', () => {
      stickyBar.classList.add('hidden');
    });
  }

  // Scroll Reveal Animations via Intersection Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

});
