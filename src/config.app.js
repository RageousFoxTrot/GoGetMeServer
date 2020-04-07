"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.node_env = process.env.NODE_ENV;
exports.port = parseInt(process.env.PORT, 10);
exports.api_secret = process.env.API_SECRET;
// DB Configuration
exports.db_url = process.env.DB_URL;
