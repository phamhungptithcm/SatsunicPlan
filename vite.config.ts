import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
const at=(p:string)=>fileURLToPath(new URL(p,import.meta.url));
export default defineConfig({plugins:[react()],resolve:{alias:{'@hws/plane-button':at('./vendor/plane-community/packages/ui/src/button/button.tsx'),'@plane/types':at('./vendor/plane-community/packages/types/src/index.ts'),'@plane/utils':at('./src/lib/plane/date-utils.ts'),'@hws/plane-adapter':at('./src/lib/plane/timeline-context.tsx'),'@':at('./vendor/plane-community/apps/web/core')}},server:{port:15173,strictPort:true}});
