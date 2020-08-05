"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date // automatico del dia
    },
    mensaje: {
        type: String // fotos junta curso
    },
    imagenes: [{
            type: String // junta200210011301.jpg
        }],
    coordenadas: {
        type: String // -13.76239393999, -10.0937733366
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UsuarioM',
        requerid: [true, 'Debe existir una referencia a un usuario']
    }
});
;
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.PostM = mongoose_1.model('PostM', postSchema);
