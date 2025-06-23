// Datos de productos
const products = [
{
  id: 1,
  name: "Laptop UltraSlim Pro",
  description: "Laptop ultradelgada con procesador i7, 16GB RAM y SSD 512GB",
  price: 1299.99,
  category: "Laptops",
  icon: "fas fa-laptop"
},
{
  id: 2,
  name: "Smartphone X10",
  description: "Smartphone de última generación con triple cámara y pantalla AMOLED",
  price: 799.99,
  category: "Smartphones",
  icon: "fas fa-mobile-alt"
},
{
  id: 3,
  name: "Tablet Pro 10\"",
  description: "Tablet con pantalla 2K, procesador octa-core y 128GB de almacenamiento",
  price: 499.99,
  category: "Tablets",
  icon: "fas fa-tablet-alt"
},
{
  id: 4,
  name: "Smart Watch Pro",
  description: "Reloj inteligente con monitor de actividad y oxígeno en sangre",
  price: 249.99,
  category: "Accesorios",
  icon: "fas fa-clock"
},
{
  id: 5,
  name: "Auriculares Bluetooth",
  description: "Auriculares inalámbricos con cancelación de ruido y 30h de batería",
  price: 159.99,
  category: "Accesorios",
  icon: "fas fa-headphones"
},
{
  id: 6,
  name: "Teclado Mecánico RGB",
  description: "Teclado gaming mecánico con retroiluminación RGB personalizable",
  price: 89.99,
  category: "Accesorios",
  icon: "fas fa-keyboard"
},
{
  id: 7,
  name: "Antivirus Premium",
  description: "Software de seguridad con protección en tiempo real y VPN incluido",
  price: 59.99,
  category: "Software",
  icon: "fas fa-shield-alt"
},
{
  id: 8,
  name: "Disco Duro Externo 2TB",
  description: "Disco duro portátil USB 3.0 de alta velocidad",
  price: 79.99,
  category: "Accesorios",
  icon: "fas fa-hdd"
}
];

// Estado del carrito
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const cartIcon = document.getElementById('cart-icon');
const cartElement = document.getElementById('cart');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCountElement = document.getElementById('cart-count');
const cartClear = document.getElementById('cart-clear');
const cartCheckout = document.getElementById('cart-checkout');
const notification = document.getElementById('notification');

// Renderizar productos
function renderProducts() {
productsContainer.innerHTML = '';
products.forEach(product => {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  productCard.innerHTML = `
      <div class="product-image">
          <i class="${product.icon}"></i>
      </div>
      <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <div class="product-actions">
              <button class="btn btn-primary add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
          </div>
      </div>
  `;
  productsContainer.appendChild(productCard);
});

// Agregar eventos a los botones
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
  });
});
}

// Agregar producto al carrito
function addToCart(productId) {
const product = products.find(p => p.id === productId);
if (!product) return;

// Verificar si el producto ya está en el carrito
const existingItem = cart.find(item => item.id === productId);

if (existingItem) {
  existingItem.quantity++;
} else {
  cart.push({
      ...product,
      quantity: 1
  });
}

cartCount++;
cartTotal += product.price;

updateCartUI();
showNotification(`${product.name} añadido al carrito`);
}

// Eliminar producto del carrito
function removeFromCart(productId) {
const itemIndex = cart.findIndex(item => item.id === productId);
if (itemIndex === -1) return;

const item = cart[itemIndex];
cartCount -= item.quantity;
cartTotal -= item.price * item.quantity;

cart.splice(itemIndex, 1);

updateCartUI();
showNotification('Producto eliminado del carrito');
}

// Actualizar cantidad de un producto en el carrito
function updateQuantity(productId, newQuantity) {
const item = cart.find(item => item.id === productId);
if (!item || newQuantity < 1) return;

cartCount += newQuantity - item.quantity;
cartTotal += item.price * (newQuantity - item.quantity);

item.quantity = newQuantity;
updateCartUI();
}

// Vaciar el carrito
function clearCart() {
cart = [];
cartCount = 0;
cartTotal = 0;

updateCartUI();
showNotification('Carrito vaciado');
}

// Finalizar compra
function checkout() {
if (cart.length === 0) {
  showNotification('El carrito está vacío');
  return;
}

showNotification('¡Compra realizada con éxito!');
clearCart();
cartElement.classList.remove('active');
}

// Actualizar la UI del carrito
function updateCartUI() {
// Actualizar contador
cartCountElement.textContent = cartCount;

// Actualizar lista de productos en el carrito
cartItemsContainer.innerHTML = '';

if (cart.length === 0) {
  cartItemsContainer.innerHTML = '<div class="cart-empty">El carrito está vacío</div>';
  cartTotalPrice.textContent = '$0.00';
  return;
}

cart.forEach(item => {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.innerHTML = `
      <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="cart-item-actions">
          <div class="cart-item-quantity">
              <button class="decrease" data-id="${item.id}">-</button>
              <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
              <button class="increase" data-id="${item.id}">+</button>
          </div>
          <button class="btn remove-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
          </button>
      </div>
  `;
  cartItemsContainer.appendChild(cartItem);
});

// Actualizar total
cartTotalPrice.textContent = `$${cartTotal.toFixed(2)}`;

// Agregar eventos a los botones del carrito
document.querySelectorAll('.decrease').forEach(button => {
  button.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === id);
      if (item.quantity > 1) {
          updateQuantity(id, item.quantity - 1);
      } else {
          removeFromCart(id);
      }
  });
});

document.querySelectorAll('.increase').forEach(button => {
  button.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const item = cart.find(item => item.id === id);
      updateQuantity(id, item.quantity + 1);
  });
});

document.querySelectorAll('.cart-item input[type="number"]').forEach(input => {
  input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const newQuantity = parseInt(e.target.value);
      if (newQuantity > 0) {
          updateQuantity(id, newQuantity);
      } else {
          removeFromCart(id);
      }
  });
});

document.querySelectorAll('.remove-item').forEach(button => {
  button.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      removeFromCart(id);
  });
});
}

// Mostrar notificación
function showNotification(message) {
notification.textContent = message;
notification.classList.add('active');

setTimeout(() => {
  notification.classList.remove('active');
}, 3000);
}

// Inicializar eventos
function initEvents() {
// Abrir carrito
cartIcon.addEventListener('click', () => {
  cartElement.classList.add('active');
});

// Cerrar carrito
cartClose.addEventListener('click', () => {
  cartElement.classList.remove('active');
});

// Vaciar carrito
cartClear.addEventListener('click', clearCart);

// Finalizar compra
cartCheckout.addEventListener('click', checkout);
}

// Inicializar la aplicación
function init() {
renderProducts();
initEvents();
updateCartUI();
}

// Ejecutar cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', init);