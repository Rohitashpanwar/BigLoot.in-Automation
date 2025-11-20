# BigLoot.in Redesign Blueprint: Technical & UX Architecture

**Version:** 1.0
**Target Platform:** WordPress (Custom Theme / Lightweight Framework)
**Primary Goal:** Mobile-First, High-Performance, SEO-Optimized Affiliate Deals Aggregator

---

## 1. Mobile-First Approach

Since 95% of traffic is mobile, the desktop version is secondary. The UI must be designed for "Thumb Reach" and 4G speeds.

### 1.1. Viewport & Spacing
*   **Base Font Size:** 16px (Body), 14px (Meta info), 18px-20px (Deal Titles).
*   **Touch Targets:** Minimum 44x44px for all clickable elements (buttons, icons, links).
*   **Side Padding:** 16px standard on mobile to maximize content width while preventing edge-bleeding.
*   **Vertical Rhythm:** 8px grid system. Spacing between elements should be multiples of 8px (8, 16, 24, 32).

### 1.2. Mobile Navigation Patterns
*   **Header:** Slim sticky header (height: 56px).
    *   Left: Hamburger Menu (Categories).
    *   Center: Logo (Max height 32px).
    *   Right: Search Icon + User/Login Icon.
*   **Smart Bottom Navigation (Sticky):**
    *   Home (Feed)
    *   Trending (Fire Icon)
    *   Stores (Grid Icon)
    *   Saved/Alerts (Bell Icon)
*   **Floating Action Bar (Optional):** Not recommended if Bottom Nav is present, as it clutters the screen. If used, simple "Back to Top" or "Filter" button appearing on scroll up.

### 1.3. Interaction Design
*   **Horizontal Scroll containers:** For "Top Stores" or "Related Deals" to save vertical space.
*   **Infinite Scroll vs. Load More:** Use "Load More" button for better footer SEO and performance control, or infinite scroll with URL history API updates (so back button works). "Load More" is safer for SEO.

---

## 2. Site Structure Rebuild

A flat, logical hierarchy improves crawl budget and user understanding.

### 2.1. URL Hierarchy
*   **Home:** `https://bigloot.in/`
*   **Category:** `https://bigloot.in/deals/electronics/` (or just `/electronics/` if collision risk is low)
*   **Store:** `https://bigloot.in/store/amazon/`
*   **Single Deal:** `https://bigloot.in/deal/sony-headphones-offer/`
    *   *Note:* Remove date from permalinks to allow evergreen content updates.
*   **Pages:** `https://bigloot.in/about/`, `https://bigloot.in/contact/`

### 2.2. Indexability Strategy
*   **Index (DoFollow):** Homepage, Active Category Archives, Active Store Archives, Single Active Deal Pages, Pages (About, Contact).
*   **NoIndex (Follow):** Search Results (`/?s=`), Tag Archives (unless high volume traffic), Author Archives, Date Archives, Paginated pages past page 5 (optional strategy for deep crawl efficiency), Filtered views (e.g., `?price_min=100`).
*   **Removal:** Delete thin pages. 301 redirect old tags to nearest matching category.

### 2.3. Sitemap
*   **XML Sitemap:** Separate sitemaps for `deals`, `stores`, `categories`, `pages`.
*   **HTML Sitemap:** Linked in footer for users and bots.

---

## 3. Custom Deal System

We will not use standard WordPress "Posts". We will register a Custom Post Type (CPT) named `deal`.

### 3.1. Custom Fields (ACF / Metabox)
*   `deal_status`: Select (Active, Expired, Out of Stock).
*   `expiry_date`: DateTime picker.
*   `deal_price`: Number.
*   `regular_price`: Number.
*   `discount_percentage`: Auto-calculated or manual.
*   `affiliate_link`: URL.
*   `coupon_code`: Text (Click to Copy feature).
*   `store_taxonomy`: Taxonomy (Amazon, Flipkart).
*   `redirect_on_expiry`: URL (Fallback deal or category).

### 3.2. Automatic Expiry Logic
*   **Cron Job:** Run hourly.
*   **Check:** `IF expiry_date < NOW() AND status != 'Expired'`.
*   **Action:** Set `deal_status` to 'Expired'.
*   **Frontend:** Display "Expired" badge, gray out CTA, remove affiliate link (or change text to "Check Current Price" to avoid broken UX).

### 3.3. Redirects
*   **Hard Redirect:** If the deal is totally dead and useless, 301 redirect to the Store page.
*   **Soft Expiry:** Keep the page (for SEO traffic) but show a prominent "This deal has expired" banner with "Similar Active Deals" below it. (Preferred for SEO).

---

## 4. Expired Deal Management (The 50k+ URLs Strategy)

Handling 50,000 expired URLs is critical for crawl budget.

### 4.1. Strategy Matrix
1.  **High Traffic Expired Deal:**
    *   **Action:** Keep page live (Status 200).
    *   **UI:** "Deal Expired" Banner. "See Similar Deals" grid immediately below.
    *   **Why:** Retains ranking keywords. Users can find alternatives.
2.  **Low Traffic / Zero Backlink Expired Deal:**
    *   **Action:** 301 Redirect to Parent Store Page (e.g., Amazon).
    *   **Why:** Passes any residual link juice to the store page. Cleans index.
3.  **Bulk Cleanup (Oldest):**
    *   **Action:** 410 Gone (if no SEO value).
    *   **Why:** Tells Google to stop crawling it forever.

### 4.2. Visual Handling
*   **Listing Pages:** Expired deals should **NOT** appear in the main Home/Category feeds.
*   **Search:** Expired deals should be weighted lower or hidden.
*   **Detail Page:** Grayscale product image. Red "EXPIRED" badge overlaid. "Get Deal" button replaced with "View Store for More".

---

## 5. Performance & Core Web Vitals

Target: < 2s Load Time on 4G.

### 5.1. Technology Stack
*   **Theme:** **GeneratePress Premium** (Elements module is powerful) or **Kadence Theme**. Both are lightweight (<30kb). Avoid heavier themes like Astra (unless stripped down) or Elementor/Divi.
*   **Page Builder:** **Gutenberg (Blocks)** only. No Elementor/Divi. Use "GenerateBlocks" or "Kadence Blocks" for layout.
*   **Caching:** WP Rocket or LiteSpeed Cache (if server supports it).

### 5.2. Optimization Tactics
*   **Images:**
    *   Format: WebP.
    *   Sizing: Generate exact thumbnails (150x150 for lists, 400x400 for detail). Don't load full size.
    *   Lazy Load: Native browser lazy loading (`loading="lazy"`) for all images below the fold.
    *   LCP: Preload the Featured Image of the first deal on the homepage.
*   **Scripts:**
    *   Defer all JS except essential navigation logic.
    *   Remove unused CSS (Critical CSS generation).
    *   Font Awesome: Swap CDN for locally hosted SVG subset (only load the 10 icons you actually use).

---

## 6. SEO Improvements

### 6.1. Schema Markup (JSON-LD)
*   **Product Schema:** On Deal pages.
    *   `offers`: price, currency, availability (InStock/OutOfStock).
    *   `aggregateRating`: If reviews exist.
*   **BreadcrumbList:** Essential for hierarchy.
*   **Organization:** On Home.

### 6.2. Content Strategy
*   **Category Descriptions:** Add 300 words of text at the *bottom* of category pages (e.g., "Best Electronics Deals in India...") to target long-tail keywords without pushing deals down.
*   **Freshness:** Google loves fresh content. Update the "Updated" timestamp on Deal pages whenever price changes.

### 6.3. Internal Linking
*   **"Related Deals":** Widget at bottom of deal page (Same Category + Same Store).
*   **"Top Stores":** Links in Footer.

---

## 7. User Experience & Navigation

### 7.1. Smart Home Feed (Dynamic Blocks)
Instead of a simple list, use a magazine layout for mobile:
1.  **Hero Slider:** Top 3 "Super Deals" of the day (Manual curation).
2.  **Ticker:** "Just Arrived" scrolling text or small icon row.
3.  **Section:** "Trending Now" (Most clicks in last 24h).
4.  **Section:** "Amazon Loot" (Horizontal scroll).
5.  **Main Feed:** Infinite list of latest deals.

### 7.2. Click Optimization
*   **Coupon Codes:** Box with dashed border. Click copies code and opens affiliate link in new tab (Pop-under logic).
*   **Buttons:** Full width on mobile. Bright Orange (#FF9900) or Red (#E40046) for CTA.

---

## 8. Visual Design System

### 8.1. Palette
*   **Primary Brand:** #2563EB (Royal Blue) - Trust, Professionalism.
*   **Accent/CTA:** #FF5722 (Deep Orange) - Urgency, Action.
*   **Background:** #F3F4F6 (Light Gray) - Separation of cards.
*   **Surface:** #FFFFFF (White).
*   **Text:** #1F2937 (Dark Gray) - Not pure black (easier on eyes).

### 8.2. Typography
*   **Font:** Inter or Roboto (Google Fonts). Highly readable on mobile.
*   **Weights:** 400 (Body), 600 (Titles), 700 (Prices).

### 8.3. Card Style
*   **Shadow:** `box-shadow: 0 1px 3px rgba(0,0,0,0.1);` (Subtle).
*   **Radius:** 8px or 12px.
*   **Layout:**
    *   **Left:** Image (Square).
    *   **Right:** Title (2 lines max), Price (Old struck through, New Bold), Store Logo (Small).
    *   **Bottom:** "Get Deal" Button (Small).

---

## 9. Automation-Friendly Design

### 9.1. Structure for Bots
*   **Featured Image:** If API fails to provide image, have a fallback placeholder with BigLoot logo.
*   **Content Sanitization:** Auto-strip inline styles from API descriptions to prevent layout breakage.
*   **Post Status:** Default API posts to "Pending" if confidence is low, or "Publish" if trusted source.

### 9.2. Bulk Uploads
*   Use `WP All Import` or custom Python scripts interacting with WordPress REST API.
*   Ensure script checks for duplicates (by unique Product ID or Slug) to avoid cannibalization.

---

## 10. Complete Page-by-Page Blueprint

### 10.1. Home Page (Mobile Layout)
```text
[ Header: Hamburger | Logo | Search ]
[ Sticky Nav: Categories (Horz Scroll) ]
----------------------------------------
[ Hero Carousel: 3 Top Deals           ]
----------------------------------------
[ Section Title: "Trending Now"        ]
[ Deal Card 1 ] [ Deal Card 2 ] (Grid)
[ Deal Card 3 ] [ Deal Card 4 ]
----------------------------------------
[ Banner Ad / Telegram Channel CTA     ]
----------------------------------------
[ Section Title: "Latest Loots"        ]
[ Deal Card (List View)                ]
   [Img]  [Title.........]
          [Price] [Store]
          [CTA Button]
[ Deal Card (List View)                ]
...
[ Load More Button ]
----------------------------------------
[ Bottom Sticky Nav ]
```

### 10.2. Individual Deal Page
```text
[ Header ]
----------------------------------------
[ Breadcrumbs: Home > Elec > Headphones]
----------------------------------------
[ Product Image (Carousel if avail)    ]
----------------------------------------
[ Title: Sony WH-1000XM4...            ]
[ Price: ₹19,990  (₹29,990)  25% OFF   ]
[ Status Badge: Active/Expired         ]
----------------------------------------
[ BIG CTA BUTTON: "BUY NOW AT AMAZON"  ]
[ Coupon: "CLICK TO COPY" (if exists)  ]
----------------------------------------
[ Description:                         ]
[  - Feature 1                         ]
[  - Feature 2                         ]
----------------------------------------
[ Share Icons: WhatsApp, Telegram      ]
----------------------------------------
[ "You May Also Like" (Related Deals)  ]
[ Card 1 ] [ Card 2 ] ...
----------------------------------------
[ Footer ]
```

### 10.3. Category/Store Page
*   **Header:** Title + Description (Collapsed by default or at bottom for SEO).
*   **Filters (Accordion):** Price Range, Store (if Category page), Brand.
*   **List:** Standard Deal Cards.

---

## 11. WordPress + PHP Implementation Guidelines

### 11.1. Theme Structure (Child Theme)
Folder: `themes/generatepress-child/`
*   `functions.php`: Core logic inclusions.
*   `style.css`: Custom CSS variables.
*   `inc/`:
    *   `cpt-deals.php`: Register Post Type & Taxonomies.
    *   `expired-logic.php`: Cron jobs for expiry.
    *   `api-handler.php`: Endpoints for automation bots.
*   `template-parts/`:
    *   `content-deal.php`: The card layout.
    *   `single-deal.php`: The detail layout.

### 11.2. Key Functions (Pseudocode)

**`inc/cpt-deals.php`**
```php
function register_deal_cpt() {
    register_post_type('deal', [
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'deal'],
        'supports' => ['title', 'editor', 'thumbnail'],
        // ... labels ...
    ]);
}
```

**`inc/expired-logic.php`**
```php
function check_deal_expiry() {
    $args = [
        'post_type' => 'deal',
        'meta_query' => [
            'key' => 'expiry_date',
            'value' => current_time('mysql'),
            'compare' => '<',
            'type' => 'DATETIME'
        ]
    ];
    // Loop and update meta 'deal_status' to 'expired'
}
if (!wp_next_scheduled('daily_expiry_check')) {
    wp_schedule_event(time(), 'hourly', 'daily_expiry_check');
}
add_action('daily_expiry_check', 'check_deal_expiry');
```

### 11.3. Archive Conflict Avoidance
*   Don't name a page "Deals" if your CPT archive is `/deals/`. Use `/all-deals/` for a manual page or stick to the archive.
*   Use `pre_get_posts` filter to exclude expired deals from the main query if desired.

---

## 12. Summary Execution Plan

1.  **Setup:** Install WordPress + GeneratePress + GenerateBlocks.
2.  **Backend:** Create `Deal` CPT and custom fields (ACF).
3.  **Migration:** Import existing deals, map fields. Run script to mark old ones expired.
4.  **Redirects:** Implement logic for 404s and Expired content.
5.  **Design:** Build Header, Footer, Loop Templates using Block Elements.
6.  **SEO:** Configure Schema, Sitemaps, and Robots.txt.
7.  **Testing:** Mobile speed test (PageSpeed Insights), Mobile Usability test in Search Console.
8.  **Launch.**
