import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://interview.fio.de/core-frontend/api",
    env: {
      AUTH_TOKEN: process.env.AUTH_TOKEN || "dummy-token"
    }
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: 'cypress/support/component.js',
  },
});
