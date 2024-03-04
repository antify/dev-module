import Module from '..'

export default defineNuxtConfig({
  modules: [
    Module,
    '@antify/ui-module'
  ],
  antDev: {

  },
  /**
   * Allow using packages outside the monorepo with "link:../../example-package".
   * Without strict, vite would throw 403 error.
   */
  vite: {
    server: {
      fs: {
        strict: false,
      }
    }
  }
});
