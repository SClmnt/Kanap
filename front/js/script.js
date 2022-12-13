fetch ("http://localhost:3001/api/products")
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){
        console.log(value);
    })
    .catch(function(err){

    });

function products(data){

    let product =
    `<a href="./product.html?id=42">
        <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
    </a>`;
        for (let r of data.list) {
            product +=
            `<a href="./product.html?id=${r._id}">
            <article>
                <img src="${r.imageUrl}" alt="${r.altTxt}">
                <h3 class="productName">${r.name}</h3>
                <p class="productDescription">${r.description}</p>
            </article>
        </a>`;
        }
        document.getElementById("items").innerHTML = product;
    
}


//const productIndex = document.getElementById("items");
//productIndex.innerHTML = `<a href="./product.html?id=42">
//<article>
 // <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//  <h3 class="productName">Kanap name1</h3>
 // <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//</article>
//</a>`;

