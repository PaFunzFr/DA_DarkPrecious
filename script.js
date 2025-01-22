//get from db.js and set to Storage
let dbToStorage = localStorage.setItem("database", JSON.stringify(database));

// get from Storage and parse as array
let dbFromStorage = JSON.parse(localStorage.getItem("database"));

// initialize basket database
let dbBasketToStorage = localStorage.setItem("basket", JSON.stringify([]));
let dbBasketFromStorage = JSON.parse(localStorage.getItem("basket"));

function pushItemToBasket() {
    dbBasketFromStorage.push(createBasketObject("TestMeister", "TestPreis"));
    localStorage.setItem("basket", JSON.stringify(dbBasketFromStorage));
}

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

// Wenn ich dem Warenkorb hinzufüge übergebe nur releavante Informationen in datenbank (Storage) Warenkorb => Name, Preis, Anzahl in Warenkorb, Anmerkung
// Wenn ich dem Warenkorb hinzufüge amountInStore -1, wenn amountInStore = 0 => produkt nicht mehr vorhanden

// GENERAL VARIABLES
let amountSelected = false;

console.log(dbCoffe.products);
console.log(dbFromStorage.indexOf(dbCoffeeMachines));


function renderInit() {
    renderProductCards(dbIndexCoffe, containerIdCoffe);
    renderProductCards(dbIndexMachines, containerIdMachines);
    renderProductCards(dbIndexEquipment, containerIdEquipment);
    pushItemToBasket();
}

function renderProductCards(dbCategoryIndex, containerId) {
    getContainerById(containerId).innerHTML = "";
    for (let i = 0; i < dbFromStorage[dbCategoryIndex].products.length; i ++) {
        let dbProductData = dbFromStorage[dbCategoryIndex].products[i];
        renderSingleProductCard(containerId, dbProductData, i);
    }
}

// console.log(dbProductData);
function getContainerById(id) {
    return document.getElementById(id);
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

// ELSE / FUTURE FUNCTIONS