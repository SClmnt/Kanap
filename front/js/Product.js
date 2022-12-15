
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var urlId = url.searchParams.get("id");


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

function productFill (data){
    let title = document.querySelector("title");
    let productImg = document.getElementsByClassName("item__img");
    let productName = document.getElementById("title");
    let productPrice = document.getElementById("price");
    let productDescription = document.getElementById("description");


    title.innerText = `${data.name}`;
    productImg[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    productName.innerText = `${data.name}`;
    productPrice.innerText = `${data.price}`;
    productDescription.innerText = `${data.description}`;
   
};

function colors(data){
    let productColors = document.getElementById("colors");
    
    for (i = 0; i < data.colors.length; i++){
    productColors.innerHTML +=`<option value="${data.colors[i]}">${data.colors[i]}</option>`;
    console.log(productColors);}
};