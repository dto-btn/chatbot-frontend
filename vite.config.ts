import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {

    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        build: {
            outDir: "dist",
            emptyOutDir: true,
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: id => {
                        if (id.includes("@fluentui/react-icons")) {
                            return "fluentui-icons";
                        } else if (id.includes("@fluentui/react")) {
                            return "fluentui-react";
                        } else if (id.includes("node_modules")) {
                            return "vendor";
                        }
                    }
                }
            }
        },
        server: {
            proxy: {
                "/query": env.VITE_API_BACKEND
            }
        }
    }
});
