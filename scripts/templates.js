function renderSingleProductCard(dbCategoryIndex, containerId, dbProductData, index) {
    if (containerId.includes("coffee")) {
        getContainerById(containerId).innerHTML += renderTemplateProductsCoffee(dbCategoryIndex, dbProductData, index);
    } else {
        getContainerById(containerId).innerHTML += renderTemplateProducts(dbCategoryIndex, dbProductData, index); 
    }
}

function renderTemplateProducts(dbCategoryIndex, dbProductData, index) {
    return `
    ${productCardTop(dbCategoryIndex, dbProductData, index)}
    ${productCardBottom(dbCategoryIndex, dbProductData, index)}
    `
}

function renderTemplateProductsCoffee(dbCategoryIndex, dbProductData, index) {
    return `
    ${productCardTop(dbCategoryIndex, dbProductData, index)}
    ${productCardMiddle(dbCategoryIndex, index)}
    ${productCardBottom(dbCategoryIndex, dbProductData, index)}
    `
}

function productCardBottom(dbCategoryIndex, dbProductData, index) {
    return `
            <p class="product-price"><b id="priceTag${dbCategoryIndex}${index}">${convertNumber(dbProductData.price)} €</b>
            <p class="product-categories">${dbProductData.categories.join(" | ")}</p>
        </div>
    </li>`
}

function productCardTop(dbCategoryIndex, dbProductData, index) {
    return `
    <li class="product-card shadow">
        <img src=${dbProductData.picture} alt="" class="product-img">
        <div class="product-right">
            <div class="product-info">
                <h3>${dbProductData.name}</h3>
                <img class="general-icons" src="./assets/img/03_products/info.png">
                <div class="add-product" onclick="pushItemToBasket(${dbCategoryIndex}, '${dbProductData.name}', ${index})">+</div>
            </div>
            <p class="product-description">${dbProductData.description}</p>`
}

function productCardMiddle(dbCategoryIndex, index) {
    return `
            <ul class="coffee-amount-container">
                <li class="coffee-amount" id="coffeAmount${index}1" onclick="chooseAmount(event, ${dbCategoryIndex}, ${index})" value="1">250g</li>
                <li class="coffee-amount" id="coffeAmount${index}2" onclick="chooseAmount(event, ${dbCategoryIndex}, ${index})" value="2">500g</li>
                <li class="coffee-amount" id="coffeAmount${index}3" onclick="chooseAmount(event, ${dbCategoryIndex}, ${index})" value="4">1000g</li>
            </ul>`
}

function renderSingleBasketCard(containerId, index) {
    let basketPrice = dbBasketFromStorage[index].price * dbBasketFromStorage[index].amount;
    let basketPriceFormatted = basketPrice.toFixed(2);
    getContainerById(containerId).innerHTML += `
    <li class="basket-item" id="basketItem${index}">
        <div class="item-price">
            <h4>${dbBasketFromStorage[index].productName}</h4>
            <p class="price-tag">${basketPriceFormatted.toString().replace('.', ',')} €</p>
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

function renderTemplateTotal() {
    let finalCost = sumBasket() + shippingFee;
    document.getElementById('basketTotal').innerHTML = `
            <p class="current-price">Zwischensumme: <span>${convertNumber(sumBasket())} €</span></p>
            <p class="shipping-fee">Lieferkosten: <span>${convertNumber(shippingFee)} €</span></p>
            <p class="total-price">Gesamt: <span>${convertNumber(finalCost)} €</span></p>
            <h2>Bezahlen ${convertNumber(finalCost)} €</h2>
    `;
}