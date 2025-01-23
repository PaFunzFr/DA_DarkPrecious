function renderSingleProductCard(containerId, dbProductData, index) {
    if (containerId.includes("coffee")) {
        getContainerById(containerId).innerHTML += renderTemplateProductsCoffee(dbProductData, index);
    } else {
        getContainerById(containerId).innerHTML += renderTemplateProducts(dbProductData, index); 
    }
}

function renderTemplateProducts(dbProductData, index) {
    return `
    ${productCardTop(dbProductData, index)}
    ${productCardBottom(dbProductData, index)}
    `
}

function renderTemplateProductsCoffee(dbProductData, index) {
    return `
    ${productCardTop(dbProductData, index)}
    ${productCardMiddle(index)}
    ${productCardBottom(dbProductData, index)}
    `
}

function productCardBottom(dbProductData, index) {
    return `
            <p class="product-price"><b id="priceTag${index}">${dbProductData.price.toFixed(2)} €</b> noch
                <span class="in-storage" id="inStorage${index}">${dbProductData.amountInStore}</span> verfügbar</p>
            <p class="product-categories">${dbProductData.categories.join(" | ")}</p>
        </div>
    </li>`
}

function productCardTop(dbProductData, index) {
    return `
    <li class="product-card shadow">
        <img src=${dbProductData.picture} alt="" class="product-img">
        <div class="product-right">
            <div class="product-info">
                <h3>${dbProductData.name}</h3>
                <img class="general-icons" src="./assets/img/03_products/info.png">
                <div class="add-product" onclick="pushItemToBasket('${dbProductData.name}', ${index})">+</div>
            </div>
            <p class="product-description">${dbProductData.description}</p>`
}

function productCardMiddle(index) {
    return `
            <ul class="coffee-amount-container">
                <li class="coffee-amount" id="coffeAmount${index}1" onclick="chooseAmount(event, ${index})" value="1">250g</li>
                <li class="coffee-amount" id="coffeAmount${index}2" onclick="chooseAmount(event, ${index})" value="2">500g</li>
                <li class="coffee-amount" id="coffeAmount${index}3" onclick="chooseAmount(event, ${index})" value="4">1000g</li>
            </ul>`
}


