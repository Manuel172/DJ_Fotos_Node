"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
console.log("inicio server!! escuchando.....");
const server = new server_1.default();
// siempre se va a ejecutar y va a procesar los post, put, get (middleware)
// parse application/x-www-form-urlencoded
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// parse application/json
server.app.use(body_parser_1.default.json());
// fileUpload paar subir las imagenes/archivos
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// configurar CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// rutas de la app (middleware)
server.app.use('/usuarios', usuario_1.default);
server.app.use('/posts', post_1.default);
// conectar base de datos. debe estar instalado el paquete mongoose
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos conectada');
});
// levantar instancia de servidor express
server.start(() => {
    console.log(` Servidor inicializado en puerto: ${server.port}`);
});
