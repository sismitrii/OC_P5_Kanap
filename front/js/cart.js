/*====================================================*/
/* -------------------- Import -----------------------*/
/*====================================================*/

import { addIconBag } from "./script.js";
import { quantityInBag} from "./script.js";
//import {saveInLocalStorage} from "./product.js";


/*====================================================*/
/* -------------------- Function ---------------------*/
/*====================================================*/


/* ----------------- Part Product Choiced ---------------------*/

/* === Add all the product Choiced to the DOM === */
function showAllProductChoiced(){
    let allProductTab = getAllproductOfStorage();
    allProductTab.forEach(showProduct);
}

/* === return an array of the products in the local Storage === */
function getAllproductOfStorage(){
    if (localStorage.kanapProduct !== undefined){
       return JSON.parse(localStorage.kanapProduct); 
    } 
    return [];
}


function showProduct(product){
    let id = product.id;
    for (let element in product){
        if (element != "id"){
            createArticle(id, element, product[element]);
        }
    }

}

/* === Add a new product article to the DOM === */
async function createArticle(id, color, qty){
    let productCharacteristic = await getProductCharacteristic(id); // productCharateristic is a promise
    const cartTag = document.getElementById('cart__items');

    let article = document.createElement('article');
    article.classList.add('cart__item');
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
    /*storageTab.forEach(async function(product){
        let productCharacteristic = await getProductCharacteristic(product.id);
        let price = productCharacteristic.price;

        for (let element in product){
            if (element != "id"){
                totalPrice += price*product[element];
            }
        }
        console.log(totalPrice); 
        return totalPrice;
    });*/

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
            //advise()
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
    localStorage.kanapProduct = JSON.stringify(storageTab);
}



/*====================================================*/
/* ----------------------- Main ----------------------*/
/*====================================================*/

async function initOfPage(){
    await showAllProductChoiced();
    await showTotal(); 

    initEventChangeQuantity();
    initEventDelete();
}

initOfPage();

