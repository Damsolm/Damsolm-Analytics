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

    // Fixed local prices
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

    // Converted currencies
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


  // Current selling price
  const CURRENT_PRICE_USD = 11.99;

  // Discount percentage
  const DISCOUNT_PERCENTAGE = 35;


  // Automatically calculate original price
  // Example:
  // $11.99 / 0.65 = $18.45
  const ORIGINAL_PRICE_USD =
    CURRENT_PRICE_USD /
    (1 - DISCOUNT_PERCENTAGE / 100);


  // =========================================================
  // PRICE FORMATTING
  // =========================================================

  const formatPrice = (amount, currencyCode) => {

    // Japanese Yen normally has no decimal places
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

    // Use fixed local price where specified
    if (data.fixedPrice !== undefined) {
      return data.fixedPrice;
    }

    // Otherwise convert from USD
    return baseUSDPrice * data.rate;
  };


  // =========================================================
  // UPDATE ALL PRICES
  // =========================================================

  const updatePrices = (currencyCode = 'USD') => {

    const data =
      currencyData[currencyCode] ||
      currencyData.USD;


    // Calculate current selling price
    const currentPrice =
      calculatePrice(
        CURRENT_PRICE_USD,
        currencyCode
      );


    // Calculate original price
    let originalPrice;


    if (data.fixedPrice !== undefined) {

      // For fixed local prices, calculate the original
      // price backwards so the discount remains exactly 35%.
      //
      // Example:
      // ₦9,900 / 0.65 = ₦15,230.77

      originalPrice =
        data.fixedPrice /
        (1 - DISCOUNT_PERCENTAGE / 100);

    } else {

      // For normal converted currencies
      originalPrice =
        ORIGINAL_PRICE_USD * data.rate;
    }


    // =======================================================
    // IMPORTANT:
    // UPDATE EVERY CURRENT PRICE DISPLAY
    // =======================================================

    document
      .querySelectorAll('.price-display')
      .forEach((element) => {

        // Do NOT overwrite the original/strikethrough price
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


    // =======================================================
    // UPDATE ORIGINAL / STRIKETHROUGH PRICE
    // =======================================================

    document
      .querySelectorAll('.original-price')
      .forEach((element) => {

        element.textContent =
          `${data.symbol}${formatPrice(
            originalPrice,
            currencyCode
          )} ${data.code}`;
      });


    // =======================================================
    // UPDATE DISCOUNT PERCENTAGE
    // =======================================================

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


  // Make sure saved currency actually exists
  if (!currencyData[savedCurrency]) {

    savedCurrency = 'USD';
  }


  if (currencySelect) {

    // Set dropdown to saved currency
    currencySelect.value =
      savedCurrency;


    // Listen for currency changes
    currencySelect.addEventListener(
      'change',
      (e) => {

        const selectedCurrency =
          e.target.value;


        // Update every price on the page
        updatePrices(
          selectedCurrency
        );


        // Remember user's selection
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


  // Initial price update
  updatePrices(
    currencySelect
      ? currencySelect.value
      : savedCurrency
  );



  // =========================================================
  // 2. SCROLL REVEAL ANIMATION
  // =========================================================

  const revealElements =
    document.querySelectorAll(
      '.reveal'
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

    // Fallback for older browsers
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


        // Close all other FAQ items
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


        // Toggle current item
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


  const ageSelect =
    document.getElementById(
      'age-select'
    );


  if (ageSelect) {

    ageSelect.addEventListener(
      'change',
      () => {

        const selectedAge =
          ageSelect.value;


        const data =
          wakeData[selectedAge];


        if (!data) return;


        // Wake window
        const wakeWindow =
          document.getElementById(
            'wake-window'
          );

        if (wakeWindow) {
          wakeWindow.textContent =
            data.wake;
        }


        // Number of naps
        const napCount =
          document.getElementById(
            'nap-count'
          );

        if (napCount) {
          napCount.textContent =
            data.naps;
        }


        // Day sleep
        const daySleep =
          document.getElementById(
            'day-sleep'
          );

        if (daySleep) {
          daySleep.textContent =
            data.daySleep;
        }


        // Schedule
        const scheduleContainer =
          document.getElementById(
            'schedule'
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


        // Tip
        const tip =
          document.getElementById(
            'schedule-tip'
          );


        if (tip) {

          tip.textContent =
            data.tip;
        }
      }
    );
  }



  // =========================================================
  // 5. STICKY BOTTOM BAR
  // =========================================================

  const stickyBar =
    document.querySelector(
      '.sticky-bottom-bar'
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



  // =========================================================
  // 7. LEGAL MODAL
  // =========================================================

  const legalModal =
    document.getElementById(
      'legal-modal'
    );


  const legalOpenButtons =
    document.querySelectorAll(
      '[data-legal-open]'
    );


  const legalCloseButtons =
    document.querySelectorAll(
      '[data-legal-close]'
    );


  if (legalModal) {

    legalOpenButtons.forEach(
      (button) => {

        button.addEventListener(
          'click',
          (event) => {

            event.preventDefault();


            legalModal.classList.add(
              'active'
            );


            document.body.classList.add(
              'modal-open'
            );
          }
        );
      }
    );


    legalCloseButtons.forEach(
      (button) => {

        button.addEventListener(
          'click',
          () => {

            legalModal.classList.remove(
              'active'
            );


            document.body.classList.remove(
              'modal-open'
            );
          }
        );
      }
    );


    // Close when clicking outside modal content
    legalModal.addEventListener(
      'click',
      (event) => {

        if (
          event.target === legalModal
        ) {

          legalModal.classList.remove(
            'active'
          );


          document.body.classList.remove(
            'modal-open'
          );
        }
      }
    );


    // Close with Escape key
    document.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key === 'Escape' &&
          legalModal.classList.contains(
            'active'
          )
        ) {

          legalModal.classList.remove(
            'active'
          );


          document.body.classList.remove(
            'modal-open'
          );
        }
      }
    );
  }

});
