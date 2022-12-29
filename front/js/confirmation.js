//Récupération de l'id dans l'url
const urlId= new URL(window.location.href).searchParams.get("orderId");
console.log(urlId);

//Insertion de l'id dans la page
document.getElementById("orderId").innerHTML = urlId;