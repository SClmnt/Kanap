//Sauvegarde du panier

function saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
};

//Récupération du panier dans le localStorage
/**
 * Récupère le tableau du localStorage
 * @returns {array} cart
 */
function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart === null && cart === undefined){
        return [];
    }else{
        return JSON.parse(cart);
    }
};
//Suppression du produit du localStorage
/**
 * Cherche et supprime le produit correspondant
 * @param {string | number} product 
 */
function removeFromCart(product){
  let cart = getCart();
  let productRef = document.querySelector(`article.cart__item[data-id="${product.id}"][data-color="${product.color}"]`);
  cart = cart.filter(p => p.color !== product.color || p.id !== product.id);
  saveCart(cart);
  productRef.remove();
}

//Remplissage de la page panier

const cartIndex = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalCartPrice = document.getElementById("totalPrice");
/**
 * Cherche et remplis le panier avec les caractéristiques produit
 * @param {array} cart
 * @param {index} i
 * @param {string} id
 * @param {number} quantity
 * @param {number} price
 * 
 */
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

//Insertion des caracteristiques produit 
/**
 * Récupère la data et l'insère dans le DOM
 * @param {object} product 
 * @param {object} data
 * @return {...HTMLElement} cartIndex
 */
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
  addOnRemoveEvent();
};

//Fonction de changement de la quantité
/**
 * Change la quantité du produit correspondant dans le localStorage
 * @param {HTMLElement} item
 * @param {string | number} event
 */
function addOnChangeEventToInputQuantity()
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
      refreshCartQuantity();
      refreshCartPrice();
    })
  });
}

//Bouton supprimer
/**
 * Supprime l'objet correspondant du localStorage
 * @param {string | number} event
 */
function addOnRemoveEvent()
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
      refreshCartQuantity();
      refreshCartPrice();
    })
  });
};

//Rafraichissement de la quantite et du prix du panier
/**
 * Actualise la quantité dans le DOM
 * @param {array} cart
 * @param {object} i 
 * @param {number} quantity
 * @return {number} cartTotal
 */
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

/**
 * Actualise le prix dans le DOM
 * @param {array} cart
 * @param {object} i 
 * @param {string} id
 * @param {number} quantity
 * @return {number} priceTotal
 */

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
      let numberQuantity = Number(`${cart[i].quantity}`);
      let totalProductPrice = Number (`${value.price}`)* numberQuantity;
      priceTotal += totalProductPrice;
      totalCartPrice.innerHTML = priceTotal;
    })
    .catch(function(err) {          
    });       
  };
};

//Changement de la quantité de la page panier
/**
 * Changement de la quantité depuis le champ HTML de la page panier
 * @param {object} product 
 * @param {number} quantity 
 */
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
/**
 * Vérifie la présence de données et les envoies au backend 
 * @param {HTMLElement} event
 * @param {array} data
 * @param {object} contact
 * @param {array} cart
 * 
 */
const orderBtn = document.getElementById('order');
orderBtn.addEventListener('click', function(event){
  event.preventDefault();
  checkInput();
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
      localStorage.removeItem('cart');       
      document.location.href=`http://localhost:5500/front/html/confirmation.html?orderId='${value.orderId}'`;     
    }else{
      alert("une erreur s'est produite");
    };
  })   
  .catch(function(err){
  });
});

//Verification des donnees envoyees

const formFirstName = document.getElementById("firstName");
const formLastName = document.getElementById("lastName");
const formAddress = document.getElementById("address");
const formCity = document.getElementById("city");
const formEmail = document.getElementById("email");
const formInput = document.querySelectorAll(".cart__order__form__question input");

//Fonction vérifiant la présence de donnees dans les champs
/**
 * Vérifie si les champs ne sont pas vides
 * @param {textContent} input
 */
function checkInput(){
  formInput.forEach(function(input){
      if(input.value.length < 1){
        input.nextElementSibling.textContent = "Veuillez renseigner ce champ!";        
      }    
  } );
};
const searchUnauthorizedCharacter = /[0-9!#$%&'*+/=?^_`(){|}~.-]/;
const startWithNumber = /^[0-9]/;
const searchMail = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@+[a-zA-Z0-9]+.+[a-zA-Z0-9]{2,3}$/;

formFirstName.addEventListener('change', function(e){
  var value = e.target.value;
  if(searchUnauthorizedCharacter.test(value)){
    document.getElementById("firstNameErrorMsg").textContent = "Pas de carctères spéciaux dans ce champ!";
  }else{
    document.getElementById("firstNameErrorMsg").textContent ="";
  }
});

formLastName.addEventListener('change', function(e){
  var value = e.target.value;
  if(searchUnauthorizedCharacter.test(value)){
    document.getElementById("lastNameErrorMsg").textContent = "Pas de carctères spéciaux dans ce champ!";
  }else{
    document.getElementById("lastNameErrorMsg").textContent ="";
  }
});

formAddress.addEventListener('change', function(e){
  var value = e.target.value;
  if(startWithNumber.test(value)){
    document.getElementById("addressErrorMsg").textContent = "";
  }else{
    document.getElementById("addressErrorMsg").textContent ="N'oubliez pas le numéro de la rue!";
  }
});

formCity.addEventListener('change', function(e){
  var value = e.target.value;
  if(searchUnauthorizedCharacter.test(value)){
    document.getElementById("cityErrorMsg").textContent = "Pas de carctères spéciaux dans ce champ!";
  }else{
    document.getElementById("cityErrorMsg").textContent ="";
  }
});

formEmail.addEventListener('change', function(e){
  var value = e.target.value;
  if(searchMail.test(value)){
    document.getElementById("emailErrorMsg").textContent = "";
  }else{
    document.getElementById("emailErrorMsg").textContent ="Ce format d'adresse mail n'est pas valide!";
  }
});

//Objet coordonees client
/**
 * Renvoie l'objet des coordonnées client
 * @return {object} logIn
 */
function getCustomerData(){
  let logIn = {};
  document.querySelectorAll('.cart__order__form__question input[type="text"],.cart__order__form__question input[type="email"]').forEach(item => 
    {logIn[item.name] = item.value;
  });
  return logIn;
};

//Tableau contenu du panier
/**
 * Renvoie le tableau du contenu du panier
 * @return {array} cartArray
 */
function productArray(){
  let cart = getCart();
  let cartArray = [];
  cart.map(product => cartArray.push(product.id));
  return cartArray;
};

cartFill();