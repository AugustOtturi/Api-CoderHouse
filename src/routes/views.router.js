import { Router } from 'express';
import ProductManager from '../Managers/ProductManager.js'

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// VISTA REALTIMEPRODUCTS
router.get('/realtimeproducts', async (req, res) => {
    try {
        let products = await productManager.getAllProducts()
        res.status(200).render("realtimeproducts", { products })
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message })
    }
})

// VISTA HOME EN "/"
router.get('/', async (req, res) => {
    try {
        let products = await productManager.getAllProducts()
        res.status(200).render("home", { products })
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message })
    }
})



export default router