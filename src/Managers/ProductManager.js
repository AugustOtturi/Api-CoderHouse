import fs from 'node:fs/promises';
import crypto from 'node:crypto';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //! Fn => Generate ID
    generateId() {
        return crypto.randomUUID();
    }

    //!Fn => Write Document
    async writeDocument(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
        return data
    }

    //!Fn => Get all products
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
    //!Fn => Get product by id
    async getProductById(pid) {
        try {
            const data = await this.getAllProducts();
            let index = data.findIndex(el => el.id === pid)
            if (index === -1) throw new Error("El producto no fue encontrado")
            return data[index]
        } catch (error) {
            throw new Error(error.message);
        }

    }

    //! Fn => Add new product
    async addProduct(newProduct) {
        try {
            let { title, description, code, price, stock, category, status, thumbnails = [] } = newProduct;
            if (!title || !description || !code || !price || !stock || !category) throw new Error('Faltan datos para poder crear el producto');
            let data = await this.getAllProducts();
            if (data.some(el => el.code === code)) throw new Error("Ya existe un producto con ese code");

            let product = {
                id: this.generateId(),
                title,
                description,
                code,
                price,
                stock,
                category,
                status: true,
                thumbnails: []
            }

            data.push(product)
            await this.writeDocument(data);
            return product
        } catch (error) {
            throw new Error(error.message);
        }
    }



    //!Fn => Update product
    async updateProduct(pid, updates) {
        try {
            let data = await this.getAllProducts()
            let index = data.findIndex(el => el.id === pid)
            if (index === -1) throw new Error("El producto no fue encontrado");
            data[index] = { ...data[index], ...updates };
            await this.writeDocument(data)
            return data[index]
        } catch (error) {
            throw new Error(error.message);
        }

    }


    //!Fn => Delete product
    async deleteProduct(pid) {
        try {
            let data = await this.getAllProducts()
            let filterData = data.filter((el) => el.id !== pid)
            if (filterData.length === data.length) throw new Error("El producto no fue eliminado");
            await this.writeDocument(filterData)
            return filterData


        } catch (error) {
            throw new Error(error.message);

        }
    }

}

export default ProductManager