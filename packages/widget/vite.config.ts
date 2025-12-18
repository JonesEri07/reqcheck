import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReqCheck",
      fileName: "widget",
      formats: ["iife"], // IIFE format for browser script tag
    },
    outDir: resolve(__dirname, "../../public"),
    emptyOutDir: false, // Don't clear public folder
    rollupOptions: {
      output: {
        // Output as widget.js in public folder
        entryFileNames: "widget.js",
        // Inline all dependencies for a single file
        inlineDynamicImports: true,
        // Ensure proper IIFE format
        format: "iife",
        name: "ReqCheck",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    target: "es2015", // Support older browsers
  },
});
