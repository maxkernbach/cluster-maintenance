/* jshint globalstrict:false, strict:false, sub: true */
exports.name = "cleanout-server";
exports.group = "move shard tasks";
exports.args = [
  {
    "name": "server",
    "optional": false,
    "type": "string",
    "description": "database server"
  }
];
exports.args_arangosh = "| --server.endpoint AGENT-OR-COORDINATOR";
exports.description = "Cleans out a server.";
exports.selfTests = ["arango", "db", "leaderAgencyConnection"];
exports.requires = "3.6.0 - 3.9.99";
exports.info = `
This task cleans out a DBserver.
`;

exports.run = function (extra, args) {
  require("../helper-cleanout-server").run(extra, args, true);
};
