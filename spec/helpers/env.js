const { configuration } = require("../../src");
configuration.verbose = true;
configuration.hot = true;
process.env.VUE_DI_TESTING = true;