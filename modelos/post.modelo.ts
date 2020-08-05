import { Schema, model, Document } from 'mongoose';

const postSchema = new Schema({
    created: {
        type : Date   // automatico del dia
    },
    mensaje: {
        type: String   // fotos junta curso
    },
    imagenes: [{
        type: String   // junta200210011301.jpg
    }],
    coordenadas: {
        type: String  // -13.76239393999, -10.0937733366
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'UsuarioM',
        requerid: [true, 'Debe existir una referencia a un usuario']
    }
});

interface IPost extends Document {
    created: Date;
    mensaje: string;
    imagenes: string[];
    coordenadas: string;
    usuario: string;
};

postSchema.pre<IPost>('save', function( next ) {
    this.created = new Date();
    next();  
});

export const PostM = model<IPost>('PostM', postSchema);