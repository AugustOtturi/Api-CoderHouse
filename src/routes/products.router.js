import { Router } from "express"
import ProductManager from '../Managers/ProductManager.js'
import uploader from '../utils/upload.js';


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
router.post('/', uploader.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(401).json({
            message: "Falta agregar la imagen al formulario"
        })
    }
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const code = req.body.code;
    const thumbnails = "/images/" + req.file.filename
    const category = req.body.category
    const status = req.body.status;
    const stock = req.body.stock

    try {
        if (!title || !description || !code || !category || price == null || stock == null) throw new Error("Faltan datos para realizar la carga del libro nuevo");
        let newProductAdded = await productManager.addProduct({
            title, description, code, price, status, stock, category, thumbnails
        })

        // EMITIR PRODUCTOS A WEBSOCKET POST CARGA
        const productos = await productManager.getAllProducts()
        if (req.io) {
            req.io.emit("listaActualizada", productos)
        }

        res.status(201).send({ status: "Success", newProductAdded })
    } catch (error) {
        res.status(400).send({ status: "Error", message: error.message })
    }
})
//!Endpoint => Update Product
router.put("/:pid", uploader.single("file"), async (req, res) => {
    try {
        let pid = req.params.pid;
        let updates = req.body
        if (req.file) {
            updates.thumbnails = "/images/" + req.file.filename;
        }
        let productToUpdate = await productManager.updateProduct(pid, updates)

        // EMITIR PRODUCTOS A WEBSOCKET POST ACTUALIZACIÓN
        const productos = await productManager.getAllProducts()
        if (req.io) {
            req.io.emit("listaActualizada", productos)
        }
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

        // EMITIR PRODUCTOS A WEBSOCKET POST ACTUALIZACIÓN
        if (req.io) {
            req.io.emit("listaActualizada", products)
        }
        res.status(200).send({ status: "producto Eliminado", products })
    } catch (error) {
        res.status(400).send({ status: "Error", message: error.message })
    }
})


export default router