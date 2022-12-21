//Récupération de l'id dans l'url
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var urlId = url.searchParams.get("id");

//Requête GET de l'API produit
/*http://localhost:3001/api/products/${urlId}*/

fetch (`http://localhost:3001/api/products/${urlId}`)
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){

        productFill(value);
        console.log('toto');
        colors(value);
        console.log('tata');
    })
    
    .catch(function(err){

    });

//Remplissage auto de la fiche produit
    
    const title = document.querySelector("title");
    const productImg = document.getElementsByClassName("item__img");
    const productName = document.getElementById("title");
    const productPrice = document.getElementById("price");
    const productDescription = document.getElementById("description");

function productFill (data){

    title.innerText = `${data.name}`;
    productImg[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    productName.innerText = `${data.name}`;
    productPrice.innerText = `${data.price}`;
    productDescription.innerText = `${data.description}`;
   
};

//Remplissage de la catégorie Couleurs

function colors(data){
    let productColors = document.getElementById("colors");
    
    for (i = 0; i < data.colors.length; i++){
    productColors.innerHTML +=`<option value="${data.colors[i]}">${data.colors[i]}</option>`;
    }
};

//Ajout des produits au panier

const addBtn = document.getElementById("addToCart");

/*function productFound(){
    let productQuantity = document.getElementById("quantity").value;
    let productColor = document.getElementById("colors").value;
    let cart = JSON.parse(localStorage.getItem("cart"));
    let product = {
            id : urlId,
            color : productColor,
            quantity : productQuantity,
        };
    console.log(cart);
    if(null === cart){
        cart = [];
    }
    
    return undefined !== cart.find(cartProduct => cartProduct.id === product.id && cartProduct.color === product.color && cartProduct.quantity > 0)

    let productIdFound = undefined !== cart.find(cartProduct => cartProduct.id === product.id);
    let productColorFound = undefined !== cart.find(cartProduct => cartProduct.color === product.color);
    let productQuantityFound = undefined !== cart.find(cartProduct => cartProduct.quantity > 0);
    return productIdFound && productColorFound && productQuantityFound;
    if(productIdFound && productColorFound && productQuantityFound ){
        console.log("déjà-la");
        return true;
        
    }else{
        console.log("pas vu");
        return false;        
    };
};*/

addBtn.addEventListener('click', function(addToCart){{
        let productQuantity = parseInt(document.getElementById("quantity").value);
        let productColor = document.getElementById("colors").value;
        let cart = JSON.parse(localStorage.getItem("cart"));
        

        if(null === cart){
            cart = [];
        }
        
        let product = {
                id : urlId,
                color : productColor,
                quantity : productQuantity,
        };


        if(productQuantity > 0 && undefined !== cart.find(cartProduct => cartProduct.id === product.id && cartProduct.color === product.color && cartProduct.quantity > 0)){
            console.log("déja la");
            let cartProductIndex = cart.findIndex(cartProduct => cartProduct.id === product.id && cartProduct.color === product.color && cartProduct.quantity > 0);
            cart[cartProductIndex].quantity+=product.quantity; 
        }else{
            console.log("new item");
            cart.quantity = product.quantity;
            cart.push(product);  
        }
        
        localStorage.setItem("cart",JSON.stringify(cart));      
           
        
        
        
        
    }

});