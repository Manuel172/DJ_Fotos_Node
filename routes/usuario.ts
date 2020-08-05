import { Router, Request, Response } from "express";
import { UsuarioM } from '../modelos/usuario.modelo';
import bcrypt from 'bcrypt'; 
import Token from '../clases/token';
import { verificaToken } from '../middlewares/autentication';

const userRoutes = Router();

// servicios  request - requerimiento, response - respuesta
userRoutes.post('/login', (requerimiento: Request, respuesta: Response) => {

    const body = requerimiento.body;

    UsuarioM.findOne({ email: body.email }, ( err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return respuesta.json( {
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            })
        }

        if (userDB.compararClave( body.password)) {
            const userToken = Token.getjwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            respuesta.json({
                ok: true,
                token: userToken
            });
        } else {
            return respuesta.json( {
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos...'
            })
        };

    })


});


userRoutes.post('/update', verificaToken, (req: any, respuesta: Response) => {

    // toma de la solicitud post
    const user = {
        nombre: req.body.nombre || req.usuario.nombre ,
        avatar   : req.body.avatar || req.usuario.avatar ,
        email: req.body.email || req.usuario.email 
    }
    console.log('Antes del findByIdAndUpdate : ', req.usuario );
    // req.usuario._id : lo devuelve el verificaToken como req.usuario
    // user: solo actualiza los datos que se estan enviando los demas los deja sin modificacion en la base de datos
    // {new: true}:  devuelve los nuevos datos que fueron actualizados, sino devuelve los datos antes de la actualizacion

    UsuarioM.findByIdAndUpdate( req.usuario._id, user, {  new: false }, (err, userDB) => {

        console.log('en la funcion de update:' , userDB);
        
        if ( !userDB ) {
            return respuesta.json( {
                ok: false,
                data: userDB ,
                mensaje: 'No existe usuario con ese ID.'
            })
        }

        const userToken = Token.getjwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        respuesta.json({
            ok: true,
            token: userToken
        });
    })

});

userRoutes.post('/create', (requerimiento: Request, respuesta: Response) => {
        // toma de la solicitud post
        const user = {
            nombre: requerimiento.body.nombre,
            avatar   : requerimiento.body.avatar,
            email: requerimiento.body.email,
            password: bcrypt.hashSync( requerimiento.body.password, 10 )
        }

        // modelo -  ingreso de datos
        UsuarioM.create( user ).then( userDB => {
            // devolver respuesta
            const userToken = Token.getjwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            respuesta.json({
                ok: true,
                token: userToken
            });
        }).catch( err => {
            respuesta.json({
                ok: false,
                err
            });
        })
})

userRoutes.get('/usr', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    console.log('usuario', usuario);
    res.json({
        ok:true,
        usuario
    });
});

export default userRoutes;