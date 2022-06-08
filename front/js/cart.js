
function showAllProducthoiced(){
    let allProductTab = getAllproduct();
    console.log(allProductTab);
    allProductTab.forEach(showProduct);
}


function getAllproduct(){
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
    //console.log(id + " : " + color + " : " + qty);
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.dataset.id = id;
    article.dataset.color = color;
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

showAllProducthoiced();