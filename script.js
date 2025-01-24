//GLOBAL CONST
const sidebar = document.getElementById("sidebarMenu");
const hamLine1 = document.getElementById("ham1");
const hamLine2 = document.getElementById("ham2");
const hamLine3 = document.getElementById("ham3");
const stickyBottom = document.querySelector(".sticky-bottom");
const containerIdCoffeFavourite = "favouriteProducts"
const dbIndexCoffe = 0;
const containerIdCoffe = "coffeeProducts";
const dbIndexMachines = 1;
const containerIdMachines = "machineProducts";
const dbIndexEquipment = 2;
const containerIdEquipment = "equipmentProducts";
const containerIdBasket = "basket";
const messageShippingFee = "Mindestbestellwert liegt bei 25€";
const messageOrdered = "Bestellung gesendet";
const messageCoffeeAmount = "Bitte wählen Sie eine Menge aus";
const messageAboutShop = "Dark Precious ist super";

//get from db.js and set to Storage
let dbToStorage = localStorage.setItem("database", JSON.stringify(database));
//get from Storage and parse as array
let dbFromStorage = JSON.parse(localStorage.getItem("database"));
//initialize basket database
let dbBasketFromStorage = JSON.parse(localStorage.getItem("basket")) || [];
function buildDbBasket() {
    if (!localStorage.getItem("basket")) {
        localStorage.setItem("basket", JSON.stringify([]));
    }
}

//GLOBAL LET
let shippingFee = 3.49;
let finalCost = sumBasket() + shippingFee;
let isMenuOpen = false;
let resetTimer;

//GLOBAL EVENTS
window.onresize = showBasketOnWideScreen;
window.onscroll = avoidingFooter;

function renderInit() {
    buildDbBasket();
    renderBasketButton();
    renderAllProductCards()
    renderBasket(containerIdBasket);
    renderTemplateTotal();
    checkIfBasketEmpty();
}

//RENDER PRODUCT CARDS
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

function getContainerById(id) {
    return document.getElementById(id);
}

function renderProductCardByCategory(dbCategoryIndex, containerId) {
    getContainerById(containerId).innerHTML = "";
    for (let index = 0; index < dbFromStorage[dbCategoryIndex].products.length; index ++) {
        let dbProductData = dbFromStorage[dbCategoryIndex].products[index];
        renderSingleProductCard(dbCategoryIndex, containerId, dbProductData, index);
    }
}

//BUTTON COFFEE AMOUNT
function chooseAmount(event, dbCategoryIndex, index) {
    if (event.target.dataset.clicked === "true") {
        resetAllButtons(dbCategoryIndex, index);
        return;
    } else {
        selectedAmount(event, dbCategoryIndex, index);
    };
};

function selectedAmount(event, dbCategoryIndex, index) {
    let newPrice = dbFromStorage[dbCategoryIndex].products[index].price * event.target.value;
    const selectedCoffeAmount = event.target.innerText;
    resetAllButtons(dbCategoryIndex, index);
    highlightButton(event, dbCategoryIndex, index, newPrice);
    event.target.dataset.amount = selectedCoffeAmount;
}

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

//BASKET DATABASE
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

//ADD TO & EDIT BASKET 
function pushItemToBasket(dbCategoryIndex, name, index) {
    let currentPrice = parseFloat(document.getElementById(`priceTag${dbCategoryIndex}${index}`).innerText);
    let selectedCoffeAmount = checkForCoffeButtons(index);
    if(!isAmountSelected(selectedCoffeAmount, dbCategoryIndex)) {
        return;
    };
    popupBasket();
    checkIfExistingInbasket(name, currentPrice, selectedCoffeAmount);
    renderBasketComplete();
    renderBasketButton();
    resetAllButtons(0, index);
}

function isAmountSelected(selectedCoffeAmount, dbCategoryIndex) {
    if (!selectedCoffeAmount && dbCategoryIndex === 0) {
        showInfoDropDown(messageCoffeeAmount);
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

//BASKET
function renderBasketComplete() {
    checkIfBasketEmpty()
    updateBasket();
    renderBasket(containerIdBasket);
    renderTemplateTotal();
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
    if (dbBasketFromStorage.length !== 0) {
        for (let i = 0; i < dbBasketFromStorage.length; i++) {
            sum += dbBasketFromStorage[i].price * dbBasketFromStorage[i].amount;
        }
    }
    return sum;
}

function convertNumber(number) {
    return number.toFixed(2).replace('.', ',');
}

//BASKET COUNT BUTTONS
function increaseCount(index) {
    dbBasketFromStorage[index].amount ++;
    renderBasketComplete();
}

function decreaseCount(index) {
    if (dbBasketFromStorage[index].amount > 1) {
        dbBasketFromStorage[index].amount --;
    } else {
        dbBasketFromStorage.splice(index, 1);
    }
    renderBasketComplete();
    renderBasketButton();
}

//SEARCH PRODUCTS
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

//BASKET BUTTONS
function toggleButton(activeBtnId, inactiveBtnId) {
    const activeBtn = document.getElementById(activeBtnId);
    const inactiveBtn = document.getElementById(inactiveBtnId);
    activeBtn.style.backgroundColor = "white";
    activeBtn.style.color = "black";
    activeBtn.style.filter = "drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3))";
    inactiveBtn.style.backgroundColor = "rgba(213, 213, 213, 1)";
    inactiveBtn.style.color = "grey";
    inactiveBtn.style.filter = "none";
}

function delivery() {
    toggleButton("deliveryBtn", "pickupBtn");
    shippingFee = 3.49;
    renderTemplateTotal();
}

function pickup() {
    toggleButton("pickupBtn", "deliveryBtn");
    shippingFee = 0;
    renderTemplateTotal();
}

function closeBasket() {
    document.getElementById("basketContainer").style.display = "none";
}

function checkIfBasketEmpty() {
    if (dbBasketFromStorage.length !== 0) {
        document.getElementById('deliveryContainer').style.display = "flex";
        document.getElementById('basketTotal').style.display = "flex";
        document.getElementById('noProducts').style.display = "none";
    } else {
        document.getElementById('deliveryContainer').style.display = "";
        document.getElementById('basketTotal').style.display = "";
        document.getElementById('noProducts').style.display = "";
    }
}

//HIDE AND SHOW BASKET (on width)
function showBasketOnWideScreen() {
    if (window.innerWidth >= 900) {
        document.getElementById("basketContainer").style.display = "flex";
    }
    document.getElementById("basketContainer").style.display = "";
}

//STICKY BOTTOM BUTTON
function avoidingFooter() {
    const windowHeight = window.innerHeight; 
    const bodyHeight = document.body.offsetHeight; 
    const scrollY = window.scrollY;
    let distanceFromBottom = bodyHeight - (scrollY + windowHeight) - 20;
    isBottomReached(distanceFromBottom);
}

function isBottomReached(distanceFromBottom) {
    if (distanceFromBottom <= 100) {
        stickyBottom.style.bottom = `${125 - distanceFromBottom}px`;
    } else {
        stickyBottom.style.bottom = "30px";
    }
}

//POPUPS
function showBasket() {
    document.getElementById("basketContainer").style.display = "flex";
}

function popupBasket() {
    const popup = document.getElementById("popupBasket");
    if (popup) {
        popup.style.display = "flex";
        fadePopupIn(popup);
        fadePopupOut(popup);
    } 
}

function fadePopupIn(popup) {
    setTimeout(() => {
        popup.style.transition = "opacity 0.3s ease-in-out";
        popup.style.opacity = "1";
    }, 40);
}

function fadePopupOut(popup) {
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.style.display = "none";
        }, 300);
    }, 1000);
}

//SIDEBAR-MENU
function openMenu() {
    clearTimeout(resetTimer);
    if (!isMenuOpen) {
        transformBtnToX();
        openSidebar();
        isMenuOpen = true;
        autoCloseMenu();
    } else {
        transformBtnReset();
        closeSidebar();
        isMenuOpen = false;
    }
}

function transformBtnToX() {
    hamLine1.style.transform = "rotate(45deg) translate(11px, 5px)";
    hamLine2.style.opacity = "0";
    hamLine3.style.transform = "rotate(-45deg) translate(11px, -5px)";
}

function transformBtnReset() {
    hamLine1.style.transform = "rotate(0) translate(0, 0)";
    hamLine2.style.opacity = "1";
    hamLine3.style.transform = "rotate(0) translate(0, 0)";
};

function autoCloseMenu() {
    resetTimer = setTimeout(() => {
        transformBtnReset();
        closeSidebar();
        isMenuOpen = false;
    }, 3000);
}

function openSidebar() {
    sidebar.style.transform = "translateY(0)";
}

function closeSidebar() {
    sidebar.style.transform = "";
}

function aboutDarkPrecious() {
    showInfoDropDown(messageAboutShop);
}

//ORDER BUTTON
function order() {
    if (sumBasket() < 25) {
        showInfoDropDown(messageShippingFee);
    } else {
    showInfoDropDown(messageOrdered);
    thanksForShopping();
    dbBasketFromStorage = [];
    updateBasket();
    renderBasketComplete();
    renderBasketButton()
    }
}

function showInfo() {
    document.getElementById("infoShop").style.display = "block";   
}
function hideInfo() {
    document.getElementById("infoShop").style.display = "";  
}

function showInfoDropDown(message) {
    document.getElementById("infoDropdown").style.top = "0";
    document.getElementById("infoDropdown").innerHTML = `<p>${message}!</p>`;
    setTimeout(() => {
        document.getElementById("infoDropdown").style.top = "-100%";
        }, 2000);
}

function thanksForShopping() {
    document.getElementById("boughtProducts").style.display = "flex";
    setTimeout(() => {
        document.getElementById("boughtProducts").style.display = "";
        }, 7000);
}

function continueShopping() {
    document.getElementById("boughtProducts").style.display = "";
}