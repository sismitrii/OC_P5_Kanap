/* === Advise user adding to DOM an error message that explain what happen wrong === */
export function advise(errorType, inputParentTag = document.querySelector('.item__content__settings__quantity')){
    const adviseTag = document.createElement('p');
    if (errorType === "color"){
        adviseTag.innerText = "Veuillez selectionner une couleur";
        adviseTag.classList.add('colorErrorMsg');
    } else if (errorType === "value"){
        adviseTag.innerText = "Veuillez entrez une valeur comprise entre 1 et 100";
        adviseTag.classList.add('valueErrorMsg');
    }
    adviseTag.style = "color : #fbbcbc; font-size : 12px; margin-left:10px;";
    inputParentTag.appendChild(adviseTag);
}

/* === Remove th message that explain what happen wrong === */
export function removeAdvise(className){
    const toRemove = document.querySelector(`.${className}`)
    if (toRemove !== null){
        toRemove.remove();
    }
}

 /* ===  Save the tab with all product choiced in the Local Storage === */
export function saveInLocalStorage(tab){
    localStorage.kanapProduct = JSON.stringify(tab);
}

/* === Use the Id of the product to get all these characteristic === */
export async function getProductCharacteristic(productID){

        try {
            const res = await fetch(`http://localhost:3000/api/products/${productID}`);
            if (res.ok){
                return res.json();
            }
        } catch (error) {
            console.error(error);
            return "error" ;
        }
}