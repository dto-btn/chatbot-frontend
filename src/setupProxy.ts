import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app: any) {
    app.use(
      '/query',
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
      })
    );
}