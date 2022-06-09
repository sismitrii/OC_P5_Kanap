import { quantityInBag} from "./script.js";



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
    console.log(totalPrice);
    return totalPrice;

}

function initOfPage(){
    showAllProductChoiced();
    showTotal(); 
}

initOfPage();
