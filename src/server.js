import express from "express"
import { engine } from "express-handlebars"
import http from "node:http"
import { Server } from "socket.io"
import methodOverride from "method-override";

import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import morgan from 'morgan';

// PUERTO
const PORT = 8080;

// SERVIDOR
const app = express();
const server = http.createServer(app)
const io = new Server(server)

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static("public"))
app.use("/images", express.static("src/images"));
app.use(morgan("combined"))

// HANDLEBARS CONFIGURACIÓN
app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// ACCESIBILIDAD io PARA MANEJO EN ROUTER
app.use((req, _res, next) => { req.io = io; next(); });


// WEBSOCKET LOG
io.on("connection", (socket) => { console.log("Usuario Conectado:" + socket.id) })


// ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)


// INICIAR SERVIDOR
server.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`)
})
