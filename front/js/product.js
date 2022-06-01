/* ----------------- Functions -----------------------*/

// Search in the url of the page the ID of the product and return it
function findProductIDOfPage(){
    let pageUrl = new URL(window.location.href);
    let productID = pageUrl.searchParams.get('id');
    return productID;
}

// Use the Id of the product to get all these characteristic
function getProductCharacteristic(){
    let productID = findProductIDOfPage();
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

function addProductCharacteristic(productCharacteristic){  // How could I just execute this function when *** is done ? 
    //let productCharacteristic = getProductCharacteristic();
    
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
    const colorsSelectTag = document.getElementById('colors');

    for (let color of colors){
        const colorTag = document.createElement('option');
        colorTag.setAttribute("value", color);
        colorTag.innerText = color;
        colorsSelectTag.appendChild(colorTag);
    }
}

getProductCharacteristic();

function test() {

    console.log(localStorage["prenom"]);


}
test();
