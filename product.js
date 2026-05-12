document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
  updateFloatingCartCount();
  reveal();

  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const categoryTitles = document.querySelectorAll(".category-title");
  const addToCartBtn = document.querySelector(".add-to-cart-btn");

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const filterValue = button.getAttribute("data-filter");
        categoryTitles.forEach(title => {
          filterValue === "all" ? title.classList.remove("hidden") : title.classList.add("hidden");
        });
        productCards.forEach(card => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.classList.remove("hidden");
            setTimeout(() => card.classList.add("active"), 50);
          } else {
            card.classList.add("hidden");
            card.classList.remove("active");
          }
        });
      });
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const name = document.getElementById("product-title").textContent;
      const price = document.getElementById("product-price").textContent;
      const option = document.getElementById("product-options").value;
      addToCart({ name, price, option, quantity: 1 });
      addToCartBtn.textContent = "Added ✓";
      addToCartBtn.style.background = "var(--action)";
      setTimeout(() => {
        addToCartBtn.textContent = "Add to Basket";
        addToCartBtn.style.background = "var(--depth)";
      }, 2000);
    });
  }

  window.addEventListener("scroll", reveal);

  function reveal() {
    const reveals = document.querySelectorAll(".reveal:not(.hidden)");
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) el.classList.add("active");
    });
  }

  function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
  function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(i => i.name === product.name && i.option === product.option);
    existing ? existing.quantity++ : cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateFloatingCartCount();
  }
  function updateFloatingCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById("floating-cart-count");
    const navCountEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = total;
    if (navCountEl) navCountEl.textContent = total;
  }
});
