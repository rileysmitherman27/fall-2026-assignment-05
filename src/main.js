import products from './data/products.json';

const PRODUCTS_PER_PAGE = 5;

// Only run the store logic on pages that have the product grid (store.html).
const grid = document.getElementById('product-grid');

if (grid) {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageNumbers = document.getElementById('page-numbers');
  const pageStatus = document.getElementById('page-status');

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  let currentPage = 1;

  /** Builds one product card element. textContent is used so data is never parsed as HTML. */
  function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'product-card-body';

    const badge = document.createElement('span');
    badge.className = 'product-category';
    badge.textContent = product.category;

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.name;

    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `$${product.price.toFixed(2)}`;

    body.append(badge, name, description, price);
    card.append(img, body);
    return card;
  }

  /** Renders the numbered page buttons and marks the current one. */
  function renderPageNumbers() {
    pageNumbers.replaceChildren();

    for (let page = 1; page <= totalPages; page++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'page-btn';
      btn.textContent = String(page);
      btn.setAttribute('aria-label', `Go to page ${page}`);

      if (page === currentPage) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      }

      btn.addEventListener('click', () => goToPage(page));
      pageNumbers.append(btn);
    }
  }

  /** Slices the dataset for the current page and updates the DOM. */
  function render() {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const pageItems = products.slice(start, start + PRODUCTS_PER_PAGE);

    grid.replaceChildren(...pageItems.map(createProductCard));

    renderPageNumbers();
    pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;

    // Boundary guardrails
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    render();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  render();
}