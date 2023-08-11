import express from "express";
import ViteExpress from "vite-express";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const middleware = (req, res, next) => {
    // Do something with the request
    next();
};

app.use('/query', createProxyMiddleware({
    target: process.env.VITE_API_BACKEND,
    changeOrigin: true,
    onProxyReq: [middleware],
}));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));