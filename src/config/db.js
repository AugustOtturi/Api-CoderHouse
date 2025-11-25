import mongoose from 'mongoose'


const connectMongoDb = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB)
        console.log("Conectado correctamente a MONGODB por Mongoose")


    } catch (error) {
        console.log({
            status: "Error",
            message: error.message
        })

    }
}

export default connectMongoDb