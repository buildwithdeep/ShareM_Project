import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * WHAT IS THIS FILE?
 * 
 * Vite is a build tool that:
 * 1. Bundles your React code
 * 2. Optimizes for production
 * 3. Provides fast development server
 * 
 * This config tells Vite:
 * - Use React plugin
 * - Handle JSX files
 */

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        strictPort: false
    },
    build: {
        outDir: 'dist',
        // ✅ FIXED: explicitly use esbuild for minification
        // (avoids "terser not found" error since terser is an optional dependency)
        minify: 'esbuild'
    }
})