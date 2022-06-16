/* === Advise user adding to DOM an error message that explain what happen wrong === */
export function advise(errorType, quantityPartTag = document.querySelector('.item__content__settings__quantity')){
    const adviseTag = document.createElement('p');
    if (errorType === "color"){
        adviseTag.innerText = "Veuillez selectionner une couleur";
        adviseTag.classList.add('colorErrorMsg');
    } else if (errorType === "value"){
        adviseTag.innerText = "Veuillez entrez une valeur comprise entre 1 et 100";
        adviseTag.classList.add('valueErrorMsg');
    }
    adviseTag.style = "color : #fbbcbc; font-size : 12px; margin-left:10px;";
    quantityPartTag.appendChild(adviseTag);
}

/* === Remove th message that explain what happen wrong === */
export function removeAdvise(className){
    const adviseTag = document.querySelector(`.${className}`);
    if (adviseTag !== null){
        adviseTag.remove();
    }
}

 /* ===  Save the tab with all product choiced in the Local Storage === */
export function saveInLocalStorage(tab){
    localStorage.kanapProduct = JSON.stringify(tab);
}

/* === Use the Id of the product to get all these characteristic === */
export async function getProductCharacteristic(productID){
    /*fetch(`http://localhost:3000/api/products/${productID}`)
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
        });*/

        try {
            const res = await fetch(`http://localhost:3000/api/products/${productID}`);
            if (res.ok){
                let productCharacteristic = await res.json();
                addProductCharacteristic(productCharacteristic);
            }
        } catch (error) {
            console.error(error);
            showError();
        }
}