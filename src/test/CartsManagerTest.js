import CartManager from '../Managers/CartManager.js';

let cartManager = new CartManager("../data/carts.json");

console.log(cartManager.generateId())

console.log(cartManager.getAllCarts().then((res) => {
    console.log(res)
}))

console.log(cartManager.generateCart().then(res => console.log(res)))

console.log(cartManager.getCartsById("66d5faf2-155d-4cc2-ac09-d4a1a9841ea2").then(res => console.log(res)))