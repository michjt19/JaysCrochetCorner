<!-- file: assets/js/main.js -->
// file: assets/js/main.js
import { PRODUCTS } from './products.js';

const PRODUCTS_GRID_SELECTOR = '#products-grid';
const MODAL_SELECTOR = '#product-modal';

function createCard(product) {
  // minimal accessible card markup
  return `
    <article class="product-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer" data-id="${product.id}">
      <img src="${product.img}" alt="${escapeHtml(product.title)}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-semibold text-lg">${escapeHtml(product.title)}</h3>
        <p class="text-sm text-slate-600 mt-1">${escapeHtml(product.short)}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-rose-700 font-bold">$${escapeHtml(product.price)}</span>
          <button class="text-sm px-3 py-1 border rounded product-open-btn" data-id="${product.id}">View</button>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function renderProducts(limit = null) {
  const container = document.querySelector(PRODUCTS_GRID_SELECTOR);
  if (!container) return;
  container.innerHTML = '';
  const items = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  items.forEach(p => container.insertAdjacentHTML('beforeend', createCard(p)));
}

// Modal helpers
function openModal(product) {
  const modal = document.querySelector(MODAL_SELECTOR);
  if (!modal) return;
  modal.classList.add('open');
  modal.style.display = 'flex';
  modal.querySelector('#modal-title').textContent = product.title;
  modal.querySelector('#modal-image').src = product.img;
  modal.querySelector('#modal-image').alt = product.title;
  modal.querySelector('#modal-desc').textContent = product.desc;
  modal.querySelector('#modal-price').textContent = `$${product.price}`;
  // Prepare mailto buy link (user replaces email as needed)
  const mailto = `mailto:orders@jayscrochetcorner.com?subject=Order%20for%20${encodeURIComponent(product.title)}&body=Hi%20Jay,%0A%0AI'd%20like%20to%20order%20the%20${encodeURIComponent(product.title)}%20(${encodeURIComponent(product.id)})%20priced%20at%20$${encodeURIComponent(product.price)}.%0A%0AQuantity:%20%0AShipping%20Address:%20%0A%0AThanks!`;
  modal.querySelector('#modal-buy').setAttribute('href', mailto);
}

function closeModal() {
  const modal = document.querySelector(MODAL_SELECTOR);
  if (!modal) return;
  modal.classList.remove('open');
  modal.style.display = 'none';
}

function findProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// Setup event listeners
function setupInteractions() {
  // render featured or full depending on page
  // If index.html -> limit to 3 featured
  if (document.querySelector('body').contains(document.querySelector('#products-grid')) && location.pathname.endsWith('/')) {
    // not reliable on some hosts, so fallback: check if index.html is present in path
  }

  // If on homepage (index), show first 3; otherwise show all
  const isHome = location.pathname === '/' || location.pathname.endsWith('index.html');
  renderProducts(isHome ? 3 : null);

  // Delegate click on product cards / buttons
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card') || e.target.closest('.product-open-btn');
    if (card) {
      const id = card.getAttribute('data-id') || e.target.getAttribute('data-id');
      if (!id) return;
      const product = findProductById(id);
      if (product) openModal(product);
      return;
    }
    // close modal clicks
    if (e.target.matches('[data-modal-close]') || e.target.id === 'modal-close' || e.target.id === 'modal-close-2') {
      closeModal();
    }
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // close modal when clicking overlay (already handled via data-modal-close)
}

// Initialize
setupInteractions();