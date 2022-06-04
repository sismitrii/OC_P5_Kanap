// pour mettre les programmes commun à toute les pages 
// comme l'icon au dessus de panier

let productsTab = [];
let quantityInBag = 0;

function addIconBag() {
    countQuantityInBag();// faire le compte
    console.log(quantityInBag);
    // creer l'icon
}

function countQuantityInBag(){
    getTabOfProduct(); // recuperer le tableau
    count();//compter le total du tableau
}

function getTabOfProduct(){
    if (localStorage.kanapProduct !== undefined){
       productsTab = JSON.parse(localStorage.kanapProduct); 
    }
}

function count(){
    for (let product of productsTab){
        for (let element in product){
            if (element != "id"){
                quantityInBag += product[element];
            }
        }
    }
}

addIconBag();