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
const productQuantity = document.getElementById("quantity")

addBtn.addEventListener('click', function(addToLocalStorage){
    
    console.log(productQuantity.value);
});