/*====================================================*/
/* -------------------- Import -----------------------*/
/*====================================================*/

import { addIconBag, getAllproductOfStorage, quantityInBag } from "./script.js";
import {saveInLocalStorage, advise, removeAdvise, getProductCharacteristic} from "./function.js";

/*====================================================*/
/* ------------------- Variables ---------------------*/
/*====================================================*/
let userData = {};
let products = [];
let order = 0;

const inputRegexToCheck = {
    firstName : /[0-9!"#\$%&'\(\)\*\+,;:=£$¥€!?°\.\/\\\[\]\^_`{}|«»]/,
    lastName : /[0-9!"#\$%&'\(\)\*\+,;:=£$¥€!?°\.\/\\\[\]\^_`{}|«»]/,
    address :  /[!"#\$%&\(\)\*\+;:=£¥€!?°\.\/\\\[\]\^_`{}|«»]/,
    city :  /[0-9!"'#\$%&\(\)\*\+,;:=£¥€!?°\.\/\\\[\]\^_`{}|«»]/,
    email : /^\w+([\.-]*\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
}

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
        input.addEventListener('change', updateQuantity); 
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
    saveInLocalStorage(storageTab);
}

/* === If value entered is wrong modify value of input to have the actual number of prodct choiced === */
function putBackOldValue(input, articleId, articleColor, storageTab){
    storageTab.forEach( product => {
        if (product.id === articleId){
            input.value = product[articleColor];
            advise("value",input.parentElement);
            console.log(input.nextElementSibling);
            setTimeout(()=>{ removeAdvise('valueErrorMsg')}, 5000);
        }
    });
}

/* === AddEventListener click on each delete button === */
function initEventDelete(){
    const itemDeleteTab = document.querySelectorAll('.deleteItem');
    itemDeleteTab.forEach( item =>{
        item.addEventListener('click', deleteProduct);
    });
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
    saveInLocalStorage(storageTab);
}


/* ----------------- Part Order Products ---------------------*/

/* === Initialise all the EventListener that check if value entered have the correct format === */
function initFormChecker(){
    for (let type in inputRegexToCheck){
        initChecker(type, inputRegexToCheck[type]);
    }
}

/* === Event Listener check format of value entered by user === */
function initChecker(type, regex){
    const tagName = document.getElementById(type);
    const errorMsgTag = document.getElementById(`${type}ErrorMsg`);   

    tagName.addEventListener('change',(e) => {
        let testRegex;
            /* /^\w+([\.-]*\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/    
            /^\w+([\.-]?\w+)* Must start with 1 or more word char followed by 0 or more . ou - and with at least one last word char
            @\w+  after @ 1 or more char
            ([\.-]?\w+)* 0 or 1 . or - followed by minus 1 char
            (\.\w{2,4})+$/  ending with 1 or more "." and between 2 and 4 word char*/

            //my email regex /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
        if (type === 'email'){ 
            testRegex = (regex.test(e.target.value));
        } else {
            testRegex = ((!(regex.test(e.target.value))) && (e.target.value.length >0));
        }

        if (testRegex){
            userData[type] = e.target.value;
            errorMsgTag.innerText = "";
            tagName.style.background = "white";
        } else {
            if (userData[type] !== undefined){
                delete userData[type];
            }
            if (e.target.value.length > 0){
                switch(type){
                    case 'firstName' :
                        errorMsgTag.innerText = "Un prénom ne peut contenir ni chiffre ni charactère spéciaux (à l'exception du tiret).";
                        break;
                    case 'lastName' :
                        errorMsgTag.innerText = "Un nom ne peut contenir ni chiffre ni charactère spéciaux (à l'exception du tiret).";
                        break;
                    case 'address' :
                        errorMsgTag.innerText = "Veuillez entrez une adresse correcte. | Ex: 10 quai de la charente";
                        break;
                    case 'city' :
                        errorMsgTag.innerText = "Veuillez entrer un nom de ville correct. | Ex: Bézieux";
                        break;
                    case 'email' :
                        errorMsgTag.innerText = "Veuillez rentrez une adresse email correcte. | Ex: monadresse@kanap.com"
                        break;
                    default :
                        errorMsgTag.innerText = "La valeur saisie est Incorrect";
                        break;
                }
            } else {
                errorMsgTag.innerText = "";
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

