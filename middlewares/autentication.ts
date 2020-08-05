
import {Response, NextFunction } from "express";
import Token from '../clases/token';


export const verificaToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';
    
    Token.comprobarToken(userToken).then( (decoded: any) => {
        req.usuario = decoded.usuario;
        next();
    })
    .catch(err => {
        res.json ({
            ok: false,
            mensaje: 'Token invalido.'
        });
    })

    
}