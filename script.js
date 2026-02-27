// ================= GLOBAL CART SYSTEM =================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateFloatingCartCount();
  updateNavbarCartCount();
}

function updateFloatingCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const floatingCount = document.getElementById("floating-cart-count");
  if (floatingCount) {
    floatingCount.textContent = totalItems;
  }
}

function updateNavbarCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navCount = document.getElementById("cart-count");
  if (navCount) {
    navCount.textContent = totalItems;
  }
}

updateFloatingCartCount();
updateNavbarCartCount();


// ================= PAGE FADE IN =================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// 🔥 FIX FOR BLANK PAGE WHEN PRESSING BACK
window.addEventListener("pageshow", function () {
  document.body.classList.add("loaded");
  document.body.style.opacity = "1";
});


// ================= PAGE TRANSITION =================
document.querySelectorAll("a").forEach(link => {
  const href = link.getAttribute("href");

  if (
    href &&
    !href.startsWith("#") &&
    !href.startsWith("http") &&
    !link.classList.contains("no-transition")
  ) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      document.body.classList.remove("loaded");

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  }
});


// ================= SCROLL REVEAL =================
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// ================= ACTIVE NAV LINK =================
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});


// ================= SMART BACK BUTTON =================
const backButton = document.getElementById("backButton");

if (backButton) {
  backButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
}


// ================= BOOKING FORM =================
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;

    if (!name || !email || !date) {
      alert("Please complete all required fields.");
      return;
    }

    const successMessage = document.getElementById("bookingSuccess");
    successMessage.style.display = "block";

    bookingForm.reset();

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 5000);
  });
}


// ================= CART PAGE RENDER =================
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalElement) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Browse our collection and add something special.</p>
      </div>
    `;
    cartTotalElement.textContent = "R0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");

    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>

        <div class="cart-quantity-controls">
          <button class="qty-btn minus" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>

        <button class="remove-btn" data-index="${index}">
          Remove
        </button>
      </div>

      <div class="cart-price">
        R${item.price * item.quantity}
      </div>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  cartTotalElement.textContent = `R${total}`;
}

document.addEventListener("click", function (e) {
  let cart = getCart();

  if (e.target.classList.contains("plus")) {
    const index = e.target.dataset.index;
    cart[index].quantity++;
    saveCart(cart);
    renderCart();
  }

  if (e.target.classList.contains("minus")) {
    const index = e.target.dataset.index;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }

  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
});

renderCart();


// ================= SHOP PAGE ADD TO CART =================
document.querySelectorAll(".add-to-cart-shop").forEach(button => {
  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;

    let cart = getCart();

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name,
        price,
        image,
        quantity: 1
      });
    }

    saveCart(cart);

    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = "Add";
    }, 1200);
  });
});
