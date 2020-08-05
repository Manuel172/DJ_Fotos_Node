"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_modelo_1 = require("../modelos/post.modelo");
const autentication_1 = require("../middlewares/autentication");
const file_system_1 = __importDefault(require("../clases/file-system"));
const postRoutes = express_1.Router();
const filesystemClass = new file_system_1.default();
// definicion de servicios  request - requerimiento, response - respuesta
// leer los Post
postRoutes.get('/leer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const pagina = Number(req.query.page) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posteos = yield post_modelo_1.PostM.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.header('Access-Control-Allow-Origin', '*');
    res.json({
        ok: true,
        mensaje: 'Get del post ok ',
        pagina,
        posteos
    });
}));
// Crear Post
postRoutes.post('/crear', [autentication_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = filesystemClass.imagenesTempHaciaPost(req.usuario._id);
    body.imagenes = imagenes;
    post_modelo_1.PostM.create(body).then((postDb) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDb.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            mensaje: 'Post Creado ',
            postDb
        });
    })).catch(err => {
        res.json({
            ok: false,
            mensaje: 'error al crear el post...',
            err
        });
    });
});
postRoutes.post('/upload', [autentication_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido archivo ',
        });
    }
    const archivo = req.files.imagen;
    if (!archivo) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido Archivo/Imagen ',
        });
    }
    if (!archivo.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido una Imagen ',
            archivo
        });
    }
    yield filesystemClass.guardarImagenTemporal(archivo, req.usuario._id);
    res.json({
        ok: true,
        mensaje: 'Imagen ok ',
        archivo
    });
}));
postRoutes.get('/imagen/:userid/:imagen', (req, res) => {
    const userId = req.params.userid;
    const imagen = req.params.imagen;
    const pathImg = filesystemClass.getFotoUrl(userId, imagen);
    res.sendFile(pathImg);
});
exports.default = postRoutes;
