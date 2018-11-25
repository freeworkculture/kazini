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

curl 'https://accounts.ecitizen.go.ke/login' -H 'Connection: keep-alive' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,en-GB;q=0.8' -H 'Cookie: _ga=GA1.3.1779538580.1542486675; _gid=GA1.3.679846858.1542486675; _gat=1; _single_signon_key=SFMyNTY.g3QAAAACbQAAAAljYW1lX2Zyb21tAAAAQy9hdXRob3JpemU_cmV0dXJuX3VybD1odHRwczovL2Jycy5lY2l0aXplbi5nby5rZS9hdXRoL3Nzby1hdXRob3JpemVtAAAADXBob2VuaXhfZmxhc2h0AAAAAW0AAAAEaW5mb20AAAAYUGxlYXNlIGxvZ2luIHRvIGNvbnRpbnVl.FmZtdz7OokaTdKi1PRiONpFqkSWIju6JuacRbb4i3Ds' --compressed --insecure'