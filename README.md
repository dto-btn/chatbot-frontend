# chatbot-frontend

Based of the frontend from the [Azure OpenAI demo](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main).

## dev

(see ReactJS documentation on how to install prerequisites for this project)

Just run `npm run dev`

### pre-req

First setup your `.env` so your calls can goto the python api:

```bash
echo "VITE_API_BACKEND=http://localhost:5000" > .env
```