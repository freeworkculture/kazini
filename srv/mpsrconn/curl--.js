var exec = require('child_process').exec,
    url = "http://google.com/",
    timeout = "3",
    data="?q=test";

var time = process.hrtime();
exec('curl --max-time ' + timeout + ' -d \'' + data + '\' '  + url, function (error, stdout, stderr) {
    var diff = process.hrtime(time);
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
    console.log("process took %d nanoseconds", diff[0] * 1e9 + diff[1]);
});