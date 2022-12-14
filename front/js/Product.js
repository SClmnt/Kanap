fetch ("http://localhost:3001/api/products")
    .then(function(res){
        if(res.ok)  {
            return res.json();
        }
    })
    .then(function(value){
        console.log(value);
        productsId(value);
        productFill(value);
    })
    
    .catch(function(err){

    });



        var currentUrl = window.location.href;
        var url = new URL(currentUrl);
        var urlId = url.searchParams.get("id");
        var productNumber = 0;
        var productId = productsList[productNumber]._id;

get (urlId)
    
    