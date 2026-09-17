document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. CURRENCY & PRICING
  // =========================================================

  const currencyData = {
    USD: {
      rate: 1,
      symbol: '$',
      code: 'USD'
    },

    NGN: {
      fixedPrice: 9900,
      symbol: '₦',
      code: 'NGN'
    },

    ZAR: {
      fixedPrice: 199,
      symbol: 'R',
      code: 'ZAR'
    },

    GHS: {
      fixedPrice: 149,
      symbol: 'GH₵',
      code: 'GHS'
    },

    KES: {
      fixedPrice: 1499,
      symbol: 'KSh ',
      code: 'KES'
    },

    GBP: {
      rate: 0.79,
      symbol: '£',
      code: 'GBP'
    },

    EUR: {
      rate: 0.92,
      symbol: '€',
      code: 'EUR'
    },

    CAD: {
      rate: 1.36,
      symbol: 'C$',
      code: 'CAD'
    },

    AUD: {
      rate: 1.51,
      symbol: 'A$',
      code: 'AUD'
    },

    JPY: {
      rate: 156.5,
      symbol: '¥',
      code: 'JPY'
    },

    INR: {
      rate: 83.3,
      symbol: '₹',
      code: 'INR'
    }
  };


  const CURRENT_PRICE_USD = 11.99;

  const DISCOUNT_PERCENTAGE = 35;

  const ORIGINAL_PRICE_USD =
    CURRENT_PRICE_USD /
    (1 - DISCOUNT_PERCENTAGE / 100);


  // =========================================================
  // PRICE FORMATTING
  // =========================================================

  const formatPrice = (amount, currencyCode) => {

    if (currencyCode === 'JPY') {
      return Math.round(amount).toLocaleString('en-US');
    }

    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };


  // =========================================================
  // CALCULATE CURRENT PRICE
  // =========================================================

  const calculatePrice = (baseUSDPrice, currencyCode) => {

    const data = currencyData[currencyCode];

    if (!data) {
      return baseUSDPrice;
    }

    if (data.fixedPrice !== undefined) {
      return data.fixedPrice;
    }

    return baseUSDPrice * data.rate;
  };


  // =========================================================
  // UPDATE ALL PRICES
  // =========================================================

  const updatePrices = (currencyCode = 'USD') => {

    const data =
      currencyData[currencyCode] ||
      currencyData.USD;


    const currentPrice =
      calculatePrice(
        CURRENT_PRICE_USD,
        currencyCode
      );


    let originalPrice;


    if (data.fixedPrice !== undefined) {

      originalPrice =
        data.fixedPrice /
        (1 - DISCOUNT_PERCENTAGE / 100);

    } else {

      originalPrice =
        ORIGINAL_PRICE_USD * data.rate;
    }


    // ---------------------------------------------------------
    // UPDATE EVERY CURRENT PRICE DISPLAY
    // ---------------------------------------------------------

    document
      .querySelectorAll('.price-display')
      .forEach((element) => {

        if (
          element.classList.contains('original-price')
        ) {
          return;
        }

        element.textContent =
          `${data.symbol}${formatPrice(
            currentPrice,
            currencyCode
          )} ${data.code}`;
      });


    // ---------------------------------------------------------
    // UPDATE ORIGINAL PRICE
    // ---------------------------------------------------------

    document
      .querySelectorAll('.original-price')
      .forEach((element) => {

        element.textContent =
          `${data.symbol}${formatPrice(
            originalPrice,
            currencyCode
          )} ${data.code}`;
      });


    // ---------------------------------------------------------
    // UPDATE DISCOUNT PERCENTAGE
    // ---------------------------------------------------------

    const discountElement =
      document.getElementById(
        'discount-percentage'
      );


    if (discountElement) {

      discountElement.textContent =
        `${DISCOUNT_PERCENTAGE}%`;
    }
  };


  // =========================================================
  // CURRENCY SELECTOR
  // =========================================================

  const currencySelect =
    document.getElementById(
      'currency-select'
    );


  let savedCurrency = 'USD';


  try {

    savedCurrency =
      localStorage.getItem(
        'preferredCurrency'
      ) || 'USD';

  } catch (err) {

    console.warn(
      'Unable to read saved currency:',
      err
    );
  }


  if (!currencyData[savedCurrency]) {
    savedCurrency = 'USD';
  }


  if (currencySelect) {

    currencySelect.value =
      savedCurrency;


    currencySelect.addEventListener(
      'change',
      (e) => {

        const selectedCurrency =
          e.target.value;

        updatePrices(
          selectedCurrency
        );


        try {

          localStorage.setItem(
            'preferredCurrency',
            selectedCurrency
          );

        } catch (err) {

          console.warn(
            'localStorage is unavailable:',
            err
          );
        }
      }
    );
  }


  updatePrices(
    currencySelect
      ? currencySelect.value
      : savedCurrency
  );


  // =========================================================
  // 2. SCROLL REVEAL
  // =========================================================

  // IMPORTANT:
  // Your HTML uses .scroll-reveal, not .reveal.

  const revealElements =
    document.querySelectorAll(
      '.scroll-reveal'
    );


  if (
    revealElements.length &&
    'IntersectionObserver' in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'visible'
              );

              observer.unobserve(
                entry.target
              );
            }
          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );
      }
    );

  } else {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          'visible'
        );
      }
    );
  }


  // =========================================================
  // 3. FAQ ACCORDION
  // =========================================================

  const faqItems =
    document.querySelectorAll(
      '.faq-item'
    );


  faqItems.forEach((item) => {

    const question =
      item.querySelector(
        '.faq-question'
      );


    if (!question) return;


    question.addEventListener(
      'click',
      () => {

        const isOpen =
          item.classList.contains(
            'active'
          );


        faqItems.forEach(
          (otherItem) => {

            if (
              otherItem !== item
            ) {

              otherItem.classList.remove(
                'active'
              );
            }
          }
        );


        if (isOpen) {

          item.classList.remove(
            'active'
          );

        } else {

          item.classList.add(
            'active'
          );
        }
      }
    );
  });


  // =========================================================
  // 4. WAKE-WINDOW CALCULATOR
  // =========================================================

  const wakeData = {

    '0-2': {
      wake: '45–60 Mins',
      naps: '4–5 Naps',
      daySleep: '4.5–6 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['7:50', 'Nap 1'],
        ['11:00', 'Nap 2'],
        ['2:15', 'Nap 3'],
        ['5:30', 'Catnap 4'],
        ['8:30', 'Bedtime']
      ],

      tip:
        'Newborns often have day/night confusion. Keep daytime bright and active while keeping nighttime feeds calm and dark.'
    },


    '3-4': {
      wake: '1.5–2 Hours',
      naps: '3–4 Naps',
      daySleep: '3.5–4.5 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['8:45', 'Nap 1'],
        ['12:15', 'Nap 2'],
        ['3:45', 'Nap 3'],
        ['7:15', 'Bedtime Routine'],
        ['7:30', 'Lights Out']
      ],

      tip:
        'Around 4 months, sleep patterns mature and many babies experience more frequent waking. Consistency matters more than perfection.'
    },


    '5-6': {
      wake: '2–2.5 Hours',
      naps: '3 Naps',
      daySleep: '3–3.5 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['9:15', 'Nap 1'],
        ['12:30', 'Nap 2'],
        ['4:30', 'Bridge Nap'],
        ['7:30', 'Bedtime']
      ],

      tip:
        'Many babies begin shifting from three naps toward two during this stage. Watch your baby rather than forcing the transition too early.'
    },


    '7-8': {
      wake: '2.5–3 Hours',
      naps: '2 Naps',
      daySleep: '2.5–3 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['9:30', 'Nap 1'],
        ['2:00', 'Nap 2'],
        ['7:00', 'Bedtime']
      ],

      tip:
        'Short naps can happen during developmental changes. Protect the first nap and avoid stretching wake windows too aggressively.'
    },


    '9-11': {
      wake: '3–3.75 Hours',
      naps: '2 Naps',
      daySleep: '2–2.5 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['10:00', 'Nap 1'],
        ['2:30', 'Nap 2'],
        ['7:30', 'Bedtime']
      ],

      tip:
        'Separation anxiety can temporarily affect naps and nighttime sleep. Extra reassurance does not mean you are creating a bad habit.'
    },


    '12-14': {
      wake: '3.5–4 Hours',
      naps: '2 Naps (Don’t drop to 1 yet!)',
      daySleep: '2–2.5 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['10:30', 'Nap 1'],
        ['3:00', 'Nap 2'],
        ['8:00', 'Bedtime']
      ],

      tip:
        'Around 12 months, developmental changes can temporarily disrupt sleep. Many babies still benefit from two naps.'
    },


    '15-18': {
      wake: '4.5–5.5 Hours',
      naps: '1 Nap',
      daySleep: '1.5–2.5 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['12:00', 'Midday Nap'],
        ['2:00', 'Nap Ends'],
        ['7:30', 'Night Sleep']
      ],

      tip:
        'The move to one nap can take time. A gradual transition is often easier than suddenly eliminating the second nap.'
    },


    '19-24': {
      wake: '5.5–6 Hours',
      naps: '1 Nap',
      daySleep: '1.5–2 Hours',

      schedule: [
        ['7:00', 'Wake'],
        ['12:30', 'Nap'],
        ['2:30', 'Wake'],
        ['8:00', 'Bedtime']
      ],

      tip:
        'Bedtime battles may appear as toddlers become more independent. Keep boundaries predictable and the bedtime routine consistent.'
    }

  };


  // IMPORTANT:
  // Your HTML uses #baby-age-select.

  const ageSelect =
    document.getElementById(
      'baby-age-select'
    );


  if (ageSelect) {

    const updateCalculator = () => {

      const selectedAge =
        ageSelect.value;


      const data =
        wakeData[selectedAge];


      if (!data) return;


      // Wake window
      const wakeWindow =
        document.getElementById(
          'res-wake-window'
        );


      if (wakeWindow) {

        wakeWindow.textContent =
          data.wake;
      }


      // Number of naps
      const napCount =
        document.getElementById(
          'res-nap-count'
        );


      if (napCount) {

        napCount.textContent =
          data.naps;
      }


      // Day sleep
      const daySleep =
        document.getElementById(
          'res-day-sleep'
        );


      if (daySleep) {

        daySleep.textContent =
          data.daySleep;
      }


      // Schedule
      const scheduleContainer =
        document.getElementById(
          'res-schedule-list'
        );


      if (scheduleContainer) {

        scheduleContainer.innerHTML =
          '';


        data.schedule.forEach(
          ([time, activity]) => {

            const row =
              document.createElement(
                'div'
              );


            row.className =
              'schedule-row';


            row.innerHTML = `
              <span class="schedule-time">
                ${time}
              </span>

              <span class="schedule-activity">
                ${activity}
              </span>
            `;


            scheduleContainer.appendChild(
              row
            );
          }
        );
      }


      // Expert tip
      const tip =
        document.getElementById(
          'res-expert-tip'
        );


      if (tip) {

        tip.innerHTML =
          `💡 <strong>Troubleshooting Tip:</strong> ${data.tip}`;
      }
    };


    ageSelect.addEventListener(
      'change',
      updateCalculator
    );


    // Populate calculator immediately
    updateCalculator();
  }


  // =========================================================
  // 5. STICKY BOTTOM BAR
  // =========================================================

  // Your HTML uses .sticky-bar.

  const stickyBar =
    document.querySelector(
      '.sticky-bar'
    );


  if (stickyBar) {

    const closeButton =
      stickyBar.querySelector(
        '.sticky-close'
      );


    if (closeButton) {

      closeButton.addEventListener(
        'click',
        () => {

          stickyBar.classList.add(
            'hidden'
          );
        }
      );
    }
  }


  // =========================================================
  // 6. SMOOTH SCROLLING
  // =========================================================

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((anchor) => {

      anchor.addEventListener(
        'click',
        (event) => {

          const targetId =
            anchor.getAttribute(
              'href'
            );


          if (
            !targetId ||
            targetId === '#'
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      );
    });



  // --- 5. STICKY BOTTOM BAR VISIBILITY LOGIC ---

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

      if (
        window.scrollY > 400 &&
        scrollPosition < pricingSectionTop + 200
      ) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();
  }


  // --- 6. SMOOTH SCROLL HANDLER ---

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]:not(.footer-link-modal)'
  );

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

        const offsetPosition =
          elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // --- 7. LEGAL MODAL HANDLER ---

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
      <p>At <strong>The Baby Sleep Detective Club</strong>, your privacy is extremely important to us. We collect minimal personal information, such as your email address and payment details, strictly necessary to process digital product downloads and deliver lifetime update communications.</p>
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

  if (legalClose) {
    legalClose.addEventListener('click', closeModal);
  }

  if (legalOverlay) {
    legalOverlay.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      legalModal &&
      legalModal.classList.contains('open')
    ) {
      closeModal();
    }
  });

});
