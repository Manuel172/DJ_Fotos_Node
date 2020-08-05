import express from 'express';

export default class server {
    public app: express.Application ;
    public port: number = 3000;

    constructor() {
        // inicializa la app
        this.app = express();
    }

    start( callback: Function) {
        this.app.listen( this.port, callback());
    }
}