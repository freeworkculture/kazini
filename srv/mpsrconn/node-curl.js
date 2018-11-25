var Curl = require('node-libcurl').Curl;

var curl = new Curl();

curl.setOpt('URL', 'www.google.com');
curl.setOpt('FOLLOWLOCATION', true);

curl.on('end', function(statusCode, body, headers) {

    console.info(statusCode);
    console.info('---');
    console.info(body.length);
    console.info('---');
    console.info(this.getInfo( 'TOTAL_TIME') * 1e9);

    this.close();
});

curl.on('error', curl.close.bind(curl));
curl.perform();