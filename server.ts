import express from "express";
import ViteExpress from "vite-express";
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const middleware = (req, res, next) => {
    // Do something with the request
    next();
};

app.use('/query', createProxyMiddleware({
    target: 'https://scdccio-openaichatbotpilot-app.agreeablemeadow-f72c5c48.canadacentral.azurecontainerapps.io',
    changeOrigin: true,
    onProxyReq: [middleware],
}));

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));