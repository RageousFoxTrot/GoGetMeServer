"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = require("body-parser");
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const $$ = __importStar(require("./config.app"));
const routes_1 = require("./routes");
const app = express_1.default();
const host = '127.0.0.1' || '192.168.1.67';
const port = $$.port;
app.use(helmet_1.default({ hidePoweredBy: true }));
app.use(body_parser_1.json());
app.use(body_parser_1.urlencoded({ extended: false }));
mongoose_1.connect($$.db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Status: OK'))
    .catch(err => console.log('Database Status: Failed'));
app.use('*', (req, res, next) => {
    res.setHeader('X-Appname', 'GoGetMe');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.removeHeader('X-Powered-By');
    console.log('[' + req.method + '] ' + ' - ' + req.baseUrl);
    next();
});
app.use('/apis/users', routes_1.UserRouter);
app.get('*', (req, res, next) => {
    res.send('<h1 style="text-align:center">403 - FORBIDDEN ACCESS</h1>');
});
http_1.createServer(app).listen(port, () => {
    console.log('Server running @ http://' + host + ':' + port + '/');
});
