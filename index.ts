import Server from './clases/server';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'
import cors from 'cors';

console.log("inicio server!! escuchando.....")

const server = new Server();

// siempre se va a ejecutar y va a procesar los post, put, get (middleware)
// parse application/x-www-form-urlencoded
server.app.use( bodyParser.urlencoded({extended: true}) );
// parse application/json
server.app.use(bodyParser.json());

// fileUpload paar subir las imagenes/archivos
server.app.use( fileUpload({ useTempFiles: true }) );

// configurar CORS
server.app.use( cors({ origin: true, credentials: true }) );

// rutas de la app (middleware)
server.app.use('/usuarios', userRoutes);
server.app.use('/posts', postRoutes);

// conectar base de datos. debe estar instalado el paquete mongoose
mongoose.connect( 'mongodb://localhost:27017/fotosgram', 
{ useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) throw err;
    console.log('Base de datos conectada');
});

// levantar instancia de servidor express
server.start( () => {
    console.log(` Servidor inicializado en puerto: ${ server.port }`)
});
