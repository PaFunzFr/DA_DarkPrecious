
// GLOBAL VARIABLES
//get from db.js and set to Storage
let dbToStorage = localStorage.setItem("database", JSON.stringify(database));

// get from Storage and parse as array
let dbFromStorage = JSON.parse(localStorage.getItem("database"));

// initialize basket database
if (!localStorage.getItem("basket")) {
    localStorage.setItem("basket", JSON.stringify([]));
}
let dbBasketFromStorage = JSON.parse(localStorage.getItem("basket"));

// define categories of Storage
let dbCoffe = dbFromStorage[0];
let dbCoffeeMachines = dbFromStorage[1];

const containerIdCoffeFavourite = "favouriteProducts"
const dbIndexCoffe = 0;
const containerIdCoffe = "coffeeProducts";
const dbIndexMachines = 1;
const containerIdMachines = "machineProducts";
const dbIndexEquipment = 2;
const containerIdEquipment = "equipmentProducts";

const containerIdBasket = "basket";

// Wenn ich dem Warenkorb hinzufüge übergebe nur releavante Informationen in datenbank (Storage) Warenkorb => Name, Preis, Anzahl in Warenkorb, Anmerkung
// Wenn ich dem Warenkorb hinzufüge amountInStore -1, wenn amountInStore = 0 => produkt nicht mehr vorhanden


function renderInit() {
    renderProductCards(dbIndexCoffe, containerIdCoffe);
    renderProductCards(dbIndexMachines, containerIdMachines);
    renderProductCards(dbIndexEquipment, containerIdEquipment);

    renderBasket(containerIdBasket);
}


// RENDER PRODUCT CARDS
function renderProductCards(dbCategoryIndex, containerId) {
    getContainerById(containerId).innerHTML = "";
    for (let i = 0; i < dbFromStorage[dbCategoryIndex].products.length; i ++) {
        let dbProductData = dbFromStorage[dbCategoryIndex].products[i];
        renderSingleProductCard(containerId, dbProductData, i);
    }
}

function getContainerById(id) {
    return document.getElementById(id);
}

// BUTTON COFFEE AMOUNT
function chooseAmount(event, index) {
    let newPrice = dbFromStorage[0].products[index].price * event.target.value;
    if (event.target.dataset.clicked === "true") {
        resetAllButtons(index);
    } else {
    resetAllButtons(index);
    highlightButton(event, index, newPrice);

}

function resetAllButtons(index) {
    document.getElementById(`priceTag${index}`).innerText = dbFromStorage[0].products[index].price.toFixed(2) +" €";
    for (let i = 1; i < 4; i++) {
        const button = document.getElementById(`coffeAmount${index}${i}`);
        if (button) {
            button.dataset.clicked = "false";
            button.style.backgroundColor = "";
            button.style.color = "";
        }
    }
}};

function highlightButton(event, index, newPrice) {
    event.target.dataset.clicked = "true";
    event.target.style.backgroundColor = "rgba(255, 140, 0, 1)";
    event.target.style.color = "black";
    document.getElementById(`priceTag${index}`).innerText = newPrice.toFixed(2) +" €";
}

// BASKET DATABASE AND FUNCTIONS
function createBasketObject(productName, productPrice) {
    return {
        productName: productName,
        amount: 1,
        price: productPrice,
        comment: ""
    }
}

// ADD TO & EDIT BASKET 
function pushItemToBasket(name,index) {
    let currentPrice = parseFloat(document.getElementById(`priceTag${index}`).innerText);
    checkIfExistingInbasket(name, currentPrice);
    localStorage.setItem("basket", JSON.stringify(dbBasketFromStorage));
    renderBasket(containerIdBasket);
}

function checkIfExistingInbasket(name, currentPrice) {
    let existingProduct = dbBasketFromStorage.find(item => item.productName === name && item.price === currentPrice);
    if (existingProduct) {
        existingProduct.amount ++;
    } else {
        dbBasketFromStorage.push(createBasketObject(name, currentPrice));
    }
}

function renderBasket(containerId) {
    getContainerById(containerId).innerHTML = "";
    for (let i = 0; i < dbBasketFromStorage.length; i ++) {
        renderSingleBasketCard(containerId, i);
        checkForComments();
    }
}

function checkForComments() {
    for (let i = 0; i < dbBasketFromStorage.length; i++) {
        const noteElement = document.getElementById(`note${i}`);
        if (noteElement) {
            if (dbBasketFromStorage[i].comment === "") {
                noteElement.style.display = "none"; 
            } else {
                noteElement.style.display = "";
            }
    }}
}

function renderSingleBasketCard(containerId, index) {
    getContainerById(containerId).innerHTML += `
    <li class="basket-item" id="basketItem${index}">
                    <div class="item-price">
                        <h4>${dbBasketFromStorage[index].productName}</h4>
                        <p class="price-tag">${dbBasketFromStorage[index].price * dbBasketFromStorage[index].amount} €</p>
                    </div>
                    <div class="item-notes-quantity">
                        <button class="note-btn" onclick="showCommentInput(${index})">Anmerkung</button>
                        <div class="count-btn">
                            <h3 class="less-btn">-</h3>
                            <p class="current-count">${dbBasketFromStorage[index].amount}</p>
                            <h3 class="more-btn">+</h3>
                        </div>
                    </div>
                    <div class="placed-note"><p id="note${index}">${dbBasketFromStorage[index].comment}</p></div>
                    <div class="item-notes" id="commentContainer${index}">
                        <textarea class="item-note" id="commentInput${index}" maxlength="160"></textarea>
                        <div class="note-submit-container">
                            <button class="note-btn" onclick="hideCommentInput(${index})">Abbrechen</button>
                            <button class="note-btn" onclick="addComment(${index})">Hinzfügen</button>
                        </div>
                    </div>
                </li>
    `
}
/*
console.log(dbCoffe.products);
console.log(dbFromStorage.indexOf(dbCoffeeMachines));
*/

function showCommentInput(index) {
    document.getElementById(`commentContainer${index}`).style.display = "flex";
}

function hideCommentInput(index) {
    document.getElementById(`commentContainer${index}`).style.display = "none";
}

function addComment(index) {
    let getInput = document.getElementById(`commentInput${index}`).value;
    if (getInput !== "") { 
        dbBasketFromStorage[index].comment = getInput;
    }
    localStorage.setItem("basket", JSON.stringify(dbBasketFromStorage));
    renderBasket(containerIdBasket);
}