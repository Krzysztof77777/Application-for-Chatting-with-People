import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from './server/mongooseServer.js';
import startWebsocketServer from './server/websocketServer.js';
import startRouting from './server/routingServer.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.static(path.join(__dirname, 'build')));
app.set('view engine', 'html');

startWebsocketServer(app, PORT);

startRouting(app);

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, "./build/index.html"));
})