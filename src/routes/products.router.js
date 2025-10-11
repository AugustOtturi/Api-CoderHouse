import { Router } from "express"
import ProductManager from '../Managers/ProductManager.js'



const router = Router();
const productManager = new ProductManager("./src/data/products.json");

//!Endpoint => Get all products
router.get('/', async (req, res) => {
    try {
        let products = await productManager.getAllProducts()
        res.status(200).send({ status: "Success", products })
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message })
    }
})
//!Endpoint => Get product by ID
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid
        let product = await productManager.getProductById(pid)
        res.status(200).send({ status: "Success", product })
    } catch (error) {
        res.status(404).send({ status: "Error", message: error.message })
    }
})
//! Endpoint => Add new product
router.post('/', async (req, res) => {
    try {
        let { title, description, code, price, status, stock, category, thumbnails } = req.body
        if (!title || !description || !code || !category || price == null || stock == null) throw new Error("Faltan datos para realizar la carga de producto nuevo");
        let newProductAdded = await productManager.addProduct({
            title, description, code, price, status, stock, category, thumbnails
        })
        res.status(201).send({ status: "Success", newProductAdded })
    } catch (error) {
        res.status(400).send({ status: "Error", message: error.message })
    }
})
//!Endpoint => Update Product
router.put("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid;
        let updates = req.body
        let productToUpdate = await productManager.updateProduct(pid, updates)
        res.status(200).send({ status: "Success", productToUpdate })
    } catch (error) {
        res.status(400).send({ status: "Error", message: error.message })
    }
})
//!Endopoint => Delete Product
router.delete("/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        let products = await productManager.deleteProduct(id);
        res.status(200).send({ status: "Success", products })
    } catch (error) {
        res.status(400).send({ status: "Error", message: error.message })
    }
})


export default router