const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",  // Adjust based on your app's dev server
    supportFile: false,  // Optional, if you want to skip support files
  },
});
