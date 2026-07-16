/**
 * Dynamic Meta Pixel & Microdata Scraper
 * Automatically grabs the current page's actual image, title, and price.
 */

(function() {
  const PIXEL_ID = '1075617971701430'; 

  // Initialize Pixel Base Code
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

  function getDynamicProductDetails() {
    const currentUrl = window.location.href;
    
    // 1. DYNAMICALLY SCRAPE THE IMAGE URL FROM THE PAGE
    // First, check if the page already has a standard SEO image tag (very common)
    let dynamicImage = "";
    const metaOgImage = document.querySelector('meta[property="og:image"]') || 
                        document.querySelector('meta[name="twitter:image"]');
    
    if (metaOgImage && metaOgImage.content) {
      dynamicImage = metaOgImage.content;
    } else {
      // Fallback: Grab the primary product image from your page layout
      // Adjust these selectors to match the CSS class of your product image
      const primaryImg = document.querySelector('#Products .container article .specialist__image');
      dynamicImage = primaryImg ? primaryImg.src : "https://www.damsolmhub.com/default-preview.jpg"; 
    }

    // 2. DYNAMICALLY SCRAPE THE PRODUCT TITLE
    let dynamicTitle = document.title;
    const titleEl = document.querySelector('h1.product-title, h1');
    if (titleEl) {
      dynamicTitle = titleEl.innerText.trim();
    }

    // 3. DYNAMICALLY SCRAPE THE PRICE
    let dynamicPrice = "0.00";
    // Grabs elements commonly containing prices
    const priceEl = document.querySelector('.product-price, .price, [data-product-price]');
    if (priceEl) {
      const rawPrice = priceEl.innerText.replace(/[^0-9.]/g, '');
      if (rawPrice) dynamicPrice = parseFloat(rawPrice).toFixed(2);
    }

    // 4. GENERATE A UNIQUE ID
    const urlParts = window.location.pathname.split('/');
    const slug = urlParts[urlParts.length - 1] || 'general-product';
    let productId = `DH_${slug.toUpperCase()}`;

    return {
      id: productId,
      title: dynamicTitle,
      description: "Digital resource from DamsolmHub.",
      url: currentUrl,
      image: dynamicImage, // <-- Automatically detected image URL
      price: dynamicPrice,
      currency: "NGN" // Change as needed
    };
  }

  function injectMicrodata(prod) {
    const head = document.head;
    function setMetaTag(property, content) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    }

    setMetaTag('og:title', prod.title);
    setMetaTag('og:description', prod.description);
    setMetaTag('og:url', prod.url);
    setMetaTag('og:image', prod.image); // <-- Injects the automatically crawled image
    setMetaTag('product:brand', 'DamsolmHub');
    setMetaTag('product:availability', 'in stock');
    setMetaTag('product:condition', 'new');
    setMetaTag('product:price:amount', prod.price);
    setMetaTag('product:price:currency', prod.currency);
    setMetaTag('product:retailer_item_id', prod.id);
  }

  try {
    const product = getDynamicProductDetails();
    injectMicrodata(product);
    
    fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [product.id],
      value: parseFloat(product.price),
      currency: product.currency
    });
  } catch (error) {
    console.error('Error during catalog sync:', error);
  }
})();
