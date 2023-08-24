import express from "express";
import ViteExpress from "vite-express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from "dotenv";

config();

const app = express();

const middleware = (req, res, next) => {
    next();
};

app.use('/query', createProxyMiddleware({
    target: process.env.VITE_API_BACKEND,
    changeOrigin: true,
    onProxyReq: [middleware],
}));

ViteExpress.listen(app, process.env.PORT, () => console.log("Server is listening on: http://localhost:" + process.env.PORT));