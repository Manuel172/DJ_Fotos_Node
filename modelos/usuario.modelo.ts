
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type : String,
        required: [true, 'Nombre Obligatorio']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'E-mail Obligatorio']
    },
    password: {
        type: String,
        required: [true, 'Contraseña Obligatorio']
    }

});

usuarioSchema.method('compararClave', function(password: string = ''): boolean {
    if ( bcrypt.compareSync(password , this.password)) {
        return true
    } else {
        return false
    }
    
} );

interface Iusuario extends Document {
    nombre: string,
    avatar: string,
    email: string,
    password: string

    compararClave(password: string): boolean;
}

export const UsuarioM = model<Iusuario>('UsuarioM', usuarioSchema);

