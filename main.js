const navItems = document.querySelector('#nav__items');
const openNavBtn = document.querySelector('#open__nav-btn');
const closeNavBtn = document.querySelector('#close__nav-btn');


openNavBtn.addEventListener('click', () => {
 navItems.style.display = 'flex';
 openNavBtn.style.display = 'none';
 closeNavBtn.style.display = 'inline-block';
})


const closeNav = () => {
    navItems.style.display = 'none';
    openNavBtn.style.display = 'inline-block';
    closeNavBtn.style.display = 'none';  
}


closeNavBtn.addEventListener('click', closeNav);





// close nav menu when a menu item is clicked

if(window.innerWidth < 1024) {
  document.querySelectorAll('#nav__items li a').forEach(navItem => {
    navItem.addEventListener('click', () => {
      closeNav();
    })
  })
}


// change navbar styles on scroll
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('window-scroll', window.scrollY > 0)
})




// ALL PRODUCTS CATALOG WITH FILTER ENGINE
// document.addEventListener("DOMContentLoaded", function () {
    
//     // 1. Relational pricing matrix keyed by unique product ID strings
//     const globalPricingGrid = {
//         NG: {
//             pbi_beg: { current: "₦5,000", old: "₦12,500" },
//             pbi_exp: { current: "₦7,000", old: "₦18,000" },
//             vba_beg: { current: "₦4,000", old: "₦9,000" },
//             vba_exp: { current: "₦7,000", old: "₦18,000" },
//             // pdf_guide1: { current: "₦2,500", old: "₦5,000" } // Example PDF Guide
//         },
//         US: {
//             pbi_beg: { current: "$9.99", old: "$24.99" },
//             pbi_exp: { current: "$19.99", old: "$39.99" },
//             vba_beg: { current: "$7.99", old: "$19.99" },
//             vba_exp: { current: "$19.99", old: "$39.99" },
//             // pdf_guide1: { current: "$4.99", old: "$9.99" }
//         },
//         GB: {
//             pbi_beg: { current: "£7.99", old: "£19.99" },
//             pbi_exp: { current: "£14.99", old: "£34.99" },
//             vba_beg: { current: "£5.99", old: "£14.99" },
//             vba_exp: { current: "£14.99", old: "£34.99" },
//             // pdf_guide1: { current: "£3.99", old: "£7.99" }
         
//         },
//         GH: {
//             pbi_beg: { current: "GH₵120", old: "GH₵250" },
//             pbi_exp: { current: "GH₵220", old: "GH₵450" },
//             vba_beg: { current: "GH₵100", old: "GH₵200" },
//             vba_exp: { current: "GH₵220", old: "GH₵450" },
//             // pdf_guide1: { current: "GH₵60", old: "GH₵120" }
//         },
//         KE: {
//             pbi_beg: { current: "KSh 800", old: "KSh 1,500" },
//             pbi_exp: { current: "KSh 1,100", old: "KSh 2000" },
//             vba_beg: { current: "KSh 900", old: "KSh 1500" },
//             vba_exp: { current: "KSh 1,100", old: "KSh 2,000" },
//             // pdf_guide1: { current: "KSh 600", old: "KSh 1,200" }
//         },
//         ZA: {
//             pbi_beg: { current: "R 140", old: "R 300" },
//             pbi_exp: { current: "R 280", old: "R 550" },
//             vba_beg: { current: "R 110", old: "R 220" },
//             vba_exp: { current: "R 280", old: "R 550" },
//             // pdf_guide1: { current: "R 75", old: "R 150" }
//         },
//     };

//     // 2. Structured digital catalog carrying explicit category definitions
//     const digitalProducts = [
//         {
//             id: "pbi_beg",
//             category: "POWER BI",
//             title: "Beginner to Expert Power BI Course",
//             image: "./Bi Image.webp",
//             link: "https://selar.com/damsolmanalytics"
//         },
//         {
//             id: "pbi_exp",
//             category: "POWER BI",
//             title: "Intermediate to Expert Power BI Course",
//             image: "./Expert image.webp",
//             link: "https://selar.com/expertpowerbi"
//         },
//         {
//             id: "vba_beg",
//             category: "VBA",
//             title: "VBA Beginner Course",
//             image: "./VBA Beginner Img.webp",
//             link: "https://selar.com/vbabeginnercourse"
//         },
//         {
//             id: "vba_exp",
//             category: "VBA",
//             title: "VBA Intermediate to Expert Course",
//             image: "./Interm to Expert Img.webp",
//             link: "https://selar.com/vbaexpertcourse"
//         },
//         // {
//         //     id: "pdf_guide1",
//         //     category: "PDF GUIDE",
//         //     title: "Data Clean & Transformation Playbook",
//         //     image: "./VBA Beginner Img.webp", // Replace with your true PDF thumbnail asset path
//         //     link: "https://selar.com/"
//         // }
//     ];

//     const gridTarget = document.getElementById("product-grid-target");
//     const filterButtons = document.querySelectorAll(".filter-btn");
    
//     let activePricing = globalPricingGrid['US']; // Global default fallback initialization

//     // 3. Central Router Core to pinpoint visitor location safely
//     async function initAllProductsStore() {
//         if (!gridTarget) return;

//         let country = null;
//         try {
//             const response = await fetch('https://ipapi.co/json/');
//             if (response.ok) {
//                 const geoData = await response.json();
//                 country = geoData.country_code;
//             } else {
//                 throw new Error("ipapi.co failed");
//             }
//         } catch (error) {
//             console.warn("Primary IP routing channel blocked. Connecting secure backup fallback...");
//             try {
//                 const backupResponse = await fetch('https://ip2c.org/s');
//                 if (backupResponse.ok) {
//                     const text = await backupResponse.text();
//                     const parts = text.split(';');
//                     if (parts[0] === '1') country = parts[1];
//                 }
//             } catch (backupError) {
//                 console.error("All geo IP APIs timed out. Defaulting catalog interface currency to USD.", backupError);
//             }
//         }

//         if (country && globalPricingGrid[country]) {
//             activePricing = globalPricingGrid[country];
//         }

//         // Run default view display on initial layout generation
//         renderCatalog("ALL");
//         setupFilterListeners();
//     }

//     // 4. Isolation Render Engine to build cards selectively
//     function renderCatalog(selectedCategory) {
//         // Filter catalog objects cleanly without mutation errors
//         const filteredProducts = digitalProducts.filter(product => {
//             return selectedCategory === "ALL" || product.category === selectedCategory;
//         });

//         if (filteredProducts.length === 0) {
//             gridTarget.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #A0A5C0; padding: 2rem;">No items currently available in this category.</p>`;
//             return;
//         }

//         gridTarget.innerHTML = filteredProducts.map(product => {
//             // Locate price metrics explicitly matching by structural item ID string
//             const priceInfo = activePricing[product.id] || globalPricingGrid['US'][product.id];

//             return `
//                 <article>
//                     <div class="specialist__image">
//                         <img src="${product.image}" alt="${product.title}">
//                     </div>
//                     <div class="specialist__details">
//                         <a href="${product.link}" target="_blank" style="text-decoration: none; color: inherit;">
//                             <h5>${product.title}</h5>
//                         </a>
//                         <small>Price: <span style="font-weight: bold; color: green;">${priceInfo.current}</span> <del style="color: red; text-decoration-color: red; margin-left: 5px;">${priceInfo.old}</del></small>
//                     </div> 
//                     <div class="specialist__socials">
//                         <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
//                         <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
//                     </div>
//                     <a href="${product.link}" class="specialist__whatsapp" target="_blank">View</a>
//                 </article>
//             `;
//         }).join('');
//     }

//     // 5. Click listener bindings for filter dashboard buttons
//     function setupFilterListeners() {
//         filterButtons.forEach(button => {
//             button.addEventListener("click", function () {
//                 // Instantly swap styling focus
//                 filterButtons.forEach(btn => btn.classList.remove("active"));
//                 this.classList.add("active");

//                 // Grab requested criteria and call render mapping pipeline
//                 const categorySelection = this.getAttribute("data-filter");
//                 renderCatalog(categorySelection);
//             });
//         });
//     }

//     initAllProductsStore();
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const globalPricingGrid = {
//         NG: [
//             { current: "₦5,000", old: "₦12,500" },  
//             { current: "₦7,000", old: "₦18,000" },  
//             { current: "₦4,000", old: "₦9,000" },   
//             { current: "₦7,000", old: "₦18,000" }   
//         ],
//         US: [
//             { current: "$9.99", old: "$24.99" }, { current: "$19.99", old: "$39.99" },
//             { current: "$7.99", old: "$19.99" }, { current: "$19.99", old: "$39.99" }
//         ],
//         GB: [
//             { current: "£7.99", old: "£19.99" }, { current: "£14.99", old: "£34.99" },
//             { current: "£5.99", old: "£14.99" }, { current: "£14.99", old: "£34.99" }
//         ],
//         GH: [
//             { current: "GH₵120", old: "GH₵250" }, { current: "GH₵220", old: "GH₵450" },
//             { current: "GH₵100", old: "GH₵200" }, { current: "GH₵220", old: "GH₵450" }
//         ],
//         KE: [
//             { current: "KSh 1,100", old: "KSh 2,500" }, { current: "KSh 2,200", old: "KSh 4,500" },
//             { current: "KSh 900", old: "KSh 2,000" }, { current: "KSh 2,200", old: "KSh 4,500" }
//         ],
//         ZA: [
//             { current: "R 140", old: "R 300" }, { current: "R 280", old: "R 550" },
//             { current: "R 110", old: "R 220" }, { current: "R 280", old: "R 550" }
//         ]
//     };

//     const allCatalogProducts = [
//         {
//             title: "Beginner to Expert Power BI Course",
//             image: "./Bi Image.webp",
//             tag: "POWER BI",
//             desc: "Master asset mapping and data shaping pipelines from absolute scratch. Includes fully managed custom dashboards and workflow metrics.",
//             selarSlug: "damsolmanalytics" 
//         },
//         {
//             title: "Intermediate to Expert Power BI Course",
//             image: "./Expert image.webp",
//             tag: "POWER BI",
//             desc: "Advanced relational data modeling blueprints, enterprise DAX optimizations, and robust production matrix tracking paradigms.",
//             selarSlug: "expertpowerbi"
//         },
//         {
//             title: "VBA Beginner Course",
//             image: "./VBA Beginner Img.webp",
//             tag: "VBA",
//             desc: "Eliminate repetitive tasks. Learn custom syntax configurations, execution statement loops, and deep environment macro recording controls.",
//             selarSlug: "vbabeginnercourse"
//         },
//         {
//             title: "VBA Intermediate to Expert Course",
//             image: "./Interm to Expert Img.webp",
//             tag: "VBA",
//             desc: "Object-oriented scripting schemas, multi-app database link controls, and advanced automated application design models.",
//             selarSlug: "vbaexpertcourse"
//         }
//     ];

//     const gridTarget = document.getElementById("product-grid-target");
//     let currentFilter = "ALL";
//     let activePricing = globalPricingGrid["US"];

//     async function initCatalogGrid() {
//         if (!gridTarget) return;

//         try {
//             const res = await fetch("https://ipapi.co/json/");
//             if (res.ok) {
//                 const data = await res.json();
//                 if (globalPricingGrid[data.country_code]) {
//                     activePricing = globalPricingGrid[data.country_code];
//                 }
//             } else {
//                 throw new Error("429 Rate Limit hit");
//             }
//         } catch (e) {
//             console.warn("ipapi rate limited or blocked, running ip2c resolution...");
//             try {
//                 const bkRes = await fetch("https://ip2c.org/s");
//                 const text = await bkRes.text();
//                 const parts = text.split(";");
//                 if (parts[0] === "1" && globalPricingGrid[parts[1]]) {
//                     activePricing = globalPricingGrid[parts[1]];
//                 }
//             } catch (err) {
//                 console.error("Using default USD pricing.");
//             }
//         }

//         renderDisplay();
//         setupFilters();
//     }

//     function renderDisplay() {
//         gridTarget.innerHTML = allCatalogProducts.map((prod, idx) => {
//             if (currentFilter !== "ALL" && prod.tag !== currentFilter) return "";
//             const price = activePricing[idx] || globalPricingGrid["US"][idx];

//             return `
//                 <article class="product-card">
//                     <div class="specialist__image">
//                         <img src="${prod.image}" alt="${prod.title}">
//                     </div>
//                     <div class="specialist__details">
//                         <a href="javascript:void(0)" onclick="openDirectSelar('${prod.selarSlug}')" style="text-decoration: none; color: inherit;">
//                             <h5>${prod.title}</h5>
//                         </a>
//                         <small>Price: <span style="font-weight:bold; color:green;">${price.current}</span> <span style="color:red; text-decoration:line-through; margin-left:5px;">${price.old}</span></small>
//                     </div>
//                     <a href="javascript:void(0)" class="specialist__whatsapp" onclick="openDirectSelar('${prod.selarSlug}')"> View </a>
//                 </article>
//             `;
//         }).join("");
//     }

//     function setupFilters() {
//         document.querySelectorAll(".filter-btn").forEach(btn => {
//             btn.addEventListener("click", function () {
//                 const activeBtn = document.querySelector(".filter-btn.active");
//                 if (activeBtn) activeBtn.classList.remove("active");
                
//                 this.classList.add("active");
//                 currentFilter = this.getAttribute("data-filter");
//                 renderDisplay();
//             });
//         });
//     }

//     initCatalogGrid();
// });

document.addEventListener("DOMContentLoaded", function () {
    // 1. Geographic pricing matrix
    const globalPricingGrid = {
        NG: [
            { current: "₦5,000", old: "₦12,500" },  // Power BI Beginner
            { current: "₦7,000", old: "₦18,000" },  // Power BI Expert
            { current: "₦4,000", old: "₦9,000" },   // VBA Beginner
            { current: "₦7,000", old: "₦18,000" }   // VBA Expert
        ],
        US: [
            { current: "$9.99", old: "$24.99" },
            { current: "$19.99", old: "$39.99" },
            { current: "$7.99", old: "$19.99" },
            { current: "$19.99", old: "$39.99" }
        ],
        GB: [
            { current: "£7.99", old: "£19.99" },
            { current: "£14.99", old: "£34.99" },
            { current: "£5.99", old: "£14.99" },
            { current: "£14.99", old: "£34.99" }
        ],
        GH: [
            { current: "GH₵120", old: "GH₵250" },
            { current: "GH₵220", old: "GH₵450" },
            { current: "GH₵100", old: "GH₵200" },
            { current: "GH₵220", old: "GH₵450" }
        ],
        KE: [
            { current: "KSh 1,100", old: "KSh 2,500" },
            { current: "KSh 2,200", old: "KSh 4,500" },
            { current: "KSh 900", old: "KSh 2,000" },
            { current: "KSh 2,200", old: "KSh 4,500" }
        ],
        ZA: [
            { current: "R 140", old: "R 300" },
            { current: "R 280", old: "R 550" },
            { current: "R 110", old: "R 220" },
            { current: "R 280", old: "R 550" }
        ]
    };

    // 2. Structural array matching your original catalog
    const allCatalogProducts = [
        {
            title: "Beginner to Expert Power BI Course",
            image: "./Bi Image.webp",
            tag: "POWER BI",
            desc: "Master asset mapping and data shaping pipelines from absolute scratch. Includes fully managed custom dashboards and workflow metrics.",
            selarSlug: "damsolmanalytics" 
        },
        {
            title: "Intermediate to Expert Power BI Course",
            image: "./Expert image.webp",
            tag: "POWER BI",
            desc: "Advanced relational data modeling blueprints, enterprise DAX optimizations, and robust production matrix tracking paradigms.",
            selarSlug: "expertpowerbi"
        },
        {
            title: "VBA Beginner Course",
            image: "./Mastery VBA.webp",
            tag: "VBA",
            desc: "Eliminate repetitive tasks. Learn custom syntax configurations, execution statement loops, and deep environment macro recording controls.",
            selarSlug: "vbabeginnercourse"
        },
        {
            title: "VBA Intermediate to Expert Course",
            image: "./Interm to Expert Img.webp",
            tag: "VBA",
            desc: "Object-oriented scripting schemas, multi-app database link controls, and advanced automated application design models.",
            selarSlug: "vbaexpertcourse"
        }
    ];

    // DOM References
    const gridTarget = document.getElementById("product-grid-target");
    const promoModal = document.getElementById("promo-slide-modal");
    const closeBtn = document.getElementById("close-promo-btn");
    const bookImg = document.getElementById("promo-book-img");
    const promoBadge = document.getElementById("promo-badge");
    const promoTitle = document.getElementById("promo-title");
    const promoDesc = document.getElementById("promo-description");
    const promoPriceContainer = document.getElementById("promo-price-container");
    const promoCta = document.getElementById("promo-cta-btn");

    // Dynamic State Trackers
    let currentFilter = "ALL";
    let activePricing = globalPricingGrid["US"]; // Fallback
    let currentBundleIndex = 0;
    let hasReachedThreshold = false;
    let autoRotateInterval = null;
    let reappearTimeout = null;
    let isNaira = false;

    // Helper: Extracts clean numeric values
    function parseNumber(priceStr) {
        return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    }

    // Helper: Extracts localized currency prefix
    function getCurrencySymbol(priceStr) {
        return priceStr.replace(/[0-9.,\s]/g, '');
    }

    // Helper: Rounding engine
    function formatCurrency(symbol, amount) {
        if (isNaira) {
            // NGN rounded down to clean whole integer
            return `${symbol}${Math.floor(amount).toLocaleString()}`;
        } else {
            // Global currencies rounded down and appended with .99 standard pricing
            const wholeUnit = Math.floor(amount);
            return `${symbol}${wholeUnit}.99`;
        }
    }

    // 3. Initialize dynamic storefront
    async function initCatalogGrid() {
        let country = null;

        try {
            const res = await fetch("https://ipapi.co/json/");
            if (res.ok) {
                const data = await res.json();
                country = data.country_code;
            } else {
                throw new Error("429 Rate Limit hit");
            }
        } catch (e) {
            console.warn("Primary IP API lookup rate-limited. Trying backup...");
            try {
                const bkRes = await fetch("https://ip2c.org/s");
                if (bkRes.ok) {
                    const text = await bkRes.text();
                    const parts = text.split(";");
                    if (parts[0] === "1") {
                        country = parts[1];
                    }
                }
            } catch (err) {
                console.error("Using default USD pricing.");
            }
        }

        if (country && globalPricingGrid[country]) {
            activePricing = globalPricingGrid[country];
            isNaira = (country === 'NG');
        } else {
            isNaira = false;
        }

        renderDisplay();
        setupFilters();
    }

    // Render Grid with pricing and classes
    function renderDisplay() {
        if (!gridTarget) return;

        gridTarget.innerHTML = allCatalogProducts.map((prod, idx) => {
            if (currentFilter !== "ALL" && prod.tag !== currentFilter) return "";
            const price = activePricing[idx] || globalPricingGrid["US"][idx];

            return `
                <article class="product-card">
                    <div class="specialist__image">
                        <img src="${prod.image}" alt="${prod.title}">
                    </div>
                    <div class="specialist__details">
                        <a href="javascript:void(0)" onclick="openDirectSelar('${prod.selarSlug}')" style="text-decoration: none; color: inherit;">
                            <h5>${prod.title}</h5>
                        </a>
                        <small>Price: <span style="font-weight:bold; color:green;">${price.current}</span> <span style="color:red; text-decoration:line-through; margin-left:5px;">${price.old}</span></small>
                    </div>
                    <a href="javascript:void(0)" class="specialist__whatsapp" onclick="openDirectSelar('${prod.selarSlug}')"> View </a>
                </article>
            `;
        }).join("");
    }

    // Set up filter buttons
    function setupFilters() {
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const activeBtn = document.querySelector(".filter-btn.active");
                if (activeBtn) activeBtn.classList.remove("active");
                
                this.classList.add("active");
                currentFilter = this.getAttribute("data-filter");
                renderDisplay();
            });
        });
    }

    // Update Modal Details dynamically with math formulas
    function updatePromoModal() {
        if (!promoModal) return;

        const biBegVal = parseNumber(activePricing[0].current);
        const biExpVal = parseNumber(activePricing[1].current);
        const vbaBegVal = parseNumber(activePricing[2].current);
        const vbaExpVal = parseNumber(activePricing[3].current);

        const currencySymbol = getCurrencySymbol(activePricing[0].current);

        // Power BI: 16.66% off sum of Beginner + Expert
        const biSum = biBegVal + biExpVal;
        const biDiscounted = biSum * (1 - 0.1666);

        // VBA: 9.09% off sum of Beginner + Expert
        const vbaSum = vbaBegVal + vbaExpVal;
        const vbaDiscounted = vbaSum * (1 - 0.0909);

        const promoBundles = [
            {
                title: "Power BI Complete Bundle",
                badge: "16.66% OFF BUNDLE",
                image: "./Mastery Power BI.webp",
                slug: "masterypowerbi",
                description: "Master Power BI from data extraction to enterprise dashboards. Get the complete bundle pack today!",
                oldPriceFormatted: formatCurrency(currencySymbol, biSum),
                currentPriceFormatted: formatCurrency(currencySymbol, biDiscounted)
            },
            {
                title: "VBA Automation Expert Bundle",
                badge: "9.09% OFF BUNDLE",
                image: "./VBA Beginner Img.webp",
                slug: "masteryvba",
                description: "Automate dry Excel workflows and write clean macros. Save instantly with the combined bundle pack!",
                oldPriceFormatted: formatCurrency(currencySymbol, vbaSum),
                currentPriceFormatted: formatCurrency(currencySymbol, vbaDiscounted)
            }
        ];

        const activePromo = promoBundles[currentBundleIndex];

        bookImg.src = activePromo.image;
        bookImg.alt = activePromo.title;
        promoBadge.textContent = activePromo.badge;
        promoTitle.textContent = activePromo.title;
        promoDesc.textContent = activePromo.description;
        
        promoPriceContainer.innerHTML = `
            <span>Price: </span>
            <span class="promo-price-current">${activePromo.currentPriceFormatted}</span>
            <span class="promo-price-old">${activePromo.oldPriceFormatted}</span>
        `;
        
        promoCta.onclick = function() {
            openDirectSelar(activePromo.slug);
        };

        // Ready next index
        currentBundleIndex = (currentBundleIndex + 1) % promoBundles.length;
    }

    // Transition effect: slide out -> swap details -> slide back in
    function transitionPromoContent() {
        if (!promoModal) return;
        
        promoModal.classList.remove("active");

        setTimeout(function() {
            updatePromoModal();
            setTimeout(function() {
                promoModal.classList.add("active");
            }, 100);
        }, 500);
    }

    // Rotations & Active Checks
    function startAutoRotation() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        
        autoRotateInterval = setInterval(function() {
            if (promoModal && promoModal.classList.contains("active")) {
                transitionPromoContent();
            }
        }, 20000); // 20-second inactivity loop
    }

    function stopAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    function showPromoModal() {
        if (!promoModal) return;
        promoModal.classList.add("active");
        startAutoRotation();
    }

    function hidePromoModal() {
        if (!promoModal) return;
        promoModal.classList.remove("active");
        stopAutoRotation();

        // If cancelled by user, wait 10 seconds before sliding in the alternate offer
        reappearTimeout = setTimeout(function() {
            const currentScroll = window.scrollY || window.pageYOffset;
            const triggerHeight = window.innerHeight;

            if (currentScroll > triggerHeight) {
                updatePromoModal();
                showPromoModal();
            } else {
                hasReachedThreshold = false;
                window.addEventListener("scroll", handleScroll);
            }
        }, 10000);
    }

    function handleScroll() {
        const triggerHeight = window.innerHeight;
        const currentScroll = window.scrollY || window.pageYOffset;

        if (!hasReachedThreshold && currentScroll > triggerHeight) {
            hasReachedThreshold = true;
            updatePromoModal();
            showPromoModal();
            window.removeEventListener("scroll", handleScroll);
        }
    }

    if (closeBtn) closeBtn.addEventListener("click", hidePromoModal);
    window.addEventListener("scroll", handleScroll);

    initCatalogGrid();
});

// TOP SELLING PRODUCTS

// document.addEventListener("DOMContentLoaded", function () {
//     // 1. Geographic pricing matrix matching your product order
//     const globalPricingGrid = {
//         NG: [
//             { current: "₦5,000", old: "₦12,500" },  // Power BI Beginner
//             { current: "₦7,000", old: "₦18,000" },  // Power BI Expert
//             { current: "₦4,000", old: "₦9,000" },   // VBA Beginner
//             { current: "₦7,000", old: "₦18,000" }   // VBA Expert
//         ],
//         US: [
//             { current: "$9.99", old: "$24.99" },
//             { current: "$19.99", old: "$39.99" },
//             { current: "$7.99", old: "$19.99" },
//             { current: "$19.99", old: "$39.99" }
         
//         ],
//         GB: [
//             { current: "£7.99", old: "£19.99" },
//             { current: "£14.99", old: "£34.99" },
//             { current: "£5.99", old: "£14.99" },
//             { current: "£14.99", old: "£34.99" }
//         ],
//         GH: [
//             { current: "GH₵120", old: "GH₵250" },
//             { current: "GH₵220", old: "GH₵450" },
//             { current: "GH₵100", old: "GH₵200" },
//             { current: "GH₵220", old: "GH₵450" }
         
//         ],
//         KE: [
//               { current: "KSh 800", old: "KSh 1,500" },
//             { current: "KSh 1,100", old: "KSh 2,000" },
//             { current: "KSh 900", old: "KSh 1,500" },
//             { current: "KSh 1,100", old: "KSh 2,000" }
//         ],
//         ZA: [
//             { current: "R 140", old: "R 300" },
//             { current: "R 280", old: "R 550" },
//             { current: "R 110", old: "R 220" },
//             { current: "R 280", old: "R 550" }
//         ]
//     };

//     // 2. Your structural array
//     const topProducts = [
//         {
//             title: "Beginner to Expert Power BI Course",
//             image: "./Bi Image.webp",
//             link: "https://selar.com/damsolmanalytics"
//         },
//         {
//             title: "Intermediate to Expert Power BI Course",
//             image: "./Expert image.webp",
//             link: "https://selar.com/expertpowerbi"
//         },
//         {
//             title: "VBA Beginner Course",
//             image: "./VBA Beginner Img.webp",
//             link: "https://selar.com/vbabeginnercourse"
//         },
//         {
//             title: "VBA Intermediate to Expert Course",
//             image: "./Interm to Expert Img.webp",
//             link: "https://selar.com/vbaexpertcourse"
//         }
//     ];

//     const topGridTarget = document.getElementById("top-products-grid");

//     // 3. Execution function to find location and inject correct structure
//     async function initDynamicStore() {
//         if (!topGridTarget) return;

//         let activePricing = globalPricingGrid['US']; // Global default fallback
//         let country = null;

//         try {
//             // Primary attempt using ipapi.co
//             const response = await fetch('https://ipapi.co/json/');
//             if (response.ok) {
//                 const geoData = await response.json();
//                 country = geoData.country_code;
//             } else {
//                 throw new Error("ipapi.co failed");
//             }
//         } catch (error) {
//             console.warn("Primary IP lookup failed or blocked. Trying secure backup...");
//             try {
//                 // Secondary absolute bulletproof backup (ip2c.org supports free SSL/HTTPS)
//                 const backupResponse = await fetch('https://ip2c.org/s');
//                 if (backupResponse.ok) {
//                     const text = await backupResponse.text();
//                     const parts = text.split(';');
//                     if (parts[0] === '1') {
//                         country = parts[1]; // Returns 2-letter ISO country code (e.g., NG, US)
//                     }
//                 }
//             } catch (backupError) {
//                 console.error("All IP lookups failed. Defaulting to standard USD prices.", backupError);
//             }
//         }

//         // Apply country pricing grid if found
//         if (country && globalPricingGrid[country]) {
//             activePricing = globalPricingGrid[country];
//         }

//         // 4. Render DOM elements mapping item structural details with geolocated prices
//         topGridTarget.innerHTML = topProducts.map((product, index) => {
//             const priceInfo = activePricing[index] || globalPricingGrid['US'][index];
            
//             return `
//                 <article>
//                     <div class="specialist__image">
//                         <img src="${product.image}" alt="${product.title}">
//                     </div>
//                     <div class="specialist__details">
//                          <a href="${product.link}" target="_blank" style="text-decoration: none; color: inherit;">
//                             <h5>${product.title}</h5>
//                         </a>
//                         <small>Price: <span style="font-weight: bold; color: green;">${priceInfo.current}</span> <del style="color: red; text-decoration-color: red; margin-left: 5px;">${priceInfo.old}</del></small>
//                     </div> 
//                     <div class="specialist__socials">
//                         <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
//                         <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
//                     </div>
//                     <a href="${product.link}" class="specialist__whatsapp" target="_blank">View</a>
//                 </article>
//             `;
//         }).join('');
//     }

//     // Crucial: Fire the function execution!
//     initDynamicStore();
// });

// TOP SELLING PRODUCTS

document.addEventListener("DOMContentLoaded", function () {
    // 1. Geographic pricing matrix matching your product order
    const globalPricingGrid = {
        NG: [
            { current: "₦5,000", old: "₦12,500" },  // Power BI Beginner
            { current: "₦7,000", old: "₦18,000" },  // Power BI Expert
            { current: "₦4,000", old: "₦9,000" },   // VBA Beginner
            { current: "₦7,000", old: "₦18,000" }   // VBA Expert
        ],
        US: [
            { current: "$9.99", old: "$24.99" },
            { current: "$19.99", old: "$39.99" },
            { current: "$7.99", old: "$19.99" },
            { current: "$19.99", old: "$39.99" }
        ],
        GB: [
            { current: "£7.99", old: "£19.99" },
            { current: "£14.99", old: "£34.99" },
            { current: "£5.99", old: "£14.99" },
            { current: "£14.99", old: "£34.99" }
        ],
        GH: [
            { current: "GH₵120", old: "GH₵250" },
            { current: "GH₵220", old: "GH₵450" },
            { current: "GH₵100", old: "GH₵200" },
            { current: "GH₵220", old: "GH₵450" }
        ],
        KE: [
            { current: "KSh 800", old: "KSh 1,500" },
            { current: "KSh 1,100", old: "KSh 2,000" },
            { current: "KSh 900", old: "KSh 1,500" },
            { current: "KSh 1,100", old: "KSh 2,000" }
        ],
        ZA: [
            { current: "R 140", old: "R 300" },
            { current: "R 280", old: "R 550" },
            { current: "R 110", old: "R 220" },
            { current: "R 280", old: "R 550" }
        ]
    };

    // 2. Structural array utilizing slugs for popups
    const topProducts = [
        {
            title: "Beginner to Expert Power BI Course",
            image: "./Bi Image.webp",
            selarSlug: "damsolmanalytics"
        },
        {
            title: "Intermediate to Expert Power BI Course",
            image: "./Expert image.webp",
            selarSlug: "expertpowerbi"
        },
        {
            title: "VBA Beginner Course",
            image: "./Mastery VBA.webp",
            selarSlug: "vbabeginnercourse"
        },
        {
            title: "VBA Intermediate to Expert Course",
            image: "./Interm to Expert Img.webp",
            selarSlug: "vbaexpertcourse"
        }
    ];

    const topGridTarget = document.getElementById("top-products-grid");

    // 3. Execution function to find location and inject correct structure
    async function initDynamicStore() {
        if (!topGridTarget) return;

        let activePricing = globalPricingGrid['US']; // Global default fallback
        let country = null;

        try {
            // Primary attempt using ipapi.co
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const geoData = await response.json();
                country = geoData.country_code;
            } else {
                throw new Error("ipapi.co failed");
            }
        } catch (error) {
            console.warn("Primary IP lookup failed or blocked. Trying secure backup...");
            try {
                // Secondary absolute bulletproof backup
                const backupResponse = await fetch('https://ip2c.org/s');
                if (backupResponse.ok) {
                    const text = await backupResponse.text();
                    const parts = text.split(';');
                    if (parts[0] === '1') {
                        country = parts[1]; // Returns 2-letter ISO country code (e.g., NG, US)
                    }
                }
            } catch (backupError) {
                console.error("All IP lookups failed. Defaulting to standard USD prices.", backupError);
            }
        }

        // Apply country pricing grid if found
        if (country && globalPricingGrid[country]) {
            activePricing = globalPricingGrid[country];
        }

        // 4. Render DOM elements mapping item structural details with popup anchor tags
        topGridTarget.innerHTML = topProducts.map((product, index) => {
            const priceInfo = activePricing[index] || globalPricingGrid['US'][index];
            
            return `
                <article>
                    <div class="specialist__image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="specialist__details">
                         <a href="javascript:void(0)" onclick="openDirectSelar('${product.selarSlug}')" style="text-decoration: none; color: inherit;">
                            <h5>${product.title}</h5>
                        </a>
                     <small>Price: <span style="font-weight:bold; color:green;">${priceInfo.current}</span> <span style="color:red; text-decoration:line-through; margin-left:5px;">${priceInfo.old}</span></small>
                    </div> 
                    <div class="specialist__socials">
                        <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
                        <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
                    </div>
                    <a href="javascript:void(0)" class="specialist__whatsapp" onclick="openDirectSelar('${product.selarSlug}')">
                        View
                    </a>
                </article>
            `;
        }).join('');
    }

    // Fire the function execution
    initDynamicStore();
});

// TESTIMONIALS SECTION (swiper js)
const progressContent = document.querySelector(".autoplay-progress span");

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: false,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    // Responsive BreakPoints
    breakpoints: {
        600: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    on: {
        autoplayTimeLeft(s, time, progress) {
            // Check if progressContent exists before changing text to prevent errors
            if (progressContent) {
                progressContent.textContent = `${Math.ceil(time / 1000)}s`;
            }
            
            /* CRITICAL FIX: Commented out or deleted the line below because 
               progressCircle is undefined. This was freezing your slider.
            */
            // progressCircle.style.setProperty("--progress", 1 - progress);
        }
    }
});





// FAQ ACCORDION TOGGLE
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
    const questionBlock = item.querySelector('.faq__question');
    
    questionBlock.addEventListener('click', () => {
        // Check if current item is already open
        const isOpen = item.classList.contains('active');
        
        // OPTIONAL: Close any other open FAQ items first (Accordion Mode)
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        // If it wasn't open, toggle it open now
        if (!isOpen) {
            item.classList.add('active');
        }
    });
});

// Reviews

document.addEventListener("DOMContentLoaded", function () {
   // 1. Array filled with your specific new user reviews and text profiles
const customerReviews = [
    {
        name: "Christopher Thompson",
        role: "Dashboard Specialist",
        avatar: "./placeholder img.jpg",
        review: "This Power BI Advanced Course has been incredibly insightful and exceeded my expectations. It covers everything I needed to know, from data modeling and Power Query to DAX calculations and interactive dashboard design. The explanations are clear, practical, and easy to follow, making even advanced concepts understandable. I especially appreciate the real-world examples and hands-on approach. I highly recommend this course to anyone looking to take their Power BI skills from intermediate to advanced level."
    },
    {
        name: "Ignatus Williams",
        role: "Business Owner / Retailer",
        avatar: "./placeholder img.jpg",
        review: "I didn't buy this for a corporate job; I bought it to get a clearer picture of my sales and inventory. Connecting Power BI to my spreadsheets using the methods taught here has opened my eyes to where my profit leaks are. It gives you the kind of deep insights that would cost thousands to hire a consultant for. Total steal!"
    },
    {
        name: "Kolawole Festus",
        role: "Finance Professional",
        avatar: "./placeholder img.jpg",
        review: "As a finance professional, standard reporting can get incredibly tedious. This material showed me how to connect multiple data sources seamlessly and create dynamic variance analysis reports. It has given me a serious competitive edge in my department. It’s an absolute bargain for the transformation it delivers."
    },
    {
        name: "Blessing Jeremiah",
        role: "Aspiring Data Analyst",
        avatar: "./placeholder img.jpg",
        review: "I’m transitioning from a non-tech background into Data Analytics and needed something practical to build my portfolio. This material didn't just teach me buttons to click; it taught me the logic behind data visualization. The project ideas inside are so realistic that I'm already modifying one for my GitHub portfolio. Extremely high value for money."
    },
    {
        name: "Ibrahim Suleiman",
        role: "Operations Analyst",
        avatar: "./placeholder img.jpg",
        review: "What used to take me a whole day of manual copy-pasting in Excel is now a automated 5-minute refresh in Power BI, all thanks to the Power Query hacks taught in this material. The section on cleaning messy data alone is worth 5x the price of the whole course. If you value your time, this is a no-brainer investment."
    },
    {
        name: "Chidinma Oghechi",
        role: "Data Management Trainee",
        avatar: "./placeholder img.jpg",
        review: "YouTube videos almost gave me a headache with all the technical jargon. I took a chance on this Selar material, and I’m so glad I did. The way the concepts were broken down made DAX feel less intimidating. For the first time, CALCULATE and RELATED actually make sense to me. If you’re scared of data, just get this. It’s worth every penny."
    },
    {
        name: "Feyi Oluwasegun",
        role: "Report Developer",
        avatar: "./placeholder img.jpg",
        review: "This Power BI course has been incredibly useful and practical. I absolutely love it because it focuses on real-world applications and gets the job done. The lessons are clear, hands-on, and easy to follow, making it easy to apply what I learn immediately in my work. It has significantly improved my understanding of Power BI and helped me build reports and dashboards with confidence. I highly recommend this course to anyone looking to gain practical Power BI skills. It delivered exactly what it promised."
    },
    {
        name: "Samuel Oye",
        role: "Financial Analyts",
        avatar: "./placeholder img.jpg",
        review: "Well explanatory and easy to understand"
    }
];

    // 2. Select the container target element
    const testimonialsTarget = document.getElementById("testimonials-target");

    // 3. Inject the formatted slides dynamically
    if (testimonialsTarget) {
        testimonialsTarget.innerHTML = customerReviews.map(item => `
            <article class="swiper-slide">
                <p>${item.review}</p>
                <div class="patient">
                    <div class="avatar">
                        <img src="${item.avatar}" alt="${item.name}">
                    </div>
                    <div class="patient__details">
                        <h5>${item.name}</h5>
                        <small>${item.role}</small>
                    </div>
                </div>
            </article>
        `).join('');
    }

    // 4. YOUR SWIPER INITIALIZATION CODE (Keep your existing Swiper code block right here)
    // var swiper = new Swiper(".mySwiper", { ... });
});


// reveal/ fade in section animation

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    // Initialize: Add the base hidden class to all sections immediately
    sections.forEach(section => {
        section.classList.add("scroll-reveal");
    });

    // Configuration for the Intersection Observer
    const observerOptions = {
        root: null,          // Uses the viewport
        rootMargin: "0px",
        threshold: 0.15      // Triggers when 15% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the section has scrolled into view
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target); // Stops observing once revealed (improves performance)
            }
        });
    }, observerOptions);

    // Attach observer to each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
