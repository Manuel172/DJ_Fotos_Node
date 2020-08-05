"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_modelo_1 = require("../modelos/usuario.modelo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autentication_1 = require("../middlewares/autentication");
const userRoutes = express_1.Router();
// servicios  request - requerimiento, response - respuesta
userRoutes.post('/login', (requerimiento, respuesta) => {
    const body = requerimiento.body;
    usuario_modelo_1.UsuarioM.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return respuesta.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
        if (userDB.compararClave(body.password)) {
            const userToken = token_1.default.getjwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            respuesta.json({
                ok: true,
                token: userToken
            });
        }
        else {
            return respuesta.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos...'
            });
        }
        ;
    });
});
userRoutes.post('/update', autentication_1.verificaToken, (req, respuesta) => {
    // toma de la solicitud post
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        avatar: req.body.avatar || req.usuario.avatar,
        email: req.body.email || req.usuario.email
    };
    console.log('Antes del findByIdAndUpdate : ', req.usuario);
    // req.usuario._id : lo devuelve el verificaToken como req.usuario
    // user: solo actualiza los datos que se estan enviando los demas los deja sin modificacion en la base de datos
    // {new: true}:  devuelve los nuevos datos que fueron actualizados, sino devuelve los datos antes de la actualizacion
    usuario_modelo_1.UsuarioM.findByIdAndUpdate(req.usuario._id, user, { new: false }, (err, userDB) => {
        console.log('en la funcion de update:', userDB);
        if (!userDB) {
            return respuesta.json({
                ok: false,
                data: userDB,
                mensaje: 'No existe usuario con ese ID.'
            });
        }
        const userToken = token_1.default.getjwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        respuesta.json({
            ok: true,
            token: userToken
        });
    });
});
userRoutes.post('/create', (requerimiento, respuesta) => {
    // toma de la solicitud post
    const user = {
        nombre: requerimiento.body.nombre,
        avatar: requerimiento.body.avatar,
        email: requerimiento.body.email,
        password: bcrypt_1.default.hashSync(requerimiento.body.password, 10)
    };
    // modelo -  ingreso de datos
    usuario_modelo_1.UsuarioM.create(user).then(userDB => {
        // devolver respuesta
        const userToken = token_1.default.getjwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        respuesta.json({
            ok: true,
            token: userToken
        });
    }).catch(err => {
        respuesta.json({
            ok: false,
            err
        });
    });
});
userRoutes.get('/usr', [autentication_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    console.log('usuario', usuario);
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
