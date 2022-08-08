const mix = require("laravel-mix")

mix.ts("resources/react/main.tsx", "public/js/index.js").react()