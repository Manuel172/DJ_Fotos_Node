import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystemClass {

    constructor() { }

    guardarImagenTemporal( file: FileUpload, userId: string) {
        return new Promise( (resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // crear nombre archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            file.mv( `${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });        
    }

    private generarNombreUnico( nombreOriginal: string ) {
        const arrNombre = nombreOriginal.split('.');
        const extension = arrNombre[ arrNombre.length - 1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`
    }

    crearCarpetaUsuario(userId: string ) {
        const pathUser = path.resolve( __dirname, '../uploads/', userId  )
        const pathUserTemp = pathUser + '/temp';
        const pathUserPost = pathUser + '/posts';
        const existe = fs.existsSync( pathUser );

        if (!existe) {
            fs.mkdirSync(pathUser) ;
            fs.mkdirSync(pathUserTemp);
            fs.mkdirSync(pathUserPost);
        }
        return pathUserTemp;
    }

    imagenesTempHaciaPost(userId: string) {
        const pathTmp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const pathPost = path.resolve( __dirname, '../uploads/', userId, 'posts' );
        if (!fs.existsSync(pathTmp)) {
            console.log('No existe temp:', pathTmp);
            return [];
        }
        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTmp = this.obtenerImgTemp( userId );
        imagenesTmp.forEach( imagen => {
            fs.renameSync( `${pathTmp}/${imagen}`, `${pathPost}/${imagen}` );
        })

        return imagenesTmp;
    }

    private obtenerImgTemp( userId: string) {
        const pathTmp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const imagenes = fs.readdirSync(pathTmp) || [];
        return imagenes;
    }

    getFotoUrl(userId: string, imagen: string) {

        const pathFoto = path.resolve( __dirname, '../uploads/', userId, 'posts', imagen );
        const pathDefault = path.resolve( __dirname, '../assets/default.jpg' );
        //const pathFoto = `${pathdir}/${imagen}`;
        console.log(pathDefault);
        if (!fs.existsSync(pathFoto)) {
            return pathDefault;
        }
        return pathFoto;

    };

}


