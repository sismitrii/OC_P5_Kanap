import { addIconBag } from "./script.js";

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

/* === Use the Id of the product to get all these characteristic === */
function getProductCharacteristic(){
    findProductIDOfPage();
    let productCharacteristic;
    fetch(`http://localhost:3000/api/products/${productID}`)
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(product){
            console.log(product);
            addProductCharacteristic(product);

            //productCharacteristic = product;
            //***
        }).catch(function(err){
            console.log(err);
            showError();
        });
    //return productCharacteristic;
}

/* === Add to the DOM the characteristic of the product === */
function addProductCharacteristic(productCharacteristic){  // How could I just execute this function when *** is done ?    ASYNC/AWAIT !! 
    const {imageUrl, altTxt, name, price, description, colors} = productCharacteristic;
    
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
        if (localStorage.kanapProduct === undefined){
            createBag(quantity, colorChoice);
        } else {
            let kanapProductTab = JSON.parse(localStorage.kanapProduct);
            let rankOfSameId = -1; 
            for (let product in kanapProductTab){
                if (kanapProductTab[product].id === productID){
                    rankOfSameId = product;   
                } 
            }
            if (rankOfSameId < 0){
                addNewProductInBag(quantity, colorChoice, kanapProductTab);
            } else {
                if (kanapProductTab[rankOfSameId][colorChoice] === undefined){
                     addNewColor(quantity, colorChoice, kanapProductTab, rankOfSameId);
                } else {
                    updateQuantity(quantity, colorChoice, kanapProductTab, rankOfSameId)
                }
            }
        }
        resetQuantity();
        addIconBag();
    }
}

/* === check if quantity and color have been choiced and if not inform customers === */
function checkValue(quantity, colorChoice){
    if((colorChoice === "") || (quantity < 1) || (quantity >100)){
      return false;   
    }
    //advise();
    return true;
 }

 /* ===  Save the tab with all product choiced in the Local Storage === */
 function saveInLocalStorage(tab){
    localStorage.kanapProduct = JSON.stringify(tab);
}

/* === If they are nothing else already choiced create the tab to save in the local Storage === */
function createBag(quantity, colorChoice){
    let tab = [{
        id : productID,
        [colorChoice] : quantity
    }]
    saveInLocalStorage (tab);
}

/* ===  Add a new product to tab in the local storage === */
function addNewProductInBag(quantity, colorChoice, tab){
    tab.push({
        id : productID,
        [colorChoice] : quantity
    });
    saveInLocalStorage(tab);
}

/* ===  add a new color if the same product but with another colors is already in the bag === */
function addNewColor(quantity, colorChoice, tab, rank){
    tab[rank][colorChoice] = quantity;
    saveInLocalStorage(tab);
}

/* === Update the quantity if that product have already been choiced === */
function updateQuantity(quantity, colorChoice, tab, rank){
    tab[rank][colorChoice] += quantity;
    saveInLocalStorage(tab);
}


/*function advise(){
    // put the background color with bad value in red
    // make and move from left to right
}*/

/* === reset the value of color and quantity after added to Bag === */
function resetQuantity(){
    quantityTag.value = 0;
    colorsSelectTag.children[0].setAttribute("selected", "");
}

/*====================================================*/
/* -------------------- Main -------------------------*/
/*====================================================*/
getProductCharacteristic();
addToBagButton.addEventListener('click',addToBag);
colorsSelectTag.addEventListener('change', ()=>{ colorsSelectTag.children[0].removeAttribute("selected")});