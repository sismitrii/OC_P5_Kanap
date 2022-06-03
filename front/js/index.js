/*====================================================*/
/* ----------------- Variables -----------------------*/
/*====================================================*/
const itemsSection = document.getElementById('items');

let productsList = [];

/*====================================================*/
/* ----------------- Functions -----------------------*/
/*====================================================*/



/* === get the list of all products ===*/
function getProductsList (){
    fetch('http://localhost:3000/api/products')
        .then(function(res){
            if(res.ok){         
                return res.json(); // received Json and parse it to an Javascript Object
            }
        })
        .then(function(allProducts){
            console.log(typeof(allProducts));
            allProducts.forEach(product => {
                console.log(product);
                createProductCard(product);
            });

            // PENSER A INCLURE UN CATCH
        });
}


/* === get the charactéristic of each products === */

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

/* === create a card for each product on index page ===*/
function createProductCard(product){
    const url = `./product.html?id=${product._id}`;
    const { imageUrl, altTxt, name, description } = product; // Extract Value of product object
    
    const imageTag = document.createElement('img');
    imageTag.setAttribute("src", imageUrl);
    imageTag.setAttribute("alt", altTxt);

    const nameTag = document.createElement('h3');
    nameTag.classList.add('productName');
    nameTag.innerText = name;

    const descriptionTag = document.createElement('p');
    descriptionTag.classList.add('productDescription');
    descriptionTag.innerText= description;

    const articleTag = document.createElement('article');
    articleTag.appendChild(imageTag);
    articleTag.appendChild(nameTag);
    articleTag.appendChild(descriptionTag);

    const aTag = document.createElement('a');
    aTag.setAttribute("href", url);
    aTag.appendChild(articleTag);

    itemsSection.appendChild(aTag);
}


/*====================================================*/
/* -------------------- Main -------------------------*/
/*====================================================*/

getProductsList();
