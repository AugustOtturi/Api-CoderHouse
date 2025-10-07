import express from "express"
import ProductManager from './Managers/ProductManager.js'
const app = express()
const PORT = 8080
app.use(express.json())


let productManager = new ProductManager("./data/products.json")



//!Endpoint => get all products
app.get('/api/products/', async (req, res) => {
    try {
        let products = await productManager.getAllProducts()
        res.status(200).json({
            status: "Success",
            products,

        })
    } catch (error) {
        res.status(500).json({
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
        res.status(200).json({
            status: "Success",
            product,

        })
    } catch (error) {
        res.status(404).json({
            status: "Error",
            message: error.message
        })
    }
})

//! Endpoint => add new product
app.post('/api/products/', async (req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !status || !price || !stock || !category || !thumbnails) throw new Error("Faltan datos para realizar la carga de producto nuevo");

        let newProductAdded = await productManager.addProduct({
            title, description, code, price, status, stock, category, thumbnails
        })
        res.status(201).json({
            status: "Success",
            newProductAdded
        })
    } catch (error) {
        res.status(400).json({
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
        res.status(200).json({
            status: "Success",
            productToUpdate
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        })

    }

})

app.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`)
})
