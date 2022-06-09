import { addIconBag } from "./script.js";
import { quantityInBag} from "./script.js";
//import {saveInLocalStorage} from "./product.js";



function showAllProductChoiced(){
    let allProductTab = getAllproductOfStorage();
    allProductTab.forEach(showProduct);
}


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

function getProductCharacteristic(productID){
    return fetch(`http://localhost:3000/api/products/${productID}`)
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
            console.log(err);
            //showError();
        });
}

async function showTotal(){
    const totalQuantityTag = document.getElementById('totalQuantity');
    totalQuantityTag.innerText = quantityInBag;
    const totalPriceTag = document.getElementById('totalPrice');
    totalPriceTag.innerText = await totalPrice();
}

async function totalPrice(){
    let storageTab = getAllproductOfStorage();
    let totalPrice = 0;
    /*storageTab.forEach( async function(product){
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

function changeQuantity(){
    const itemQuantityInputTab = document.querySelectorAll('.itemQuantity');
    console.log(itemQuantityInputTab);
;    itemQuantityInputTab.forEach(input => {
        input.addEventListener('change', updateQuantity); //change is when input lose focus
    });
}

function updateQuantity(e){
    let newQuantity = parseInt(e.target.value);
    if ((newQuantity != "") && (newQuantity >= 1) &&(newQuantity <= 100)){
        updateLocalStorage(newQuantity, e.target);
        addIconBag();
        showTotal();
          
    } else {
        // putBackOldValue
    }
}

function updateLocalStorage(newQuantity, input){
    let articleId = input.closest('.cart__item').dataset.id;
    let articleColor = input.closest('.cart__item').dataset.color;
    let storageTab = getAllproductOfStorage();
    
    storageTab.forEach( product => {
        if (product.id === articleId){
            product[articleColor] = newQuantity;
        }
    });
    //saveInLocalStorage(storageTab);
    localStorage.kanapProduct = JSON.stringify(storageTab);
    
}

async function initOfPage(){
    await showAllProductChoiced();
    await showTotal(); 

    changeQuantity();
}

initOfPage();

