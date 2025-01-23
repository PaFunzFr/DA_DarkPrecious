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
let shippingFee = 3.49;

const containerIdCoffeFavourite = "favouriteProducts"
const dbIndexCoffe = 0;
const containerIdCoffe = "coffeeProducts";
const dbIndexMachines = 1;
const containerIdMachines = "machineProducts";
const dbIndexEquipment = 2;
const containerIdEquipment = "equipmentProducts";
const containerIdBasket = "basket";

function renderInit() {
    renderAllProductCards()
    renderBasket(containerIdBasket);
    renderTemplateTotal();
}

// RENDER PRODUCT CARDS
function renderAllProductCards() {
    for (i = 0; i < dbFromStorage.length; i++) {
        if (i === 0) {
            renderProductCardByCategory(i, containerIdCoffe);
        }
        if ( i === 1) {
            renderProductCardByCategory(i, containerIdMachines);
        }
        if ( i === 2) {
            renderProductCardByCategory(i, containerIdEquipment);
        }
    }
}

function renderProductCardByCategory(dbCategoryIndex, containerId) {
    getContainerById(containerId).innerHTML = "";
    for (let index = 0; index < dbFromStorage[dbCategoryIndex].products.length; index ++) {
        let dbProductData = dbFromStorage[dbCategoryIndex].products[index];
        renderSingleProductCard(dbCategoryIndex, containerId, dbProductData, index);
    }
}

function getContainerById(id) {
    return document.getElementById(id);
}

// BUTTON COFFEE AMOUNT
function chooseAmount(event, dbCategoryIndex, index) {
    let newPrice = dbFromStorage[dbCategoryIndex].products[index].price * event.target.value;
    const selectedCoffeAmount = event.target.innerText;
    resetAllButtons(dbCategoryIndex, index);
    highlightButton(event, dbCategoryIndex, index, newPrice);
    event.target.dataset.amount = selectedCoffeAmount;
};

function resetAllButtons(dbCategoryIndex, index) {
    document.getElementById(`priceTag${dbCategoryIndex}${index}`).innerText = dbFromStorage[0].products[index].price.toFixed(2) +" €";
    for (let i = 1; i < 4; i++) {
        const button = document.getElementById(`coffeAmount${index}${i}`);
        if (button) {
            button.dataset.clicked = "false";
            button.removeAttribute("data-amount");
            button.style.backgroundColor = "";
            button.style.color = "";
        }
    }
};

function highlightButton(event, dbCategoryIndex, index, newPrice) {
    event.target.dataset.clicked = "true";
    event.target.style.backgroundColor = "rgba(255, 140, 0, 1)";
    event.target.style.color = "black";
    document.getElementById(`priceTag${dbCategoryIndex}${index}`).innerText = convertNumber(newPrice) +" €";
}

// BASKET DATABASE
function updateBasket() {
    localStorage.setItem("basket", JSON.stringify(dbBasketFromStorage));
}

function createBasketObject(productName, productPrice, selectedCoffeAmount) {
    return {
        productName: productName,
        amount: 1,
        price: productPrice,
        comment: selectedCoffeAmount || ""
    }
}

// ADD TO & EDIT BASKET 
function pushItemToBasket(dbCategoryIndex, name, index) {
    let currentPrice = parseFloat(document.getElementById(`priceTag${dbCategoryIndex}${index}`).innerText);
    let selectedCoffeAmount = checkForCoffeButtons(index);
    if(!isAmountSelected(selectedCoffeAmount, dbCategoryIndex)) {
        return;
    };
    checkIfExistingInbasket(name, currentPrice, selectedCoffeAmount);
    renderBasketComplete();
}

function renderBasketComplete() {
    updateBasket();
    renderBasket(containerIdBasket);
    renderTemplateTotal();
}

function isAmountSelected(selectedCoffeAmount, dbCategoryIndex) {
    if (!selectedCoffeAmount && dbCategoryIndex === 0) {
        alert("Bitte wählen Sie eine Menge aus!");
        return false;
    }
    return true;
}

function checkForCoffeButtons(index) {
    for (let i = 1; i < 4; i++) {
        let button = document.getElementById(`coffeAmount${index}${i}`);
        if (button.dataset.amount) {
            return button.dataset.amount;
        }
    }
}

function checkIfExistingInbasket(name, currentPrice, selectedCoffeAmount) {
    let existingProduct = dbBasketFromStorage.find(item => item.productName === name && item.price === currentPrice);
    if (existingProduct) {
        existingProduct.amount ++;
    } else {
        dbBasketFromStorage.push(createBasketObject(name, currentPrice, selectedCoffeAmount));
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
        }
    }   
}

function showCommentInput(index) {
    document.getElementById(`commentContainer${index}`).style.display = "flex";
    let isNote = document.getElementById(`note${index}`).innerText;
    if ((isNote !== "")) {
        document.getElementById(`commentInput${index}`).value = isNote;
    }
}

function hideCommentInput(index) {
    document.getElementById(`commentContainer${index}`).style.display = "none";
}

function addComment(index) {
    let getInput = document.getElementById(`commentInput${index}`).value;
    if (getInput !== "") { 
        dbBasketFromStorage[index].comment = getInput;
    }
    updateBasket();
    renderBasket(containerIdBasket);
}

function sumBasket() {
    let sum = 0;
    for (let i = 0; i < dbBasketFromStorage.length; i++) {
        sum += dbBasketFromStorage[i].price * dbBasketFromStorage[i].amount
    }
    return sum;
}

function convertNumber(number) {
    return number.toFixed(2).toString().replace('.', ',');
}

// SEARCH PRODUCTS
function searchProducts() {
    const input = document.getElementById("searchField");
    const filter = input.value.toUpperCase();
    const productLists = document.querySelectorAll(".products-container");
    buildArrayOfProducts(productLists, filter, input);
}

function buildArrayOfProducts(productLists, filter, input) {
    for (let i = 0; i < productLists.length; i++) {
        const ul = productLists[i];
        const productList = Array.from(ul.getElementsByTagName("li"));
        getEveryProductCard(productList, filter, input);
    }
}

function getEveryProductCard(productList, filter, input) {
    for (let j = 0; j < productList.length; j++) {
        const singleProduct = productList[j];
        const productTitle = singleProduct.querySelector("h3");
        const description = singleProduct.querySelector(".product-description");
        const categories = singleProduct.querySelector(".product-categories");
        searchForMatches(filter, productTitle, description, categories, singleProduct);
    }
}

function searchForMatches(filter, productTitle, description, categories, singleProduct) {
    if (productTitle && description && categories) {
        const matchesFilter = productTitle.innerText.toUpperCase().includes(filter) || description.innerText.toUpperCase().includes(filter) || categories.innerText.toUpperCase().includes(filter);
        if (matchesFilter) {
            singleProduct.style.display = "";
        } else {
            singleProduct.style.display = "none";
        }
    }
}