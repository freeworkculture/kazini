var app = require('express')(),
    bodyParser = require('body-parser'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    cote = require('cote');

app.use(bodyParser.json());

app.all('*', function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/search', function (req, res) {
    mintRequester.send({ type: 'constant' }, function (err, mints) {
        res.send(mints);
    });
});

app.get('/initialnotice', function (req, res) {
    mintRequester.send({ type: 'non-constant', mint: req.body.mint }, function (err, mint) {
        res.send(mint);
    });
});

app.post('/initialnotice', function (req, res) {
    // var query1 = req.body.MPSR_MESSAGE_PACKET;
    // var query2 = req.body.mpsr_confirmation_1;
    // var query3 = req.body.MPSR_MESSAGE_PACKET.mpsr_confirmation_2;
    // console.log('request query one ', query1, ' and two ', query3);
    mintRequester.send({ type: 'non-constant', transaction: req.body.MPSR_MESSAGE_PACKET }, function (err, transaction) {
        res.send(mint);
    });
});

var mintRequester = new cote.Requester({
    name: 'admin mint requester',
    namespace: 'transaction'
});

server.listen(5000);

new cote.Sockend(io, {
    name: 'admin sockend server'
});
