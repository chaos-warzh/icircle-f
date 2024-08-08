import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// Element UI auto import
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        })],
    server: {
        port: 3000,   // run on this port
        open: true,
    },
    base: './'
})
