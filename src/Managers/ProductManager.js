import Product from '../models/product.model.js';

class ProductManager {

    //! Fn => Generate ID

    //!Fn => Get all products
    async getAllProducts() {
        try {
            const products = await Product.find({}).lean()
            return products
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
    //!Fn => Get product by id
    async getProductById(pid) {
        try {
            const product = await Product.findById(pid)
            return product
        } catch (error) {
            throw new Error(error.message);
        }

    }

    //! Fn => Add new product
    async addProduct(newProduct) {
        try {
            let { title, description, code, price, stock, category, status, thumbnails = "" } = newProduct;
            if (!title || !description || !code || price == null || stock == null || !category || !status) throw new Error('Faltan datos para poder crear el producto');
            let data = await this.getAllProducts();
            if (data.some(el => el.code === code)) throw new Error("Ya existe un producto con ese code");

            let product = {
                title,
                description,
                code,
                price,
                stock,
                category,
                status,
                thumbnails,
            }
            //TODOS Ajustar nombres de función
            const newProductToPush = new Product(product);
            await newProductToPush.save();
            return newProductToPush

        } catch (error) {
            throw new Error(error.message);
        }
    }



    //!Fn => Update product
    async updateProduct(pid, updates) {
        try {
            const product = await Product.findByIdAndUpdate(pid, { $set: updates }, { new: true, runValidators: true })
            return product
        } catch (error) {
            throw new Error(error.message);
        }

    }


    //!Fn => Delete product
    async deleteProduct(pid) {
        try {
            const data = await Product.findByIdAndDelete(pid)
            return data
        } catch (error) {
            throw new Error(error.message);

        }
    }

}

export default ProductManager