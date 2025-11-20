const deals = [
    {
        id: 1,
        title: "Samsung Galaxy M14 5G (Berry Blue, 6GB, 128GB Storage)",
        price: 12490,
        originalPrice: 18990,
        discount: 34,
        image: "https://m.media-amazon.com/images/I/817WWpaQQbL._AC_UF1000,1000_QL80_.jpg", // Placeholder, usually would be local or CDN
        store: "Amazon",
        link: "#"
    },
    {
        id: 2,
        title: "Sony WH-CH520, Wireless On-Ear Bluetooth Headphones with Mic",
        price: 3990,
        originalPrice: 5990,
        discount: 33,
        image: "https://m.media-amazon.com/images/I/41lArSiD5hL._AC_SY450_.jpg",
        store: "Amazon",
        link: "#"
    },
    {
        id: 3,
        title: "Fastrack Limitless FS1 Pro Smart Watch",
        price: 1999,
        originalPrice: 7995,
        discount: 75,
        image: "https://m.media-amazon.com/images/I/61JtVmcxB0L._AC_UF1000,1000_QL80_.jpg",
        store: "Flipkart",
        link: "#"
    },
    {
        id: 4,
        title: "Apple MacBook Air Laptop M1 chip, 13.3-inch/33.74 cm Retina Display",
        price: 69990,
        originalPrice: 99900,
        discount: 30,
        image: "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UF1000,1000_QL80_.jpg",
        store: "Amazon",
        link: "#"
    },
    {
        id: 5,
        title: "Pigeon by Stovekraft Amaze Plus Electric Kettle (1.5 Litre)",
        price: 599,
        originalPrice: 1295,
        discount: 54,
        image: "https://m.media-amazon.com/images/I/51R4FJdgbMS._AC_UF1000,1000_QL80_.jpg",
        store: "Flipkart",
        link: "#"
    },
    {
        id: 6,
        title: "boAt Airdopes 141 Bluetooth Truly Wireless in Ear Headphones",
        price: 999,
        originalPrice: 4490,
        discount: 78,
        image: "https://m.media-amazon.com/images/I/61KNJav3S4L._AC_UF1000,1000_QL80_.jpg",
        store: "Amazon",
        link: "#"
    },
    {
        id: 7,
        title: "HP 15s, 12th Gen Intel Core i5 16GB RAM/512GB SSD 15.6-inch Laptop",
        price: 52990,
        originalPrice: 67832,
        discount: 22,
        image: "https://m.media-amazon.com/images/I/71fSS6mvFXL._AC_UF1000,1000_QL80_.jpg",
        store: "Amazon",
        link: "#"
    },
    {
        id: 8,
        title: "Philips HL7756/00 Mixer Grinder 750 Watt, 3 Jars",
        price: 3499,
        originalPrice: 5295,
        discount: 34,
        image: "https://m.media-amazon.com/images/I/61l6-N4bXUL._AC_UF1000,1000_QL80_.jpg",
        store: "Flipkart",
        link: "#"
    }
];

// DOM Elements
const dealsContainer = document.getElementById('deals-container');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Format Price
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Render Deals
function renderDeals(dealsData) {
    dealsContainer.innerHTML = '';
    dealsData.forEach(deal => {
        const dealCard = document.createElement('div');
        dealCard.className = 'deal-card';

        dealCard.innerHTML = `
            <div class="deal-image-wrapper">
                <span class="discount-badge">${deal.discount}% OFF</span>
                <img src="${deal.image}" alt="${deal.title}">
            </div>
            <div class="deal-content">
                <h3 class="deal-title" title="${deal.title}">${deal.title}</h3>
                <div class="deal-pricing">
                    <span class="current-price">${formatPrice(deal.price)}</span>
                    <span class="original-price">${formatPrice(deal.originalPrice)}</span>
                </div>
                <div class="deal-footer">
                    <span class="store-name" style="color: #666; font-size: 0.9em;">${deal.store}</span>
                    <a href="${deal.link}" class="buy-btn">Buy Now</a>
                </div>
            </div>
        `;

        dealsContainer.appendChild(dealCard);
    });
}

// Toggle Menu
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderDeals(deals);
});
