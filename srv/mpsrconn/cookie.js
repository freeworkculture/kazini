var request = require('request');
var rp = require('request-promise');
var tough = require('tough-cookie');

// Easy creation of the cookie - see tough-cookie docs for details
let _ga = new tough.Cookie({
    key: "_ga",
    value: "GA1.3.1779538580.1542486675",
    domain: 'brs.ecitizen.go.ke',
    httpOnly: false,
    maxAge: 31536000
});

// Easy creation of the cookie - see tough-cookie docs for details
let _gid = new tough.Cookie({
    key: "_gid",
    value: "GA1.3.679846858.1542486675",
    domain: 'brs.ecitizen.go.ke',
    httpOnly: false,
    maxAge: 31536000
});

// Easy creation of the cookie - see tough-cookie docs for details
let _gat = new tough.Cookie({
    key: "_gat",
    value: 1,
    domain: 'brs.ecitizen.go.ke',
    httpOnly: false,
    maxAge: 31536000
});

// Easy creation of the cookie - see tough-cookie docs for details
let _web_key = new tough.Cookie({
    key: "_web_key",
    value: "SFMyNTY.g3QAAAABbQAAAAljYW1lX2Zyb21tAAAAAS8.JUMe8sr_6nG97DflhtKzGpt6x7AH5FrSsBWiiF4TAqo",
    domain: 'brs.ecitizen.go.ke/auth/sso-login',
    httpOnly: false,
    maxAge: 31536000
});



// Put cookie in an jar which can be used across multiple requests
var cookiejar = request.jar();
cookiejar.setCookie(_ga, 'https://brs.ecitizen.go.ke');
cookiejar.setCookie(_gid, 'https://brs.ecitizen.go.ke');
cookiejar.setCookie(_gat, 'https://brs.ecitizen.go.ke');
// ...all requests to https://api.mydomain.com will include the cookie

var options = {
    uri: 'https://brs.ecitizen.go.ke',
    jar: cookiejar // Tells rp to include cookies in jar that match uri
};

rp(options)
    .then(function (header) {
        // Request succeeded...
        console.log(header)
    })
    .then(function (header) {
        cookiejar.setCookie(header.set-cookie, 'https://brs.ecitizen.go.ke', cb);
    })
    .catch(function (err) {
        // Request failed...
    });

var val1 = cookiejar.getCookies('https://brs.ecitizen.go.ke');

console.log('Value1:', val1);
