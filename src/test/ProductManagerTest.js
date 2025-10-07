import ProductManager from '../Managers/ProductManager.js'

let productManager = new ProductManager("src/data/products.json")

productManager.getAllProducts().then((res) => {
    console.log(res)
}).catch((error) => {
    console.log(error)
})
/* productManager.getProductById("8c11e3b9-c03b-4a02-9f9e-e181e69a2c5f").then((res, err) => {
    console.log(res)
}) */

/* productManager.addProduct({
    title: "1984",
    description: "Novela distópica de George Orwell sobre un régimen totalitario que vigila y manipula la verdad. Winston Smith lucha por conservar su identidad.",
    code: "AA99",
    price: 299,
    status: true,
    stock: 20,
    category: "Distopía",
}).then((res) => {
    console.log(res)
}).catch((err) => console.log(err)) */


/* productManager.deleteProduct("6da90127-2a7b-4627-8416-48d2c9af2a20").then((res) => {
    console.log(res)
})
 */