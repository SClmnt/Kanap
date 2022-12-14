fetch ("http://localhost:3001/api/products")
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


const productIndex = document.getElementById("items");

function productsList(data){
    
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











