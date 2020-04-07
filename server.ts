import { createServer } from 'http';
import express from 'express';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import { connect } from 'mongoose';
import { config as envConfig } from 'dotenv';
envConfig();

import * as $$ from './config.app';
import { UserRouter } from './routes';


const app: express.Application = express();
const host: string = '127.0.0.1' || '192.168.1.67';
const port: number = $$.port;

app.use(helmet({ hidePoweredBy: true }));
app.use(json());
app.use(urlencoded({ extended: false }));

connect($$.db_url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database Status: OK'))
.catch(err => console.log('Database Status: Failed'));

app.use('*', (req, res, next) => {
    res.setHeader('X-Appname', 'GoGetMe');
    res.setHeader('Access-Control-Allow-Origin', '127.0.0.1');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.removeHeader('X-Powered-By');

    console.log('[' + req.method + '] ' + ' - ' + req.baseUrl);
    next();
});

app.use('/apis/users', UserRouter);
app.get('*', (req, res, next) => {
    res.send('<h1 style="text-align:center">403 - FORBIDDEN ACCESS</h1>');
});

createServer(app).listen(port, host, () => {
    console.log('Server running @ http://' + host + ':' + port + '/');
});