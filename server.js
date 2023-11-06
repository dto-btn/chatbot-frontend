import express from "express";
import ViteExpress from "vite-express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from "dotenv";
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb'

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

app.use('/chat', createProxyMiddleware({
    target: process.env.VITE_API_BACKEND,
    changeOrigin: true,
    onProxyReq: [middleware],
}));


const client = await MongoClient.connect(process.env.DB_CONN);
const db = client.db("chatbot");

app.post('/feedback', bodyParser.json(), async (req, res) => { 
    try {
        const result = await db.collection('feedback').insertOne(req.body);
        res.send("Saved successfully!")
    } catch (e) {
        throw e;
    }  
});

ViteExpress.listen(app, process.env.PORT, () => console.log("Server is listening on: http://localhost:" + process.env.PORT));