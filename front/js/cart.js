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

function saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
};

function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart === null){
        return [];
    }else{
        return JSON.parse(cart);
    }
};

function getData(data){
    JSON.stringify(data);   
}

const cartIndex = document.getElementById("cart__items");

function productFound(data){
    let cart = getCart();
    cart.find(product => product.id === data[0,7].id);
    
};

function cartFill(){
    let cart = getCart();
    
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
      </article>`};
    }
};

