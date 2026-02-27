// ================= PAGE FADE =================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});


// ================= CART STORAGE =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateFloatingCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const floatingCount = document.getElementById("floating-cart-count");
  if (floatingCount) {
    floatingCount.textContent = totalItems;
  }
}

updateFloatingCartCount();


// ================= ADD TO CART =================
document.querySelectorAll(".add-to-cart").forEach(button => {

  button.addEventListener("click", () => {

    const productInfo = button.closest(".product-info");
    const productName = productInfo.querySelector("h1").innerText;
    const quantity = parseInt(productInfo.querySelector("input").value);
    const price = parseFloat(productInfo.querySelector(".price").innerText.replace("R",""));
    const imageSrc = document.querySelector(".product-image img").src;

    let cart = getCart();

    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        name: productName,
        price: price,
        quantity: quantity,
        image: imageSrc
      });
    }

    saveCart(cart);
    updateFloatingCartCount();

    button.textContent = `Added ✓`;

    setTimeout(() => {
      button.textContent = "Add to Cart";
    }, 1500);
  });

});


// ================= THUMBNAIL SWITCH =================
document.querySelectorAll(".thumbnail-row img").forEach(thumb => {
  thumb.addEventListener("click", () => {
    const mainImage = thumb.closest(".product-image").querySelector("img");
    mainImage.src = thumb.src;
  });
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