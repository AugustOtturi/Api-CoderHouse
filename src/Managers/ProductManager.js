import fs from 'node:fs/promises';
import crypto from 'node:crypto';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //! Fn => Generar ID
    generateId() {
        return crypto.randomUUID();
    }

    //!Fn => GetAllProducts
    async getAllProducts() {
        try {
            let fileData = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(fileData)
            if (!data) throw new Error("Error al intentar obtener la data");
            return data
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
    //!Fn => GetProductById
    async getProductById(pid) {
        try {
            const data = await this.getAllProducts();
            let productFound = data.findIndex((element) => { return element.id === pid })
            if (productFound === -1) throw new Error("El producto no fue encontrado")
            return data[productFound]
        } catch (error) {
            throw new Error(`${error.message}`);
        }

    }



    //! Fn => AddProduct
    async addProduct(newProduct) {
        //todo VALIDAR QUE EL LIBRO NO EXISTA ANTES DE PUSHEAR
        try {
            let { title, description, code, price, status, stock, category } = newProduct;
            if (!title || !description || !code || !price || !stock || !category) throw new Error('Faltan datos para poder crear el producto');
            let data = await this.getAllProducts();
            let newId = this.generateId()
            let product = { id: newId, ...newProduct, status: true, thumbnails: [] }
            if (data.findIndex((el) => el.id === newId)) throw new Error("El producto con ese ID ya éxiste, vuelve a intentarlo");
            data.push(product)
            await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
            return data
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //!Fn => UpdateProduct
    upadteProduct(pid, updates) { }


    //!Fn => DeleteProduct
    deleteProduct(pid) { }

}

let productManager = new ProductManager("../data/products.json")

/* productManager.getAllProducts().then((res, err) => {
    console.log(res)
}) */
/* productManager.getProductById("8c11e3b9-c03b-4a02-9f9e-e181e69a2c5f").then((res, err) => {
    console.log(res)
}) */

/* productManager.addProduct({
    title: "1984",
    description: "Novela distópica de George Orwell sobre un régimen totalitario que vigila y manipula la verdad. Winston Smith lucha por conservar su identidad.",
    code: "AA02",
    price: 299,
    status: true,
    stock: 20,
    category: "Distopía",
}).then((res) => {
    console.log(res)
}).catch((err) => console.log(err)) */

