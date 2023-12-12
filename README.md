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

### accessbility testing

```bash
npm install --save-dev accessibility-checker
# ensure app is running ...
npx achecker test/urls.txt 
```

## how it is ran in production

In "production" this server is ran via an Azure Linux web app and started via the `http://127.0.0.1:5000` 
(auto build will run `tsc && vite build` and place it it `dist/`) then it is started with the `NODE_ENV=production node server.js` command.

`PORT=8080` is defined on Azure via their `/opt/startup/startup.sh` bootstrapped script and so the instance will run on that port (you also can do the same locally via `.env`)

## Documentation

- [a11ywatch, tool used to do some accessbility testing (was done locally)](https://github.com/a11ywatch/a11ywatch)
- [IBM accessibiliy-checker](https://github.com/IBMa/equal-access/tree/master/accessibility-checker)