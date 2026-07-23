/* ==========================================================================
   ARCHITECTS COFFEE - APPLICATION LOGIC & STATE MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MENU DATABASE
  // ==========================================
  const menuData = [
    {
      id: 'p1',
      title: 'Blueprint Single-Origin Pour-Over',
      category: 'filter',
      price: 6.50,
      image: 'assets/images/espresso.png',
      badge: '1:16 EXTRACTION',
      description: 'Precision hand-poured single origin from Yirgacheffe, Ethiopia. Notes of jasmine, bergamot, and delicate stone fruit.',
      specs: ['Origin: Ethiopia', 'Roast: Light Draft', 'Elevation: 2,200m', 'Process: Washed'],
      tags: ['Single Origin', 'Vegan']
    },
    {
      id: 'p2',
      title: 'Structural Espresso Draft',
      category: 'espresso',
      price: 4.80,
      image: 'assets/images/beans.png',
      badge: '99.4% RATIO',
      description: 'Double shot extraction with 18.5g in and 37g out. Intensely balanced profile with molten cocoa and toasted hazelnut finish.',
      specs: ['Origin: Guatemala Huila', 'Roast: Medium Structural', 'Tasting: Dark Chocolate'],
      tags: ['Signature', 'High Elevation']
    },
    {
      id: 'p3',
      title: 'Velvet Cortado Spec',
      category: 'espresso',
      price: 5.20,
      image: 'assets/images/espresso.png',
      badge: '1:1 MILK RATIO',
      description: '1:1 ratio of structural espresso and micro-textured steam velvet milk, served in a double-walled geometric glass.',
      specs: ['Milk: Whole/Oat', 'Temp: 62°C Precision', 'Texture: Microfoam'],
      tags: ['Popular']
    },
    {
      id: 'p4',
      title: 'Draft Cold Brew Elevation',
      category: 'cold',
      price: 5.90,
      image: 'assets/images/espresso.png',
      badge: '24HR EXTRACTION',
      description: 'Slow cold-water steeped for 24 hours under nitrogen pressure. Silky mouthfeel with dark cherry and caramel tones.',
      specs: ['Method: Cold Steep', 'Pressure: Nitro Draft', 'Caffeine: 210mg'],
      tags: ['Vegan', 'Gluten Free']
    },
    {
      id: 'p5',
      title: 'Artisanal Butter Croissant',
      category: 'bakes',
      price: 4.50,
      image: 'assets/images/pastry.png',
      badge: 'FRESHLY DRAFTED',
      description: '72-layer laminated French butter croissant, baked fresh daily with crisp golden geometric crust and airy interior.',
      specs: ['Butter: AOP French', 'Lamination: 72 Layers', 'Freshly Baked'],
      tags: ['Chef Special']
    },
    {
      id: 'p6',
      title: 'Bronze Cardamom Danish',
      category: 'bakes',
      price: 5.50,
      image: 'assets/images/pastry.png',
      badge: 'ARTISANAL',
      description: 'Infused with freshly cracked cardamom, brown sugar bronze glaze, and roasted Sicilian pistachio shavings.',
      specs: ['Glaze: Bronze Caramel', 'Spice: Organic Cardamom'],
      tags: ['Signature Bakes']
    },
    {
      id: 'p7',
      title: 'Guatemala Antigua Reserve (250g)',
      category: 'beans',
      price: 19.50,
      image: 'assets/images/beans.png',
      badge: 'WHOLE BEAN',
      description: 'Whole coffee beans roasted specifically for architectural pour-over setups. Full body with candied orange and cocoa.',
      specs: ['Origin: Antigua, Guatemala', 'Altitude: 1,800m', 'Score: 88.5 PTS'],
      tags: ['Micro-Lot', 'Single Origin']
    },
    {
      id: 'p8',
      title: 'Smoked Vanilla Cold Foam Brew',
      category: 'cold',
      price: 6.80,
      image: 'assets/images/espresso.png',
      badge: 'SEASONAL',
      description: '24hr structural cold brew topped with house-smoked Madagascar vanilla cold foam and cocoa nib dust.',
      specs: ['Foam: Velvet Cream', 'Syrup: Smoked Vanilla'],
      tags: ['Seasonal Special']
    }
  ];

  // ==========================================
  // APP STATE
  // ==========================================
  let cart = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedDesk = null;
  let promoDiscount = 0;

  // Custom Brew Studio State
  let customBrew = {
    base: 'Espresso Single Origin',
    shots: 'Double (18g)',
    milk: 'Whole Velvet',
    flavor: 'Smoked Vanilla',
    temp: 'Hot (65°C)',
    price: 5.50
  };

  // ==========================================
  // UI INITIALIZATION & RENDER
  // ==========================================
  renderMenu();
  setupEventListeners();

  // Scroll Header Effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Render Menu Function
  function renderMenu() {
    const container = document.getElementById('menuGrid');
    if (!container) return;

    const filtered = menuData.filter(item => {
      const matchesCat = (currentCategory === 'all' || item.category === currentCategory);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.specs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-compass-drafting" style="font-size: 3rem; color: var(--accent-blueprint); margin-bottom: 1rem;"></i>
          <h3>No Architectural Menu Items Found</h3>
          <p>Try clearing your search or switching categories.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="menu-card" data-id="${item.id}">
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="card-badge">${item.badge}</div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${item.title}</h3>
            <div class="card-price">$${item.price.toFixed(2)}</div>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-specs">
            ${item.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
          </div>
          <div class="card-actions">
            <button class="btn-card-add" onclick="window.addToCart('${item.id}')">
              <i class="fa-solid fa-plus"></i> Add to Order
            </button>
            <button class="btn-card-customize" onclick="window.openCustomizer('${item.id}')">
              <i class="fa-solid fa-sliders"></i> Specs
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // EVENT LISTENERS & INTERACTION
  // ==========================================
  function setupEventListeners() {
    // Menu Category Tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-category');
        renderMenu();
      });
    });

    // Search Input
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
      });
    }

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartDrawer = document.getElementById('cartDrawer');

    if (cartBtn && cartDrawer && overlay) {
      cartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
      });
    }

    if (closeCartBtn && cartDrawer && overlay) {
      closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
      });
      overlay.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // Workspace Desk Nodes
    document.querySelectorAll('.desk-node').forEach(node => {
      node.addEventListener('click', () => {
        if (node.classList.contains('reserved')) return;
        document.querySelectorAll('.desk-node').forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');
        selectedDesk = node.getAttribute('data-desk');
        const deskTitle = node.querySelector('.desk-title').innerText;
        document.getElementById('selectedDeskDisplay').value = `${selectedDesk} - ${deskTitle}`;
        showToast(`Selected Workspace: ${selectedDesk}`);
      });
    });

    // Customizer Options
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const group = e.target.closest('.option-grid');
        group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        
        const type = e.target.getAttribute('data-type');
        const value = e.target.innerText;
        if (type) {
          customBrew[type] = value;
          updateCustomBrewDisplay();
        }
      });
    });

    // Form Submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent to Architects Coffee team!');
        contactForm.reset();
      });
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!selectedDesk) {
          showToast('Please click a workspace desk on the layout grid first!');
          return;
        }
        showToast(`Workspace Desk ${selectedDesk} reserved successfully! Check email for confirmation.`);
        bookingForm.reset();
      });
    }
  }

  // ==========================================
  // CUSTOM BREW STUDIO CALCULATOR
  // ==========================================
  function updateCustomBrewDisplay() {
    let basePrice = 5.00;
    if (customBrew.shots.includes('Triple')) basePrice += 1.20;
    if (customBrew.milk.includes('Oat') || customBrew.milk.includes('Almond')) basePrice += 0.80;
    if (!customBrew.flavor.includes('None')) basePrice += 0.60;

    customBrew.price = basePrice;
    
    document.getElementById('customPrice').innerText = `$${basePrice.toFixed(2)}`;
    document.getElementById('metricBase').innerText = customBrew.base;
    document.getElementById('metricMilk').innerText = customBrew.milk;
    document.getElementById('metricTemp').innerText = customBrew.temp;
  }

  window.addCustomBrewToCart = function() {
    const customItem = {
      id: 'custom-' + Date.now(),
      title: `Draft Brew (${customBrew.base})`,
      price: customBrew.price,
      image: 'assets/images/espresso.png',
      details: `${customBrew.shots} | ${customBrew.milk} | ${customBrew.flavor}`
    };
    cart.push(customItem);
    updateCartUI();
    showToast('Custom Draft Brew added to your order!');
  };

  // ==========================================
  // CART MANAGEMENT
  // ==========================================
  window.addToCart = function(id) {
    const product = menuData.find(p => p.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    
    updateCartUI();
    showToast(`Added ${product.title} to order`);
  };

  window.updateQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
  };

  window.applyPromo = function() {
    const input = document.getElementById('promoInput');
    if (!input) return;
    if (input.value.trim().toUpperCase() === 'ARCH20') {
      promoDiscount = 0.20;
      showToast('20% Architectural Discount Applied!');
      updateCartUI();
    } else {
      showToast('Invalid Code. Try "ARCH20"');
    }
  };

  window.checkoutOrder = function() {
    if (cart.length === 0) {
      showToast('Your order cart is currently empty!');
      return;
    }
    showToast('Order confirmed! Our baristas are preparing your architectural brew.');
    cart = [];
    updateCartUI();
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
  };

  function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');

    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    if (badge) badge.innerText = totalQty;

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-mug-hot" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-dim);"></i>
          <p>Your blueprint cart is empty.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.innerText = '$0.00';
      if (taxEl) taxEl.innerText = '$0.00';
      if (totalEl) totalEl.innerText = '$0.00';
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const discountAmount = subtotal * promoDiscount;
    const tax = (subtotal - discountAmount) * 0.08875; // NY tax rate
    const total = (subtotal - discountAmount) + tax;

    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          ${item.details ? `<div style="font-size:0.75rem; color:var(--accent-blueprint);">${item.details}</div>` : ''}
        </div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="window.updateQty('${item.id}', -1)">-</button>
          <span>${item.qty || 1}</span>
          <button class="qty-btn" onclick="window.updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
  }

  // ==========================================
  // TOAST SYSTEM
  // ==========================================
  function showToast(msg) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-compass-drafting" style="color: var(--accent-bronze);"></i>
      <span>${msg}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

});
