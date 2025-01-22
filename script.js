//get from db.js and set to localstorage
let dbToLocalStorage = localStorage.setItem("database", JSON.stringify(database));

// get from localstorage and parse as array
let dbFromLocalStorage = JSON.parse(localStorage.getItem("database"));

// define categories of localstorage
let dbCoffe = dbFromLocalStorage[0];
let dbCoffeeMachines = dbFromLocalStorage[1];

console.log(dbCoffe.products);
console.log(dbFromLocalStorage.indexOf("kaffeemaschinen", ));


function renderInit() {

}

function renderProductCards(index, category) {
    getContainerById("favouriteProducts").innerHTML = ""
    log.info(dbLocalStorage.getItem("products"));

    
}

function getContainerById(id) {
    return document.getElementById(id);
}