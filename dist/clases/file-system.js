"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystemClass {
    constructor() { }
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // crear nombre archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const arrNombre = nombreOriginal.split('.');
        const extension = arrNombre[arrNombre.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        const pathUserPost = pathUser + '/posts';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
            fs_1.default.mkdirSync(pathUserPost);
        }
        return pathUserTemp;
    }
    imagenesTempHaciaPost(userId) {
        const pathTmp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts');
        if (!fs_1.default.existsSync(pathTmp)) {
            console.log('No existe temp:', pathTmp);
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTmp = this.obtenerImgTemp(userId);
        imagenesTmp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTmp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTmp;
    }
    obtenerImgTemp(userId) {
        const pathTmp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const imagenes = fs_1.default.readdirSync(pathTmp) || [];
        return imagenes;
    }
    getFotoUrl(userId, imagen) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts', imagen);
        const pathDefault = path_1.default.resolve(__dirname, '../assets/default.jpg');
        //const pathFoto = `${pathdir}/${imagen}`;
        console.log(pathDefault);
        if (!fs_1.default.existsSync(pathFoto)) {
            return pathDefault;
        }
        return pathFoto;
    }
    ;
}
exports.default = FileSystemClass;
