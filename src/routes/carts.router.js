import { Router } from "express"
import CartManager from '../Managers/CartManager.js'
import ProductManager from '../Managers/ProductManager.js'


const router = Router();
const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");



//! Endpoint => Generate New Cart
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.generateCart()
        res.status(201).send({ status: "Success", cart })
    } catch (error) {
        res.send({ status: "Error", message: error.message })

    }
})

//! Endpoint => Get Cart by Id
router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartManager.getCartById(cid);
        const { products } = cart;
        res.status(200).send({ status: "Success", products })
    } catch (error) {
        res.status(404).send({ status: "Error", message: error.message })
    }
})

//! Endpoint => Add to Cart
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carts = await cartManager.getAllCarts();
        const cartIndex = carts.findIndex(el => el.id === cid);
        if (cartIndex === -1) throw new Error("Carrito no encontrado");
        await productManager.getProductById(pid)
        const cart = carts[cartIndex]
        const hasProduct = cart.products.find(el => el.product === pid)
        if (hasProduct) {
            hasProduct.quantity += 1
        }
        else {
            cart.products.push({ product: pid, quantity: 1 })
        }
        await cartManager.writeDocument(carts)
        res.status(200).send({ status: "Success", cart })
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message })
    }
})


export default router