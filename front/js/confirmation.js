const urlId= new URL(window.location.href).searchParams.get("orderId");
console.log(urlId);

document.getElementById("orderId").innerHTML = urlId;