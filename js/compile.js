const ethConnector = require("ethconnector");
const path = require("path");

ethConnector.compile(
    path.join(__dirname, "../contracts/DoitToken.sol"),
    path.join(__dirname, "../contracts/DoitToken.sol.js"),
    (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
