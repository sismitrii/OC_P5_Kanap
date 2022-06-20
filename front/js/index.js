/*====================================================*/
/* ----------------- Variables -----------------------*/
/*====================================================*/
const itemsSection = document.getElementById('items');

let productsList = [];

/* === Initialise the list of all products on homepage ===*/
async function initProductsList (){

        try {
            const res = await fetch('http://localhost:3000/api/products');
            if (res.ok){
                let allProducts = await res.json();
                 allProducts.forEach(product => {
                    createProductCard(product);
                });
            }
        } catch (error) {
            showError();
        }
}

/* === Create a card for each product on index page === */
function createProductCard(product){
    const url = `./product.html?id=${product._id}`;
    const { imageUrl, altTxt, name, description } = product; // Extract Value of product object ES6
    
    const aTag = document.createElement('a');
    aTag.setAttribute("href", url);

    aTag.innerHTML = `
        <article>
            <img src="${imageUrl}" alt="${altTxt}">
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
        </article>`;

    itemsSection.appendChild(aTag);
}

/* === Explain to the customers that there are an error in the loading of the products === */
function showError(){
    const title = document.querySelector('.titles h1');
    title.innerHTML = "Erreur dans le chargement de la page </br>Veuillez nous excusez !";
    const text = document.querySelector('titles h2');
    text.innerHTML = "Le problème est actuellement pris en charge par notre équipe, veuillez réessayer ultérieurement";
}

/*====================================================*/
/* -------------------- Main -------------------------*/
/*====================================================*/

initProductsList();
