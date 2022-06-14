let orderId;

/* === Get the productId number from the url === */
function getProductIdInUrl(){
    let url = new URL(window.location.href);
    orderId = url.searchParams.get('orderID');
}

/* === Add to the DOM the productId number of the order === */
function showOrderId(){
    getProductIdInUrl();
    const orderIDTag = document.getElementById('orderId');
    orderIDTag.innerHTML = `<br/> ${orderId}`;
    orderIDTag.style = "font-weight : bold";
}

showOrderId();
