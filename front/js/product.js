/*====================================================*/
/* ----------------- Variable -----------------------*/
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
    return productID;
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
        });
    //return productCharacteristic;
}

/* === Add to the DOM the characteristic of the product === */
function addProductCharacteristic(productCharacteristic){  // How could I just execute this function when *** is done ?     
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

getProductCharacteristic();
addToBagButton.addEventListener('click',addToBag);



/* === add to localStorage the product === */
function addToBag(){
    let quantity = quantityTag.value; 
    let colorChoice = colorsSelectTag.value;
    if (checkValue(quantity, colorChoice)){
        if (localStorage[productID]!= undefined){
            console.log("already exist");
            //modifyQuantityInBag(quantity, colorChoice);
        } else {
            addNewProductInbag(quantity, colorChoice);  
            // value of quantityTag and color put to origin
            // add a symbol or something after "Panier" to signal it have been added
        }
    }
}

/*function modifyQuantityInBag(){
}*/

/* === Add the product choiced on the localStorage === 
    Format used : productID : {"colorChoice":"quantity"}
*/
function addNewProductInbag(quantity, colorChoice){  // why if i don't put it as an argument i have a console.log(quantity) => <input...
    const productObj = {
        [colorChoice] : quantity  // use the format color : quantity in case customer add 2 different color of the same product
    }
    localStorage[productID] = JSON.stringify(productObj); // use of JSON mandatory for object in localStorage
    console.log("done");
}

/* === check if quantity and color have been choiced and if not inform customers === */
function checkValue(quantity, colorChoice){
   if((colorChoice !== "") && (quantity >= 1)){
     return true;   
   } else {
    //advise();
    return false;
   }
}

/*function advise(){
    // put the background color with bad value in red
    // make and move from left to right
}*/