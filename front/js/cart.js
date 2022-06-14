/*====================================================*/
/* -------------------- Import -----------------------*/
/*====================================================*/

import { addIconBag, getAllproductOfStorage, quantityInBag } from "./script.js";
//import { advise, removeAdvise, saveInLocalStorage, getProductCharacteristic } from "./product.js";


/*====================================================*/
/* ------------------- Variables ---------------------*/
/*====================================================*/
let userData = {};
let products = [];
let order = 0;

const titleBagTag = document.querySelector('.cartAndFormContainer h1');

/*====================================================*/
/* -------------------- Function ---------------------*/
/*====================================================*/

/* ----------------- Part Product Choiced ---------------------*/

/* === Add all the product Choiced to the DOM === */
function showAllProductChoiced(){
    let allProductTab = getAllproductOfStorage();
    allProductTab.forEach(showProduct);
}

function showProduct(product){
    let id = product.id;
    for (let element in product){
        if (element != "id"){
            order++;
            createArticle(id, element, product[element],order);

        }
    }
}

/* === Add a new product article to the DOM === */
async function createArticle(id, color, qty,orderToCreate){
    let productCharacteristic = await getProductCharacteristic(id);
    const cartTag = document.getElementById('cart__items');
    cartTag.style = "display: flex; flex-direction:column";

    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.style = `order : ${orderToCreate};`; // trick to have same kind of product grouped
    article.dataset.id = id;
    article.dataset.color = color;
    article.innerHTML = `<div class="cart__item__img">
    <img src="${productCharacteristic.imageUrl}" alt="${productCharacteristic.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${productCharacteristic.name}</h2>
      <p>${color}</p>
      <p>${productCharacteristic.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;

  cartTag.appendChild(article);

}

/* === Collect Characteristic of a product and return it === */
async function getProductCharacteristic(productID){
    /*return fetch(`http://localhost:3000/api/products/${productID}`)
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(product){
            return product;

            //productCharacteristic = product;
            //***
        }).catch(function(err){
            console.error(err);
            //showError();
        });*/

        try {
            const res = await fetch(`http://localhost:3000/api/products/${productID}`);
            if (res.ok){
                return res.json();
            }
        } catch (error) {
            console.error(error);
        }
}


/* ----------------- Part Total ---------------------*/

/* === Add to the DOM the total number of product and the total price === */
async function showTotal(){
    const totalQuantityTag = document.getElementById('totalQuantity');
    totalQuantityTag.innerText = quantityInBag;
    const totalPriceTag = document.getElementById('totalPrice');
    totalPriceTag.innerText = await totalPrice();
}

/* === Calculate the total price === */
async function totalPrice(){
    let storageTab = getAllproductOfStorage();
    let totalPrice = 0;

    for (let product of storageTab){
        let productCharacteristic = await getProductCharacteristic(product.id);
        let price = productCharacteristic.price;
        for (let element in product){
            if (element != "id"){
                totalPrice += price*product[element];
            }
        }
    }
    return totalPrice;
}

/* ----------------- Part Change on the Cart ---------------------*/

/* === AddEventListener change on each input that change the quantity choiced of a product === */
function initEventChangeQuantity(){
    const itemQuantityInputTab = document.querySelectorAll('.itemQuantity');
;    itemQuantityInputTab.forEach(input => {
        input.addEventListener('change', updateQuantity); //change is when input lose focus
    });
}

/* === Update Quantity everywhere === */
function updateQuantity(e){
    let newQuantity = parseInt(e.target.value);
    let articleId = e.target.closest('.cart__item').dataset.id;
    let articleColor = e.target.closest('.cart__item').dataset.color;
    let storageTab = getAllproductOfStorage();
    if ((newQuantity != "") && (newQuantity >= 1) &&(newQuantity <= 100)){
        updateLocalStorage(newQuantity, articleId, articleColor, storageTab);
        addIconBag();
        showTotal();
          
    } else {
        putBackOldValue(e.target, articleId, articleColor, storageTab);
    }
}

/* === Update Quantity in the local Storage === */
function updateLocalStorage(newQuantity, articleId, articleColor, storageTab){
    storageTab.forEach( product => {
        if (product.id === articleId){
            product[articleColor] = newQuantity;
        }
    });
    //saveInLocalStorage(storageTab);
    localStorage.kanapProduct = JSON.stringify(storageTab);
    
}

/* === If value entered is wrong modify value of input to have the actual number of prodct choiced === */
function putBackOldValue(input, articleId, articleColor, storageTab){
    storageTab.forEach( product => {
        if (product.id === articleId){
            input.value = product[articleColor];
            //advise("value",input.parentElement);
        }
    });

}

/* === AddEventListener click on each delete button === */
function initEventDelete(){
    const itemDeleteTab = document.querySelectorAll('.deleteItem');
    itemDeleteTab.forEach( item =>{
        item.addEventListener('click', deleteProduct);
    })
}

/* === Delete the product everywhere === */
function deleteProduct(e){
    let article = e.target.closest('.cart__item')
    let articleId = article.dataset.id;
    let articleColor = article.dataset.color;
    let storageTab = getAllproductOfStorage();

    deleteOfStorageTab(storageTab, articleId, articleColor);
    article.remove();
    addIconBag();
    showTotal();
    checkerBag();
}

/* === Delete the product of the local Storage === */
function deleteOfStorageTab(storageTab, articleId, articleColor){
    storageTab.forEach( product => {
        if (product.id === articleId){
            if (Object.keys(product).length > 2){
                delete product[articleColor];
            } else {
                storageTab.splice(storageTab.indexOf(product), 1);
            }
        }
    });
    //saveInLocalStorage(storageTab);
    localStorage.kanapProduct = JSON.stringify(storageTab);
}

/* === Initialise all the EventListener that check if value entered have the correct format === */
function initFormChecker(){
    initCheckerFirstName();
    initCheckerLastName();
    initCheckerAddress();
    initCheckerCity();
    initCheckerEmail();
}

/* === Event Listener check format of firstName  === */
function initCheckerFirstName(){
    const firstNameTag = document.getElementById('firstName');
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    // number and spécial characters not authorised ( except special character of letter : é,è,ï,ù,etc..)
    const regexFirstName = /[0-9!"#\$%&'\(\)\*\+,;:=£$¥€!?°\.\/\\\[\]\^_`{}|«»]/;
    firstNameTag.addEventListener('change', (e) =>{
        if((!(regexFirstName.test(e.target.value))) && (e.target.value.length >0)){
            userData.firstName = e.target.value;
            firstNameErrorMsg.innerText = "";
            firstNameErrorMsg.style.background = "white";
        } else {
            if (userData.firstName !== undefined){
                delete userData.firstName;
            }
            if (e.target.value.length > 0){
                firstNameErrorMsg.innerText = "Un prénom ne peut contenir ni chiffre ni charactère spéciaux (à l'exception du tiret).";
            } else {
                firstNameErrorMsg.innerText = "";
            }
        }
    });   
}

/* === Event Listener check format of lastName  === */
function initCheckerLastName(){
    const lastNameTag = document.getElementById('lastName');
    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    const regexlastName = /[0-9!"#\$%&'\(\)\*\+,;:=£$¥€!?°\.\/\\\[\]\^_`{}|«»]/ ; //    /^[\w\-\s]+$/
    lastNameTag.addEventListener('change', (e) =>{
        if((!(regexlastName.test(e.target.value))) && (e.target.value.length >0)){
            userData.lastName = e.target.value;
            lastNameErrorMsg.innerText = "";
            lastNameTag.style.background = "white";
        } else {
            if (userData.lastName !== undefined){
                delete userData.lastName;
            }
            if (e.target.value.length > 0){
                lastNameErrorMsg.innerText = "Un nom ne peut contenir ni chiffre ni charactère spéciaux (à l'exception du tiret).";
            } else {
                lastNameErrorMsg.innerText = ""; 
            }
        }
    });
    
}

/* === Event Listener check format of Address  === */
function initCheckerAddress(){
    const addressTagName = document.getElementById('address');
    const addressErrorMsg = document.getElementById('addressErrorMsg');
    // number are here authorised but not spécal characters
    const regexAddress = /[!"#\$%&\(\)\*\+;:=£¥€!?°\.\/\\\[\]\^_`{}|«»]/;

    addressTagName.addEventListener('change', (e) => {
        if((!(regexAddress.test(e.target.value))) && (e.target.value.length > 0)){
            userData.address = e.target.value;
            addressErrorMsg.innerText = "";
            addressTagName.style.background = "white";
        } else {
            if (userData.address !== undefined){
                delete userData.address;
            }
            if (e.target.value.length > 0){
                addressErrorMsg.innerText = "Veuillez entrez une adresse correcte. | Ex: 10 quai de la charente";
            } else {
                addressErrorMsg.innerText = ""; 
            }
        }
    });
}

/* === Event Listener check format of city  === */
function initCheckerCity(){
    const cityTagName = document.getElementById('city');
    const cityErrorMsg = document.getElementById('cityErrorMsg');
    const regexCity = /[0-9!"'#\$%&\(\)\*\+,;:=£¥€!?°\.\/\\\[\]\^_`{}|«»]/;
    cityTagName.addEventListener('change', (e) =>{
        if((!(regexCity.test(e.target.value))) && (e.target.value.length > 0)){
            userData.city = e.target.value;
            cityErrorMsg.innerText = "";
            cityTagName.style.background = "white";
        } else {
            if (userData.city !== undefined){
                delete userData.city;
            } 
            if (e.target.value.length > 0){
                cityErrorMsg.innerText = "Veuillez entrer un nom de ville correct. | Ex: Bézieux";
            } else {
                cityErrorMsg.innerText = ""; 
            }
        }
    });
}

/* === Event Listener check format of email === */
function initCheckerEmail(){
    // /^\w+([\.-]*\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/    
    // /^\w+([\.-]?\w+)* Must start with 1 or more word char followed by 0 or more . ou - and with at least one last word char
    // @\w+  after @ 1 or more char
    // ([\.-]?\w+)* 0 or 1 . or - followed by minus 1 char
    // (\.\w{2,4})+$/  ending with 1 or more "." and between 2 and 4 word char

    // /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
    const emailTagName = document.getElementById('email');
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    const regexEmail = /^\w+([\.-]*\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    emailTagName.addEventListener('change', (e) => {
        if( regexEmail.test(e.target.value)){
            userData.email = e.target.value;
            emailErrorMsg.innerText = "";
            emailTagName.style.background = "white";
        } else {
            if (userData.email !== undefined){
                delete userData.email;
            }
            if (e.target.value.length > 0){
                emailErrorMsg.innerText = "Veuillez rentrez une adresse email correcte. | Ex: monadresse@kanap.com"
            } else {
                emailErrorMsg.innerText = ""; 
            }
        }
    });   
}

/* === Initialisation of event Listener to order and send the request === */
function initOrderButton(){
    const orderButton = document.getElementById('order');
    orderButton.addEventListener('click', async function(e) {
        e.preventDefault();
        getProductIdArray();
        if (products.length > 0){
            let orderResult = await orderRequest();
            if (orderRequest != undefined){
                removeAllProductOfLocalStorage();
                location.replace("./confirmation.html?orderID="+orderResult.orderId);
            }
        } else if (JSON.parse(localStorage.kanapProduct).length <= 0){
            titleBagTag.scrollIntoView();
        }
    })
}

/* === Check if all input are correct and if not indicate it to user === */
function checkUserData(){
    let dataExpected = ["firstName", "lastName", "address", "city", "email"];
    
    for (let data of dataExpected){
        if (userData[data] === undefined){
            const errorTag = document.getElementById(data);
            errorTag.style.background = "#db5353";
            errorTag.previousElementSibling.scrollIntoView();
            // utilisation de setTimeout pour faire une animation de non
            return false;
        }
    }
    return true;
}

/* === Set products as an array with all the productId ordered === */
function getProductIdArray(){
    if(checkUserData()){
        products = getAllproductOfStorage();
        products = products.map(product =>{
            return product.id;
        });
    };
}

/* === Post the order of products === */
async function orderRequest(){
    let object = {
        contact : userData,
        products : products
    }
    let test;
    try {
        let res = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
                body: JSON.stringify(object)
            });
            if (res.ok){
                return res.json();
            }
    } catch (error) {
        console.error(error);
    }

}

/* === Delete array kanap Product of the LocalStorage === */
function removeAllProductOfLocalStorage(){
    localStorage.removeItem('kanapProduct');
}

/* === Change title of page if bag is empty === */
function checkerBag(){
    if ((localStorage.kanapProduct === undefined) || (JSON.parse(localStorage.kanapProduct).length <= 0)){
        titleBagTag.innerText = "Votre panier est vide";
    } else {
        titleBagTag.innerText = "Votre panier";
    }
}


/*====================================================*/
/* ----------------------- Main ----------------------*/
/*====================================================*/

async function initOfPage(){
    await showAllProductChoiced();
    await showTotal(); 

    initEventChangeQuantity();
    initEventDelete();
    checkerBag();
    initFormChecker();
    initOrderButton();
}

initOfPage();

