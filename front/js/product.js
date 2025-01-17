/*====================================================*/
/* -------------------- Import -----------------------*/
/*====================================================*/

import { addIconBag } from "./script.js";
import {saveInLocalStorage, advise, removeAdvise, getProductCharacteristic} from "./function.js";

/*====================================================*/
/* ----------------- Variables -----------------------*/
/*====================================================*/

const addToBagButton = document.getElementById('addToCart');
const colorsSelectTag = document.getElementById('colors');
const quantityTag = document.getElementById('quantity');

let productID;

/*====================================================*/
/* ----------------- Functions -----------------------*/
/*====================================================*/

/* === Search in the url of the page the ID of the product and return it === */
function findProductIDOfPage(){
    let pageUrl = new URL(window.location.href);
    productID = pageUrl.searchParams.get('id');
    return;
}

/* === Add to the DOM the characteristic of the product === */
function addProductCharacteristic(productCharacteristic){  // How could I just execute this function when *** is done ?    ASYNC/AWAIT !! 
    const {imageUrl, altTxt, name, price, description, colors} = productCharacteristic;
    
    const title = document.querySelector('title');
    title.innerText = `${name} || Kanap`;

    //image
    const imageTag = document.createElement('img');
    imageTag.setAttribute("src",imageUrl);
    imageTag.setAttribute("alt", altTxt);
    const imageContainer = document.querySelector('.item__img');
    imageContainer.appendChild(imageTag);

    //textual information
    document.getElementById('title').innerText = name;
    document.getElementById('price').innerText = price;
    document.getElementById('description').innerText = description;

    // colors
    for (let color of colors){
        const colorTag = document.createElement('option');
        colorTag.setAttribute("value", color);
        colorTag.innerText = color;
        colorsSelectTag.appendChild(colorTag);
    }
}

/* === Explain to the customers that there are an error in the loading of products === */
function showError(){
    const article = document.querySelector('.item article');
    article.style = "display : none";
    let errorMessage = document.createElement('h1');
    errorMessage.innerHTML = "Erreur dans le chargement de la page </br>Veuillez nous excusez !";
    const item = (document.querySelector('.item'));
    item.appendChild(errorMessage);
}

/* === add to localStorage the product === */
/* Check different conditions to call the wright function */
function addToBag(){
    let quantity = parseInt(quantityTag.value);  // quantityTag.value is a string
    let colorChoice = colorsSelectTag.value;
    if (checkValue(quantity, colorChoice)){
        // check if kanapProduct already exist in the localStorage
        if (localStorage.kanapProduct === undefined){ 
            createBag(quantity, colorChoice);
        } else {
            let kanapProductTab = JSON.parse(localStorage.kanapProduct);
            let rankOfSameId = -1; 
            for (let product in kanapProductTab){
                //check if there are already an object of this product in kanapProduct
                if (kanapProductTab[product].id === productID){
                    rankOfSameId = product;   
                } 
            }
            if (rankOfSameId < 0){
                addNewProductInBag(quantity, colorChoice, kanapProductTab);
            } else {
                // check if in the object of the same product the colorChoiced already exist or not
                if (kanapProductTab[rankOfSameId][colorChoice] === undefined){
                     addNewColor(quantity, colorChoice, kanapProductTab, rankOfSameId);
                } else {
                    updateQuantity(quantity, colorChoice, kanapProductTab, rankOfSameId)
                }
            }
        }
    }
}

/* === check if quantity and color have been choiced and if not inform customers === */
function checkValue(quantity, colorChoice){
    removeAdvise("valueErrorMsg");
    removeAdvise("colorErrorMsg");
    if((colorChoice === "") || (quantity < 1) || (quantity >100)) {
        if (colorChoice === ""){
            advise("color");
        }
        if((quantity < 1) || (quantity >100)){
            advise("value");
        }
        return false; 
    } 
    return true;
 }

/* === If they are nothing else already choiced create the tab to save in the local Storage === */
function createBag(quantity, colorChoice){
    let tab = [];
    addNewProductInBag(quantity, colorChoice, tab);
    
}

/* ===  Add a new product to tab in the local storage === */
function addNewProductInBag(quantity, colorChoice, tab){
    tab.push({
        id : productID,
        [colorChoice] : quantity
    });
    newProductAddedToBag(tab);
}

/* ===  add a new color if the same product but with another colors is already in the bag === */
function addNewColor(quantity, colorChoice, tab, rank){
    tab[rank][colorChoice] = quantity;
    newProductAddedToBag(tab);
}

/* === Update the quantity if that product have already been choiced === */
function updateQuantity(quantity, colorChoice, tab, rank){
    if (tab[rank][colorChoice] + quantity <= 100){
        tab[rank][colorChoice] += quantity;
    } else {
        tab[rank][colorChoice] = 100;
    }
    newProductAddedToBag(tab);
}


/* === reset the value of color and quantity after added to Bag === */
function resetQuantity(){
    quantityTag.value = 0;
    colorsSelectTag.children[0].setAttribute("selected", "");
}

/* === Scroll the page to the top of page to icon of bag === */
function scrollToBag(){
    const bagIconTag = document.getElementById('bag__icon');
    bagIconTag.scrollIntoView();
}

/* === Add the product to localStorage and show to user it have been done === */
function newProductAddedToBag(tab){
    saveInLocalStorage(tab);
    resetQuantity();
    addIconBag();
    scrollToBag();
}

/*====================================================*/
/* -------------------- Main -------------------------*/
/*====================================================*/
async function initOfPage(){
    findProductIDOfPage();
    let productCharacteristic = await getProductCharacteristic(productID);
    if (productCharacteristic === "error"){
        showError();
    } else {
        addProductCharacteristic(productCharacteristic);
    }
    addToBagButton.addEventListener('click',addToBag);
    colorsSelectTag.addEventListener('change', ()=>{ colorsSelectTag.children[0].removeAttribute("selected")});
}

initOfPage();
