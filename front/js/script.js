/* ----------------- Variables -----------------------*/
const itemsSection = document.getElementById('items');


let productsList = [];


/* ----------------- Functions -----------------------*/


// get the list of all products
function getProductsList (){
    fetch('http://localhost:3000/api/products')
        .then(function(res){
            if(res.ok){         
                return res.json(); // received Json and parse it to an Javascript Object
            }
        })
        .then(function(allProducts){
            console.log(typeof(allProducts)); // object so do we need to put it in a proper array ?
            allProducts.forEach(product => {
                console.log(product);
                createProductCard(product);
                //productsList.push(product);
                //getProductCharacteristic(product._id);
            });

            // PENSER A INCLURE UN CATCH
        });
}


// get the charactéristic of each products

/*function getProductCharacteristic(productID){
    fetch(`http://localhost:3000/api/products/${productID}`)
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(product){
            console.log(product);
        })
}*/

// create a card for each product on index page.
function createProductCard(product){
    const url = `./product.html?id=${product._id}`;
    const imgUrl = product.imageUrl;
    const altTxt = product.altTxt;
    const name = product.name;
    const description = product.description;
}

getProductsList();
