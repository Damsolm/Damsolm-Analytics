/**
 * Dynamic Meta Pixel & Microdata Integration for DamsolmHub
 * Supports: damsolmhub.com and selar.com/m/DamsolmHub
 */

(function() {
  // 1. REPLACE THIS WITH YOUR ACTUAL 15-DIGIT META PIXEL ID
  const PIXEL_ID = 'YOUR_PIXEL_ID_HERE'; 

  // Initialize Meta Pixel Base Code dynamically if not already loaded
  if (!window.fbq) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // 2. Extract product details dynamically from the current page
  function getProductDetails() {
    const currentUrl = window.location.href;
    
    // Default fallback values if elements aren't found
    let title = document.title || "DamsolmHub Product";
    let description = "Digital educational materials and resources from DamsolmHub.";
    let image = "https://www.damsolmhub.com/default-preview.jpg"; // Replace with your default logo/image URL
    let price = "0.00";
    let currency = "NGN"; // Change to USD, GHS, etc., as needed
    
    // Generate a clean ID based on the URL slug (e.g., /m/DamsolmHub/my-ebook -> MY-EBOOK)
    const urlParts = window.location.pathname.split('/');
    const slug = urlParts[urlParts.length - 1] || 'general-product';
    let productId = `DH_${slug.toUpperCase()}`;

    // --- SCRAPING LOGIC FOR SELAR.COM ---
    if (currentUrl.includes('selar.co')) {
      // Selar product pages typically have specific class names or structures
      const selarTitleEl = document.querySelector('h1') || document.querySelector('.product-title');
      if (selarTitleEl) title = selarTitleEl.innerText.trim();

      const selarPriceEl = document.querySelector('.product-price') || document.querySelector('[data-product-price]');
      if (selarPriceEl) {
        // Strip out currency symbols and commas (e.g. "₦5,000" -> "5000")
        const rawPrice = selarPriceEl.innerText.replace(/[^0-9.]/g, '');
        if (rawPrice) price = parseFloat(rawPrice).toFixed(2);
      }

      const selarImgEl = document.querySelector('.product-image img') || document.querySelector('meta[property="og:image"]');
      if (selarImgEl) image = selarImgEl.src || selarImgEl.content;
    } 
    // --- SCRAPING LOGIC FOR DAMSOLMHUB.COM ---
    else {
      // Update these selectors to match the exact HTML elements on your website
      const siteTitleEl = document.querySelector('.product-title, h1');
      if (siteTitleEl) title = siteTitleEl.innerText.trim();

      const sitePriceEl = document.querySelector('.price, .product-price');
      if (sitePriceEl) {
        const rawPrice = sitePriceEl.innerText.replace(/[^0-9.]/g, '');
        if (rawPrice) price = parseFloat(rawPrice).toFixed(2);
      }

      const siteImgEl = document.querySelector('.product-gallery img, #product-featured-image');
      if (siteImgEl) image = siteImgEl.src;
    }

    return {
      id: productId,
      title: title,
      description: description,
      url: currentUrl,
      image: image,
      price: price,
      currency: currency
    };
  }

  // 3. Inject OpenGraph tags into the <head>
  function injectMicrodata(prod) {
    const head = document.head;

    // Helper function to create or update meta tags
    function setMetaTag(property, content) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    }

    // Set standard required microdata tags
    setMetaTag('og:title', prod.title);
    setMetaTag('og:description', prod.description);
    setMetaTag('og:url', prod.url);
    setMetaTag('og:image', prod.image);
    setMetaTag('product:brand', 'DamsolmHub');
    setMetaTag('product:availability', 'in stock');
    setMetaTag('product:condition', 'new');
    setMetaTag('product:price:amount', prod.price);
    setMetaTag('product:price:currency', prod.currency);
    setMetaTag('product:retailer_item_id', prod.id); // This MUST match the content_ids in the pixel event
  }

  // 4. Run the process
  try {
    const product = getProductDetails();
    
    // Step A: Inject the HTML microdata tags so the Meta Crawler can read them
    injectMicrodata(product);
    
    // Step B: Trigger the ViewContent pixel event so Meta knows to pull the product
    fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [product.id],
      value: parseFloat(product.price),
      currency: product.currency
    });
    
    console.log(`[Meta Catalog Setup] Successfully injected microdata and fired ViewContent for: ${product.id}`);
  } catch (error) {
    console.error('[Meta Catalog Setup] Error during execution:', error);
  }
})();
