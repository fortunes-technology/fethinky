/*eslint-env node*/

var thinky = require("thinky")({
  host: "127.0.0.1" || process.env.RETHINK_HOST || "docker",
  db: "tests"
});
export default thinky;
export const type = thinky.type;

module.exports = thinky;