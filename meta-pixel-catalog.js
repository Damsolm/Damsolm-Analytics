// /**
//  * Dynamic Meta Pixel & Microdata Scraper
//  * Automatically grabs the current page's actual image, title, and price.
//  */

// (function() {
//   const PIXEL_ID = '1075617971701430'; 

//   // Initialize Pixel Base Code
//   if (!window.fbq) {
//     !function(f,b,e,v,n,t,s)
//     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//     n.queue=[];t=b.createElement(e);t.async=!0;
//     t.src=v;s=b.getElementsByTagName(e)[0];
//     s.parentNode.insertBefore(t,s)}(window, document,'script',
//     'https://connect.facebook.net/en_US/fbevents.js');
    
//     fbq('init', PIXEL_ID);
//     fbq('track', 'PageView');
//   }

//   function getDynamicProductDetails() {
//     const currentUrl = window.location.href;
    
//     // 1. DYNAMICALLY SCRAPE THE IMAGE URL
//     let dynamicImage = "";
//     // Target the image inside the "specialist__image" div
//     const primaryImg = document.querySelector('.product-card .specialist__image img');
//     if (primaryImg) {
//       dynamicImage = primaryImg.src;
//     } else {
//       dynamicImage = "https://www.damsolmhub.com/default-preview.jpg"; // Your fallback
//     }

//     // 2. DYNAMICALLY SCRAPE THE PRODUCT TITLE
//     let dynamicTitle = document.title;
//     // Target the h5 inside the "specialist__details" link
//     const titleEl = document.querySelector('.product-card .specialist__details a h5');
//     if (titleEl) {
//       dynamicTitle = titleEl.innerText.trim();
//     }

//     // 3. DYNAMICALLY SCRAPE THE CURRENT PRICE (excluding the slashed old price)
//     let dynamicPrice = "0.00";
//     // Target the first span inside the <small> element which holds the active current price
//     const priceEl = document.querySelector('.product-card .specialist__details small span');
//     if (priceEl) {
//       // Strip out currency symbols, commas, and spaces (e.g. "₦5,000" or "$49.99" -> "5000" or "49.99")
//       const rawPrice = priceEl.innerText.replace(/[^0-9.]/g, '');
//       if (rawPrice) {
//         dynamicPrice = parseFloat(rawPrice).toFixed(2);
//       }
//     }

//     // 4. GENERATE A UNIQUE ID
//     const urlParts = window.location.pathname.split('/');
//     const slug = urlParts[urlParts.length - 1] || 'general-product';
//     let productId = `DH_${slug.toUpperCase()}`;

//     return {
//       id: productId,
//       title: dynamicTitle,
//       description: "Digital resource from DamsolmHub.",
//       url: currentUrl,
//       image: dynamicImage,
//       price: dynamicPrice,
//       currency: "NGN" // Change this to match your target default currency code (e.g. "USD")
//     };
//   }
  
//   function injectMicrodata(prod) {
//     const head = document.head;
//     function setMetaTag(property, content) {
//       let tag = document.querySelector(`meta[property="${property}"]`);
//       if (!tag) {
//         tag = document.createElement('meta');
//         tag.setAttribute('property', property);
//         head.appendChild(tag);
//       }
//       tag.setAttribute('content', content);
//     }

//     setMetaTag('og:title', prod.title);
//     setMetaTag('og:description', prod.description);
//     setMetaTag('og:url', prod.url);
//     setMetaTag('og:image', prod.image); // <-- Injects the automatically crawled image
//     setMetaTag('product:brand', 'DamsolmHub');
//     setMetaTag('product:availability', 'in stock');
//     setMetaTag('product:condition', 'new');
//     setMetaTag('product:price:amount', prod.price);
//     setMetaTag('product:price:currency', prod.currency);
//     setMetaTag('product:retailer_item_id', prod.id);
//   }

//   try {
//     const product = getDynamicProductDetails();
//     injectMicrodata(product);
    
//     fbq('track', 'ViewContent', {
//       content_type: 'product',
//       content_ids: [product.id],
//       value: parseFloat(product.price),
//       currency: product.currency
//     });
//   } catch (error) {
//     console.error('Error during catalog sync:', error);
//   }
// })();
















/**
 * Dynamic Selar Integrator & Meta Pixel Synchronizer
 * Automatically grabs IDs, prices, and images directly from Selar.
 */

// (function() {
//   const PIXEL_ID = '1075617971701430'; // <-- Replace with your actual Meta Pixel ID

//   // Initialize Meta Pixel
//   if (!window.fbq) {
//     !function(f,b,e,v,n,t,s)
//     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//     n.queue=[];t=b.createElement(e);t.async=!0;
//     t.src=v;s=b.getElementsByTagName(e)[0];
//     s.parentNode.insertBefore(t,s)}(window, document,'script',
//     'https://connect.facebook.net/en_US/fbevents.js');
    
//     fbq('init', PIXEL_ID);
//     fbq('track', 'PageView');
//   }

//   // 1. Fetch Selar Details Dynamically for each slug
//   async function syncProductWithSelar(card) {
//     const slug = card.getAttribute('data-selar-slug');
//     if (!slug) return;

//     try {
//       // Fetch the Selar product page HTML in the background
//       const response = await fetch(`https://cors-anywhere.herokuapp.com/https://selar.co/${slug}`);
//       if (!response.ok) throw new Error(`Could not fetch Selar product: ${slug}`);
      
//       const htmlText = await response.text();
      
//       // Parse the retrieved page HTML
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(htmlText, 'text/html');

//       // A. EXTRACT SELAR'S NATIVE PRODUCT ID (Required for catalog match)
//       // Selar usually has og:url meta tags formatted like: https://selar.co/123456
//       const ogUrlMeta = doc.querySelector('meta[property="og:url"]') || doc.querySelector('link[rel="canonical"]');
//       let selarId = "";
//       if (ogUrlMeta) {
//         const urlVal = ogUrlMeta.content || ogUrlMeta.href;
//         const matches = urlVal.match(/\/([0-9]+)$/);
//         if (matches && matches[1]) {
//           selarId = matches[1]; // e.g., "123456"
//         }
//       }

//       // B. EXTRACT PRODUCT DETAILS
//       const title = doc.querySelector('h1')?.innerText.trim() || doc.title;
//       const image = doc.querySelector('meta[property="og:image"]')?.content || "";
      
//       // Extract clean raw price integers from Selar's currency containers
//       const priceText = doc.querySelector('.product-price')?.innerText || "0.00";
//       const cleanPrice = parseFloat(priceText.replace(/[^0-9.]/g, '')).toFixed(2);
//       const currency = priceText.replace(/[0-9.,\s]/g, '') || "NGN";

//       // C. UPDATE THE DOM CARD DYNAMICALLY
//       if (selarId) card.setAttribute('data-selar-id', selarId);
      
//       const currentPriceSpan = card.querySelector('.dynamic-current-price');
//       if (currentPriceSpan) currentPriceSpan.innerText = priceText;

//       // D. TRIGGER THE CORRESPONDING META PIXEL EVENT
//       if (selarId) {
//         fbq('track', 'ViewContent', {
//           content_type: 'product',
//           content_ids: [selarId], // Matches Selar's native Purchase event IDs perfectly!
//           value: parseFloat(cleanPrice),
//           currency: currency
//         });

//         // Injects standard metadata elements into document head for Facebook's Catalog Web Scraper
//         injectHeaderMetadata(selarId, title, image, cleanPrice, currency);
//       }

//     } catch (err) {
//       console.warn("Dynamic Selar scraper error:", err);
//     }
//   }

//   // Inject Meta Tags into Head for the Facebook Crawler
//   function injectHeaderMetadata(id, title, img, price, currency) {
//     function setTag(property, content) {
//       let tag = document.querySelector(`meta[property="${property}"]`);
//       if (!tag) {
//         tag = document.createElement('meta');
//         tag.setAttribute('property', property);
//         document.head.appendChild(tag);
//       }
//       tag.setAttribute('content', content);
//     }

//     setTag('og:title', title);
//     setTag('og:image', img);
//     setTag('product:price:amount', price);
//     setTag('product:price:currency', currency);
//     setTag('product:retailer_item_id', id); // The exact numeric Selar ID mapped
//     setTag('product:availability', 'in stock');
//   }

//   // Find all cards on your site and initiate dynamic scraping
//   document.addEventListener("DOMContentLoaded", () => {
//     const cards = document.querySelectorAll('.product-card');
//     cards.forEach(syncProductWithSelar);
//   });

// })();
