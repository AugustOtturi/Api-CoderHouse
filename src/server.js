import express from "express"
import ProductManager from './Managers/ProductManager.js'
import CartManager from './Managers/CartManager.js'
const app = express()
const PORT = 8080
app.use(express.json())


let productManager = new ProductManager("./data/products.json")
let cartManager = new CartManager("./data/carts.json")



//!Endpoint => get all products
app.get('/api/products/', async (req, res) => {
    try {
        let products = await productManager.getAllProducts()
        res.status(200).send({
            status: "Success",
            products,

        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })
    }
})
//!Endpoint => get product by ID
app.get('/api/products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid
        let product = await productManager.getProductById(pid)
        res.status(200).send({
            status: "Success",
            product,

        })
    } catch (error) {
        res.status(404).send({
            status: "Error",
            message: error.message
        })
    }
})

//! Endpoint => add new product
app.post('/api/products/', async (req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !category || price == null || stock == null) throw new Error("Faltan datos para realizar la carga de producto nuevo");

        let newProductAdded = await productManager.addProduct({
            title, description, code, price, status, stock, category, thumbnails
        })
        res.status(201).send({
            status: "Success",
            newProductAdded
        })
    } catch (error) {
        res.status(400).send({
            status: "Error",
            message: error.message
        })
    }
})
//!Endpoint => Update Product
app.put("/api/products/:pid", async (req, res) => {
    try {
        let pid = req.params.pid;
        let updates = req.body
        let productToUpdate = await productManager.updateProduct(pid, updates)
        res.status(200).send({
            status: "Success",
            productToUpdate
        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })

    }

})

//!Endopoint => Delete Product

app.delete("/api/products/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        let products = await productManager.deleteProduct(id);
        res.status(200).send({
            status: "Success",
            products

        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })

    }
})


//! Endpoint => Generate New Cart
app.post("/api/carts/", async (req, res) => {
    try {
        let cart = await cartManager.generateCart([])
        res.status(201).send({
            status: "Success",
            cart
        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })

    }
})
//! Endpoint => Get Cart By Id
app.get("/api/carts/:cid", async (req, res) => {
    try {
        let cid = req.params.cid
        let cart = await cartManager.getCartById(cid);
        let { products } = cart;
        res.status(200).send({
            status: "Success",
            products
        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })
    }


})

app.post("/api/carts/:cid/product/:pid", async (req, res) => {

    try {
        let { cid, pid } = req.params
        let carts = await cartManager.getAllCarts()
        let index = carts.findIndex(el => el.id === cid)
        if (index === -1) throw new Error("Carrito no encontrado");

        let cart = carts[index]
        let product = await productManager.getProductById(pid)
        let haveProduct = cart.products.find(el => el.product === pid)
        if (haveProduct) {
            haveProduct.quantity += 1
        }
        else {
            cart.products.push({ product: pid, quantity: 1 })
        }

        await cartManager.writeDocument(carts)
        res.status(200).send({
            status: "Success",
            cart,
            product
        })
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        })

    }


})

app.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`)
})
