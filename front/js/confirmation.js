let orderId;

function getProductIdInUrl(){
    let url = new URL(window.location.href);
    orderId = url.searchParams.get('orderID');
}

function showOrderId(){
    getProductIdInUrl();
    const orderIDTag = document.getElementById('orderId');
    orderIDTag.innerHTML = `<br/> ${orderId}`;
    orderIDTag.style = "font-weight : bold";
}

showOrderId();
