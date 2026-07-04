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


// ALL PRODUCTS

document.addEventListener("DOMContentLoaded", function () {
    // 1. Geographic pricing matrix matching the ALL PRODUCTS grid order
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

    // 2. Structural array with prices stripped out
    const digitalProducts = [
        {
            title: "Beginner to Expert Power BI Course",
            image: "./assets/Bi Image.png",
            link: "https://selar.com/damsolmanalytics"
        },
        {
            title: "Intermediate to Expert Power BI Course",
            image: "./assets/Expert image.png",
            link: "https://selar.com/expertpowerbi"
        },
        {
            title: "VBA Beginner Course",
            image: "./assets/VBA Beginner Img.png",
            link: "https://selar.com/vbabeginnercourse"
        },
        {
            title: "VBA Intermediate to Expert Course",
            image: "./assets/Interm to Expert Img.png",
            link: "https://selar.com/vbaexpertcourse"
        }
    ];

    // Select the target location container
    const gridTarget = document.getElementById("product-grid-target");

    // 3. Execution function to handle IP routing and rendering
    async function initAllProductsStore() {
        if (!gridTarget) return;

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
            console.warn("Primary IP lookup failed or blocked for All Products grid. Trying secure backup...");
            try {
                // Secondary HTTPS backup
                const backupResponse = await fetch('https://ip2c.org/s');
                if (backupResponse.ok) {
                    const text = await backupResponse.text();
                    const parts = text.split(';');
                    if (parts[0] === '1') {
                        country = parts[1];
                    }
                }
            } catch (backupError) {
                console.error("All IP lookups failed for All Products grid. Defaulting to USD.", backupError);
            }
        }

        // Apply country pricing grid if found
        if (country && globalPricingGrid[country]) {
            activePricing = globalPricingGrid[country];
        }

        // 4. Clear target element and execute template literal map loop
        gridTarget.innerHTML = digitalProducts.map((product, index) => {
            const priceInfo = activePricing[index] || globalPricingGrid['US'][index];
            
            return `
                <article>
                    <div class="specialist__image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="specialist__details">
                        <a href="${product.link}" target="_blank" style="text-decoration: none; color: inherit;">
                            <h5>${product.title}</h5>
                        </a>
                        <small>Price: <span style="font-weight: bold; color: green;">${priceInfo.current}</span> <del style="color: red; text-decoration-color: red; margin-left: 5px;">${priceInfo.old}</del></small>
                    </div> 
                    <div class="specialist__socials">
                        <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
                        <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
                    </div>
                    <a href="${product.link}" class="specialist__whatsapp" target="_blank">View</a>
                </article>
            `;
        }).join('');
    }

    // Fire execution for the main grid!
    initAllProductsStore();
});


// TOP SELLING PRODUCTS

// document.addEventListener("DOMContentLoaded", function () {
//     // 1. Centralized Array for Top Selling Products
//     const topProducts = [
//         {
//             title: "Beginner to Expert Power BI Course",
//             image: "./assets/Bi Image.png",
//             currentPrice: "₦5,000",
//             oldPrice: "₦10,000",
//             link: "https://selar.com/damsolmanalytics"
//         },
//         {
//             title: "Intermediate to Expert Power BI Course",
//             image: "./assets/Expert image.png",
//             currentPrice: "₦7,000",
//             oldPrice: "₦11,000",
//             link: "https://selar.com/expertpowerbi"
//         },
//         {
//             title: "VBA Beginner Course",
//             image: "./assets/VBA Beginner Img.png",
//             currentPrice: "₦4,000",
//             oldPrice: "₦9,000",
//             link: "https://selar.com/vbabeginnercourse"
//         },
//         {
//             title: "VBA Intermediate to Expert Course",
//             image: "./assets/Interm to Expert Img.png",
//             currentPrice: "₦7,000",
//             oldPrice: "₦11,000",
//             link: "https://selar.com/vbaexpertcourse"
//         }
//     ];

//     // 2. Safely capture the specific Top Selling container
//     const topGridTarget = document.getElementById("top-products-grid");

//     // 3. Render items dynamically if the container is present on the current page
//     if (topGridTarget) {
//         topGridTarget.innerHTML = topProducts.map(product => `
//             <article>
//                 <div class="specialist__image">
//                     <img src="${product.image}" alt="${product.title}">
//                 </div>
//                 <div class="specialist__details">
//                      <a href="${product.link}" target="_blank" style="text-decoration: none; color: inherit;">
//                         <h5>${product.title}</h5>
//                     </a>
//                     <small>Price: <span style="font-weight: bold; color: green;">${product.currentPrice}</span> <del style="color: red; text-decoration-color: red; margin-left: 5px;">${product.oldPrice}</del></small>
//                 </div> 
//                 <div class="specialist__socials">
//                     <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
//                     <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
//                 </div>
//                 <a href="${product.link}" class="specialist__whatsapp" target="_blank">View</a>
//             </article>
//         `).join('');
//     }
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

    // 2. Your structural array
    const topProducts = [
        {
            title: "Beginner to Expert Power BI Course",
            image: "./assets/Bi Image.png",
            link: "https://selar.com/damsolmanalytics"
        },
        {
            title: "Intermediate to Expert Power BI Course",
            image: "./assets/Expert image.png",
            link: "https://selar.com/expertpowerbi"
        },
        {
            title: "VBA Beginner Course",
            image: "./assets/VBA Beginner Img.png",
            link: "https://selar.com/vbabeginnercourse"
        },
        {
            title: "VBA Intermediate to Expert Course",
            image: "./assets/Interm to Expert Img.png",
            link: "https://selar.com/vbaexpertcourse"
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
                // Secondary absolute bulletproof backup (ip2c.org supports free SSL/HTTPS)
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

        // 4. Render DOM elements mapping item structural details with geolocated prices
        topGridTarget.innerHTML = topProducts.map((product, index) => {
            const priceInfo = activePricing[index] || globalPricingGrid['US'][index];
            
            return `
                <article>
                    <div class="specialist__image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="specialist__details">
                         <a href="${product.link}" target="_blank" style="text-decoration: none; color: inherit;">
                            <h5>${product.title}</h5>
                        </a>
                        <small>Price: <span style="font-weight: bold; color: green;">${priceInfo.current}</span> <del style="color: red; text-decoration-color: red; margin-left: 5px;">${priceInfo.old}</del></small>
                    </div> 
                    <div class="specialist__socials">
                        <a href="https://linkedin.com" target="_blank"><i class='bx bxl-linkedin'></i></a>
                        <a href="https://twitter.com" target="_blank"><i class='bx bxl-twitter'></i></a>
                    </div>
                    <a href="${product.link}" class="specialist__whatsapp" target="_blank">View</a>
                </article>
            `;
        }).join('');
    }

    // Crucial: Fire the function execution!
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



document.addEventListener("DOMContentLoaded", function () {
   // 1. Array filled with your specific new user reviews and text profiles
const customerReviews = [
    {
        name: "Christopher Thompson",
        role: "Dashboard Specialist",
        avatar: "./assets/placeholder img.jpg",
        review: "This Power BI Advanced Course has been incredibly insightful and exceeded my expectations. It covers everything I needed to know, from data modeling and Power Query to DAX calculations and interactive dashboard design. The explanations are clear, practical, and easy to follow, making even advanced concepts understandable. I especially appreciate the real-world examples and hands-on approach. I highly recommend this course to anyone looking to take their Power BI skills from intermediate to advanced level."
    },
    {
        name: "Ignatus Williams",
        role: "Business Owner / Retailer",
        avatar: "./assets/placeholder img.jpg",
        review: "I didn't buy this for a corporate job; I bought it to get a clearer picture of my sales and inventory. Connecting Power BI to my spreadsheets using the methods taught here has opened my eyes to where my profit leaks are. It gives you the kind of deep insights that would cost thousands to hire a consultant for. Total steal!"
    },
    {
        name: "Kolawole Festus",
        role: "Finance Professional",
        avatar: "./assets/placeholder img.jpg",
        review: "As a finance professional, standard reporting can get incredibly tedious. This material showed me how to connect multiple data sources seamlessly and create dynamic variance analysis reports. It has given me a serious competitive edge in my department. It’s an absolute bargain for the transformation it delivers."
    },
    {
        name: "Blessing Jeremiah",
        role: "Aspiring Data Analyst",
        avatar: "./assets/placeholder img.jpg",
        review: "I’m transitioning from a non-tech background into Data Analytics and needed something practical to build my portfolio. This material didn't just teach me buttons to click; it taught me the logic behind data visualization. The project ideas inside are so realistic that I'm already modifying one for my GitHub portfolio. Extremely high value for money."
    },
    {
        name: "Ibrahim Suleiman",
        role: "Operations Analyst",
        avatar: "./assets/placeholder img.jpg",
        review: "What used to take me a whole day of manual copy-pasting in Excel is now a automated 5-minute refresh in Power BI, all thanks to the Power Query hacks taught in this material. The section on cleaning messy data alone is worth 5x the price of the whole course. If you value your time, this is a no-brainer investment."
    },
    {
        name: "Chidinma Oghechi",
        role: "Data Management Trainee",
        avatar: "./assets/placeholder img.jpg",
        review: "YouTube videos almost gave me a headache with all the technical jargon. I took a chance on this Selar material, and I’m so glad I did. The way the concepts were broken down made DAX feel less intimidating. For the first time, CALCULATE and RELATED actually make sense to me. If you’re scared of data, just get this. It’s worth every penny."
    },
    {
        name: "Feyi Oluwasegun",
        role: "Report Developer",
        avatar: "./assets/placeholder img.jpg",
        review: "This Power BI course has been incredibly useful and practical. I absolutely love it because it focuses on real-world applications and gets the job done. The lessons are clear, hands-on, and easy to follow, making it easy to apply what I learn immediately in my work. It has significantly improved my understanding of Power BI and helped me build reports and dashboards with confidence. I highly recommend this course to anyone looking to gain practical Power BI skills. It delivered exactly what it promised."
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
