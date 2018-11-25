var https = require('https');
var querystring = require('querystring');

// form data
var postData = querystring.stringify({
    firstanme: "Amy",
    lastname: "Li"
});

var postData = querystring.stringify({
    _csrf_token: 'FTg8NxV3bmdLPCl3IBU2UBdJJzpYJgAADqnVRCYS9DENpCod8xAQ5w==',
    _utf8: '\u2713',
    'auth[username]': 'cohabo@gmail.com',
    'auth[pwd]': 'Nakhumicha:1891'
});

// request option
var options = {
    host: 'http://accounts.ecitizen.go.ke/login',
    port: 443,
    method: 'POST',
    path: '/login',
    headers: {
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Origin': 'https://accounts.ecitizen.go.ke',
        'Upgrade-Insecure-Requests': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://accounts.ecitizen.go.ke/login',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
        'Cookie': '_ga=GA1.3.1779538580.1542486675; _gid=GA1.3.679846858.1542486675; _gat=1; _single_signon_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYUUlSYUc0NzRyeGw5UFZZNC8xZmttUT09.qdUNUV3fpjqkSABm5ySPWVH5PkUYnB8TLuwAI5qAsJ0',
        'Content-Length': postData.length
    }
};

// request object
var req = https.request(options, function (res) {
    var result = '';
    res.on('response', function (response) {
        // console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log(response.headers) // 'image/png'
        // console.log('Login body log: ' , body);
        var cookies = cookiejar.getCookies(sso_uri);
        console.log("INSPECT COOKIE JAR IN INNER REQUEST: " + cookies);
    });
    res.on('data', function (chunk) {
        result += chunk;
    });
    res.on('end', function () {
        console.log(result);
    });
    res.on('error', function (err) {
        console.log(err);
    })
});

// req error
req.on('error', function (err) {
    console.log(err);
});

//send request witht the postData form
req.write(postData);
req.end();