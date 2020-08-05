
import { Router, Request, Response } from "express";
import { PostM } from '../modelos/post.modelo';
import { verificaToken } from '../middlewares/autentication';
import { FileUpload } from '../interfaces/file-upload';
import FileSystemClass from '../clases/file-system';

const postRoutes = Router();
const filesystemClass = new FileSystemClass();

// definicion de servicios  request - requerimiento, response - respuesta

// leer los Post
postRoutes.get('/leer',async(req: any, res: Response) => {
    console.log(req);

    const pagina = Number(req.query.page) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posteos = await PostM.find()
                                .sort( { _id: -1 })
                                .skip(skip)
                                .limit(10)
                                .populate('usuario', '-password')
                                .exec();
    res.header('Access-Control-Allow-Origin', '*')
    res.json({
        ok: true,
        mensaje: 'Get del post ok ',
        pagina,
        posteos
    });
});

// Crear Post
postRoutes.post('/crear', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id
    const imagenes = filesystemClass.imagenesTempHaciaPost(req.usuario._id);
    body.imagenes = imagenes;

    PostM.create( body ).then( async postDb  => {

        await postDb.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            mensaje: 'Post Creado ',
            postDb
        });
    }).catch( err => {
        res.json({
            ok: false,
            mensaje: 'error al crear el post...',
            err
        });
    })
});


postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido archivo ',
        });
    }

    const archivo: FileUpload = req.files.imagen;

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

    await filesystemClass.guardarImagenTemporal( archivo, req.usuario._id );

    res.json({
        ok: true,
        mensaje: 'Imagen ok ',
        archivo
    });

});


postRoutes.get('/imagen/:userid/:imagen', (req: any, res: Response) => {
    const userId = req.params.userid;
    const imagen = req.params.imagen;

    const pathImg = filesystemClass.getFotoUrl(userId, imagen);

    res.sendFile(pathImg);
});

export default postRoutes;
