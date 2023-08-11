# chatbot-frontend

Based of the frontend from the [Azure OpenAI demo](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main).

## dev

(see ReactJS documentation on how to install prerequisites for this project)

Just run `npm run dev`

### pre-req

If you need to change your server to something else than `http://localhost:5000` (normal local running instance of the api)

(see `const server: string = process.env.VITE_API_BACKEND ?? "http://localhost:5000"` from `vite.config.ts`) then you can do this below:

First setup your `.env` so your calls can goto the python api:

```bash
echo "VITE_API_BACKEND=http://127.0.0.1:5000" > .env
```

NOTE: You can also export then env variable, it will take precedence on the `.env` file(s).

## how it is ran in production

In "production" this server is ran via an Azure Linux web app and started via the `http://127.0.0.1:5000` 
(auto build will run `tsc && vite build` and place it it `dist/`).