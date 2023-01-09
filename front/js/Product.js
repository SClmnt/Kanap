//Récupération de l'id dans l'url
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var urlId = url.searchParams.get("id");

//Requête GET de l'API produit

fetch (`http://localhost:3000/api/products/${urlId}`)
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){
        productFill(value);
        colors(value);
    })    
    .catch(function(err){
});

/**
 * Récupération du tableau dans l'API
 * @returns {array} cart
 */
function getCart(){
    let cart = localStorage.getItem("cart");
    if(cart === null){
        return [];
    }else{
        return JSON.parse(cart);
    }
};

//Remplissage auto de la fiche produit
    
const title = document.querySelector("title");
const productImg = document.getElementsByClassName("item__img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
/**
 * Récupère les données dans l'API et remplit la fiche produit
 * @param {(string | number)} data 
 */
function productFill (data){
    title.innerText = `${data.name}`;
    productImg[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    productName.innerText = `${data.name}`;
    productPrice.innerText = `${data.price}`;
    productDescription.innerText = `${data.description}`;    
};

//Remplissage de la catégorie Couleurs
/**
 * Récupère les couleurs disponibles pour le produit
 * @param {string} data 
 */
function colors(data){
    let productColors = document.getElementById("colors");
    
    for (i = 0; i < data.colors.length; i++){
    productColors.innerHTML +=`<option value="${data.colors[i]}">${data.colors[i]}</option>`;
    }
};

//Ajout des produits au panier
/**
 * Récupère le tableau du localStorage
 * @param {array} cart 
 */    
function saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
}
    
/**
 * Récolte les données à ajouter au loalStorage
 * @param {number} productQuantity
 * @param {string} productColor
 * @param {string} urlId
 * @returns {object} product
 */
const addBtn = document.getElementById("addToCart");
addBtn.addEventListener('click', function(){{
        let productQuantity = parseInt(document.getElementById("quantity").value);
        let productColor = document.getElementById("colors").value;
        if (productColor.length === 0){
            alert("Veuillez choisir une couleur.");

            return false;
        }
        if(productQuantity <= 0 || productQuantity > 100){
            alert("Cette quantité n'est pas valide, la quantité doit être comprise entre 1 et 100.");

            return false;
        }
        let cart = getCart();
        console.log(productColor)
        if(null === cart){
            cart = [];
        }        
        let product = {
                id : urlId,
                color : productColor,
                quantity : productQuantity,
        };

        if(productQuantity > 0  && undefined !== cart.find(cartProduct => cartProduct.id === product.id && cartProduct.color === product.color && cartProduct.quantity > 0)){
            console.log("added to cart");
            let cartProductIndex = cart.findIndex(cartProduct => cartProduct.id === product.id && cartProduct.color === product.color && cartProduct.quantity > 0);
            cart[cartProductIndex].quantity+=product.quantity;
        }else{
            console.log("new item");
            cart.quantity = product.quantity;
            cart.push(product);  
        }            
        saveCart(cart);
        alert("Produit ajouté au panier avec succès!");                  
    }
});