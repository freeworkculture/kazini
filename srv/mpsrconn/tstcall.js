var execFile = require('child_process').execFile;

var args = ["-d '{'title': 'Test' }'", "-H 'Content-Type: application/json'", "http://125.196.19.210:3030/widgets/test"];

execFile('curl.exe', args, {},
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});

curl -X POST \
  https://brs.ecitizen.go.ke/accounts/21810/services/11/new \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' \
  -H 'Accept-Encoding: gzip, deflate, br' \
  -H 'Accept-Language: en-US,en;q=0.9,en-GB;q=0.8' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary2WBlwO0BrUBqQKPV' \
  -H 'Cookie: _ga=GA1.3.795740200.1542720705; _gid=GA1.3.232233556.1542720705; _web_key=SFMyNTY.g3QAAAADbQAAAAtfY3NyZl90b2tlbm0AAAAYSjNON3JGT0Flb0dQczVxSm1pc3Bjdz09bQAAAAljYW1lX2Zyb21tAAAAAS9tAAAAEGd1YXJkaWFuX2RlZmF1bHRtAAABSmV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoZFdRaU9pSlZjMlZ5T2pJeE56TTRJaXdpWlhod0lqb3hOVFF6TURRNE1qRXpMQ0pwWVhRaU9qRTFORE13TkRFd01UTXNJbWx6Y3lJNklsZGxZaUlzSW1wMGFTSTZJalJrWWpoa01EQXhMVFF5T0RJdE5ERm1OeTA0TkRjMUxXSTJObVZtTXpGbE9UWTFaU0lzSW5CbGJTSTZlMzBzSW5OMVlpSTZJbFZ6WlhJNk1qRTNNemdpTENKMGVYQWlPaUpoWTJObGMzTWlmUS40cGZUVGZrZmlFcXRKZE1yMVgzMXhVRjRtSUhuSGNCaDhURzJGYWpxOGFudUtEQzFNR2dpNXNDRFM5eVE0dThZY0JPZ18tTW1tSThLZGpoMHNkbjAzdw.ejQ9SVqxAuKmTqwV0cTiIgk36MUPZH5ew_b9ZXed4MM; _gat=1' \
  -H 'Origin: https://brs.ecitizen.go.ke' \
  -H 'Postman-Token: ea593530-54af-47d7-a58f-d2ae381f10bd' \
  -H 'Referer: https://brs.ecitizen.go.ke/accounts/21810/services/11/new' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36' \
  -H 'cache-control: no-cache' \
  -d '------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="_csrf_token"\r\n\r\nMnctYjoIeBYfFjF7QEUnHEILJURVAAAAxDcUHN7Wzyv+3pVV/bV46w==\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="_utf8"\r\n\r\n✓\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[force]"\r\n\r\n1\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][type]"\r\n\r\ncitizen\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][actor_category]"\r\n\r\ngrantor\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][identifier]"\r\n\r\n22226787\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][first_name]"\r\n\r\nChris\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][name]"\r\n\r\nCHRIS OHABO DANIELS\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][kra_pin]"\r\n\r\nA002979826Q\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][postal_address]"\r\n\r\n386\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][postal_code]"\r\n\r\n00517\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][email]"\r\n\r\ncohabo@gmail.com\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="data[grantors][0][phone_number]"\r\n\r\n+254721138882\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV\r\nContent-Disposition: form-data; name="_csrf_token"\r\n\r\nMnctYjoIeBYfFjF7QEUnHEILJURVAAAAxDcUHN7Wzyv+3pVV/bV46w==\r\n------WebKitFormBoundary2WBlwO0BrUBqQKPV--\r\n'



var exec = require('child_process').exec,
    url = 'https://brs.ecitizen.go.ke/accounts/21810/services/11/new',
    timeout = "3",
    data="?q=test";

var time = process.hrtime();
exec('curl --max-time ' + timeout + ' -d \'' + data + '\' '  + url, function (error, stdout, stderr) {
    var diff = process.hrtime(time);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log("process took %d nanoseconds", diff[0] * 1e9 + diff[1]);
});