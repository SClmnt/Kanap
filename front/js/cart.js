////Requête GET de l'API
fetch ("http://localhost:3001/api/products")
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
}

//Remplissage de la page panier
const cartIndex = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");

function cartFill(){
    let cart = getCart();
    var cartTotal = 0;
    var priceTotal = 0;    
    for (let i = 0; i < cart.length; i++){
        fetch(`http://localhost:3001/api/products/${cart[i].id}`)
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function(value) {
          console.log(value);
          productData(value);
          productPriceQuantity(value);
        })
        .catch(function(err) {          
        });

      function productData(data){
        
        console.log("produit ajouté");
        cartIndex.innerHTML += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
        <div class="cart__item__img">
          <img src="${data.imageUrl}" alt="${data.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${data.name}</h2>
            <p>${cart[i].color}</p>
            <p>${data.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    console.log(totalProductPrice)
    };
    function productPriceQuantity(data){
      var numberQuantity = Number(`${cart[i].quantity}`);
      var totalProductPrice = `${data.price}`* numberQuantity;
      priceTotal += totalProductPrice;
      console.log(priceTotal);
    };
      var numberQuantity = Number(`${cart[i].quantity}`);
      cartTotal += numberQuantity;
      
    };    
    
    totalQuantity.innerHTML = cartTotal;
};


function changeQuantity(product, quantity){
  let cart = getCart();
  let cartHtmlQuantity = document.getElementsByClassName("itemQuantity");
  let matchingItem = cart.find(p => p.id === product.id && p.color === product.color);
  if (matchingItem != undefined) {
    cart.quantity = cartHtmlQuantity.value;
  }
  saveCart(cart);
};

//Calcul du prix