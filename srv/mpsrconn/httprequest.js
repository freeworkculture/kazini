var http = require('http'),
    data="?q=test",
    options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/',
        method: 'POST'
    },
    req, time;

req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        //console.log(chunk);
    });

    res.on('end', function() {
        var diff = process.hrtime(time);
        console.log("process took %d nanoseconds", diff[0] * 1e9 + diff[1]);
    });
    
    res.on('error', function(error) {
        console.log('error: ' + error);
    });
});

time = process.hrtime();
req.write(data);
req.end();