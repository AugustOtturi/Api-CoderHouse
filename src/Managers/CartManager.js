import fs from "node:fs/promises"
import crypto from "node:crypto"


class CartManager {
    constructor(path) {
        this.path = path
    }


    //!Fn => Generar ID
    generateId() {
        return crypto.randomUUID();
    }

    //! Fn => Write Document
    async writeDocument(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
        return data
    }

    //!Fn => GetAllCarts
    async getAllCarts() {
        try {
            let fileCarts = await fs.readFile(this.path, "utf-8")
            let data = JSON.parse(fileCarts)
            if (!data) throw new Error("No se pudo obtener la información");
            return data

        } catch (error) {
            throw new Error(error.message);

        }

    }

    //!Fn => Generar nuevo carrito
    async generateCart(products) {
        try {
            let id = this.generateId()
            let data = await this.getAllCarts()
            let newCart = {
                id,
                products: products || []
            }
            data.push(newCart)
            await this.writeDocument(data)
            return newCart
        } catch (error) {
            throw new Error(error.message);


        }
    }
}

export default CartManager