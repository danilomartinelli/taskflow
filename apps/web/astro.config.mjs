import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind({ 
    // Configuração completa do Tailwind será em tailwind.config.cjs
    // Cuidado: aqui você pode referenciar um arquivo .cjs
    // em vez do .mjs padrão se você usar module.exports
    // para o seu tailwind.config.cjs. No nosso caso, é .mjs
    configFile: './tailwind.config.mjs'
  }), react()]
});