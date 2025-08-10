'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}


/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  }
   else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } 
  else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});
//const btns = document.querySelectorAll(".btn");




/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

/**CART**/

//cart open close
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

//open cart
cartIcon.onclick=() => {
    cart.classList.add("active");
}
//close cart
closeCart.onclick=() => {
    cart.classList.remove("active");
}
//Add to Cart
if (document.readyState == "Loading"){
    document.addEventListener("DOMContentLoaded",ready);
}else{
    ready();
}
function ready(){
  //remove from cart
  var removeCartButtons = document.getElementsByClassName('cart-remove');
  for (var i = 0; i<removeCartButtons.length; i++){
      var button = removeCartButtons[i];
      button.addEventListener('click',removeCartItem);
  }
  //quantity change
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i<removeCartButtons.length; i++){
      var input = quantityInputs[i];
      input.addEventListener("change", quantityChanged);
}
//Add to Cart
var addCart =document.getElementsByClassName('add-cart');
for (var i = 0; i<addCart.length; i++){
  var button = addCart[i];
  button.addEventListener("click", addCartClicked);
}
loadCartItems();
}

//Remove Cart Item
function removeCartItem(event){
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updatetotal();
  saveCartItems();
  udpateCartIcon();
}

//Quantity Change
function quantityChanged(event){
  var input = event.target;
  if(isNaN(input.value) || input.value <= 0){
      input.value = 1;
  }
  updatetotal();
  saveCartItems();
  udpateCartIcon();
}

//Add Cart Function
function addCartClicked(event){
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
  addProductToCart(title,price,productImg);
  updatetotal();
  saveCartItems();
  udpateCartIcon();
}

function addProductToCart(title,price,productImg){
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
  for ( var i = 0; i < cartItemsNames.length ; i++){
      if (cartItemsNames[i].innerText == title){
          alert("You have already added this item to cart");
          return;
      }
  }
  var cartBoxContent = `<img src="${productImg}" class="cart-img" alt="" />
  <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input
          type="number"
          name=""
          id=""
          value="1"
          class="cart-quantity" />
  </div>
  <i class='bx bx-trash-alt cart-remove'></i>`;
cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox
.getElementsByClassName('cart-remove')[0]
.addEventListener("click",removeCartItem);
cartShopBox
.getElementsByClassName('cart-quantity')[0]
.addEventListener("change", quantityChanged);
saveCartItems();
udpateCartIcon();
}


//Update Total
function updatetotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total =0;
  for (var i =0; i < cartBoxes.length ; i++){
      var cartBox = cartBoxes[i];
      var priceElement = cartBox.getElementsByClassName("cart-price")[0];
      var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
      var price = parseFloat(priceElement.innerText.replace("Rs.",""));
      var quantity = parseInt(quantityElement.value);
      total += price*quantity; 
  }
      document.getElementsByClassName("total-price")[0].innerText = "Rs." + total;
  //save total to localstorage
  localStorage.setItem("cartTotal",total);
}

//keep item in cart when page refreshes with local storage
function saveCartItems (){
  var cartContent = document.getElementsByClassName('cart-content')[0];
  var cartBoxes = cartContent.getElementsByClassName('cart-box');
  var cartItems = [];

  for (var i=0; i<cartBoxes.length;i++){
      var cartBox = cartBoxes[i];
      var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
      var priceElement = cart.getElementsByClassName('cart-price')[0];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

      var item = {
          title: titleElement.innerText,
          price: priceElement.innerText,
          quantity: quantityElement.value,
          productImg: productImg,
      };
      cartItems.push(item);
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
//loads In Cart
function loadCartItems(){
  var cartItems = localStorage.getItem('cartItems');
  if (cartItems){
      cartItems = JSON.parse(cartItems);
      for (var i =0;i< cartItems.length;i++){
          var item = cartItems[i];
          addProductToCart(item.title, item.price , item.productImg);

          var cartBoxes = document.getElementsByClassName('cart-box');
          var cartBox = cartBoxes[cartBoxes.length - 1];
          var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
          quantityElement.value = item.quantity;
      }
  }
  var cartTotal = localStorage.getItem('cartTotal');
  if(cartTotal){
      document.getElementsByClassName("total-price")[0].innerText = "Rs."+cartTotal;
  }
  udpateCartIcon();
}
//Quantity in Cart Icon
function udpateCartIcon()
{
  var cartBoxes = document.getElementsByClassName("cart-box");
  var quantity = 0;

  for(var i=0; i<cartBoxes.length; i++)
  {
      var cartBox = cartBoxes[i];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      quantity+= parseInt(quantityElement.value);
  }
  var cartIcon = document.querySelector('#cart-icon');
  cartIcon.setAttribute('data-quantity',quantity);
}

/*RATING*/
let stars = 

    document.getElementsByClassName("star");
let output = 

    document.getElementById("output");
 
// Funtion to update rating

function gfg(n) {
    let cls;
    remove();

    for (let i = 0; i < n; i++) {

        if (n == 1) cls = "one";

        else if (n == 2) cls = "two";

        else if (n == 3) cls = "three";

        else if (n == 4) cls = "four";

        else if (n == 5) cls = "five";

        stars[i].className = "star " + cls;

    }

    output.innerText = "Rating is: " + n + "/5";
}
 
// To remove the pre-applied styling

function remove() {

    let i = 0;

    while (i < 5) {

        stars[i].className = "star";

        i++;

    }
}

//clear cart after successful payment
function clearCart(){
  var cartContent = document.getElementsByClassName('cart-content')[0];
  cartContent.innerHTML = '';
  updatetotal();
  localStorage.removeItem('cartItems');
}

