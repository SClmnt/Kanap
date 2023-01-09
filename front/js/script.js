//Requête GET de l'API

fetch ("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){
        console.log(value);
        productsList(value);
    })
    
    .catch(function(err){

});

//Catalogue de la page d'accueil

const productIndex = document.getElementById("items");
/**
 * Récupère les données dans l'API et remplit le catalogue des produits
 * @param {string} data 
 */
function productsList(data){
    
    //Ajout auto. des produits

    for ( let i = 0; i < data.length; i++){
        productIndex.innerHTML += `<a href="./product.html?id=${data[i]._id}">
        <article>
        <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
        <h3 class="productName">${data[i].name}</h3>
        <p class="productDescription">${data[i].description}</p>
        </article>
        </a>`;
    };
}