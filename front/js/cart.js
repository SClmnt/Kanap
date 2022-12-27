////Requête GET de l'API
fetch ("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){
        console.log(value);
       
        getCart(value);
        cartFill(value);
    })   
    .catch(function(err){
    });

//Sauvegarde du panier
function saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
};

//Récupération du panier dans le localStorage
function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart === null){
        return [];
    }else{
        return JSON.parse(cart);
    }
};

function removeFromCart(product){
  let cart = getCart();
  cart = cart.filter(p => p.id != product.id && p.color != product.color);
  saveCart(cart);
  let productRef = document.querySelector(`article.cart__item[data-id="${product.id}"][data-color="${product.color}"]`);
  console.log(productRef);  
  productRef.remove(0);
}

//Remplissage de la page panier
const cartIndex = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalCartPrice = document.getElementById("totalPrice");

function cartFill(){
    let cart = getCart();
    var cartTotal = 0;
    let priceTotal = 0;
    
    for (let i = 0; i < cart.length; i++){
        fetch(`http://localhost:3000/api/products/${cart[i].id}`)
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function(value) {
          productData(cart[i], value);
          //Calcul de la quantité
          let numberQuantity = Number(`${cart[i].quantity}`);
          cartTotal += numberQuantity;
          //Calcul du prix
          let totalProductPrice = Number (`${value.price}`)* numberQuantity;
          priceTotal += totalProductPrice;
          totalCartPrice.innerHTML = priceTotal;
          totalQuantity.innerHTML = cartTotal;
        })
        .catch(function(err) {          
        });
    };  
};

function productData(product, data){ 
  console.log("produit ajouté");
  cartIndex.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${product.color}</p>
        <p>${data.price}  €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
  addOnChangeEventToInputQuantity();
  addOnRemoveEventFromQuantity();
};

function addOnChangeEventToInputQuantity(item)
{
  document.querySelectorAll('input[name="itemQuantity"]').forEach(item => {
    item.addEventListener('change', function(event) {
      console.log('closest', event.target.closest('.cart__item'));
      changeQuantity(
        {
          'id': event.target.closest('.cart__item').dataset.id, 
          'color': event.target.closest('.cart__item').dataset.color
        },
        Number(event.target.value)
      );
      //TODO : Mettre a jour la quantity pour le produit spécifique dans le localStorage grace a la valeur de data-id (indice: voir pour récupérer les parents vu que le data id est sur article et que l'on est plus bas sur l'input)
      refreshCartQuantity();
      refreshCartPrice();
    })
  });
}

function addOnRemoveEventFromQuantity(item)
{
  document.querySelectorAll('.deleteItem').forEach(item => {
    item.addEventListener('click', function(event) {
      console.log('closest', event.target.closest('.cart__item'));
      removeFromCart(
        {
          'id': event.target.closest('.cart__item').dataset.id, 
          'color': event.target.closest('.cart__item').dataset.color
        }
      );
      //TODO : Mettre a jour la quantity pour le produit spécifique dans le localStorage grace a la valeur de data-id (indice: voir pour récupérer les parents vu que le data id est sur article et que l'on est plus bas sur l'input)
      refreshCartQuantity();
      refreshCartPrice();
    })
  });
};

function refreshCartQuantity()
{
  let cart = getCart();
  let cartTotal = 0;
  for (let i = 0; i < cart.length; i++){
      let numberQuantity = Number(`${cart[i].quantity}`);
      cartTotal += numberQuantity;
  };
  totalQuantity.innerHTML = cartTotal;  
};

function refreshCartPrice()
{
  let cart = getCart();
  let priceTotal = 0;
  if (cart.length === 0) {
    totalCartPrice.innerHTML = 0;
  }
  for (let i = 0; i < cart.length; i++){
    fetch(`http://localhost:3000/api/products/${cart[i].id}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      //Calcul du prix
      let numberQuantity = Number(`${cart[i].quantity}`);
      let totalProductPrice = Number (`${value.price}`)* numberQuantity;
      priceTotal += totalProductPrice;
      totalCartPrice.innerHTML = priceTotal;
    })
    .catch(function(err) {          
    });       
  };
};

//console.log(cartHtmlQuantity);
function changeQuantity(product, quantity){
  let cart = getCart();
  let foundProduct = cart.find(p => p.id === product.id && p.color === product.color);
  console.log('test', foundProduct.quantity);
  if (foundProduct !== undefined){
    foundProduct.quantity = quantity;
    if (foundProduct.quantity <= 0) {
        removeFromCart(foundProduct);
    }else{
      saveCart(cart);
    }
  } 
};


//Formulaire

const orderBtn = document.getElementById('order');
orderBtn.addEventListener('click', function(event){
  event.preventDefault();
  let data = {};
  data.contact = getCustomerData();
  let cart = productArray();
  data.products = cart;
  console.log(JSON.stringify(data));
  fetch(`http://localhost:3000/api/products/order`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function(res){
    if(res.ok)  {
        return res.json();
    }
  })
  .then(function(value){
    console.log(value);
    if(value.orderId){
      document.location.href=`http://localhost:5500/front/html/confirmation.html?orderId='${value.orderId}'`
    }
  })   
  .catch(function(err){
  });
});

function getCustomerData(){
  //let form = document.querySelector('form.cart__order');
  let logIn = {};
  document.querySelectorAll('.cart__order__form__question input[type="text"],.cart__order__form__question input[type="email"]').forEach(item => {
    
    logIn[item.name] = item.value;
    
    
  });
  //console.log(logIn);
  return logIn;
};

function productArray(){
  let cart = getCart();
  let cartArray = [];
  cart.map(product => cartArray.push(product.id));
  return cartArray;
};

console.log(productArray());


