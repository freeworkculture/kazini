var cote = require('cote');
    MintERC721 = require('./mint-service');

var transactionResponder = new cote.Responder({
    name: 'transaction responder',
    namespace: 'transaction',
    respondsTo: ['list']
});

var transactionPublisher = new cote.Publisher({
    name: 'transaction publisher',
    namespace: 'transaction',
    broadcasts: ['update']
});

transactionResponder.on('*', console.log);

transactionResponder.on('constant', function (req, cb) {
    MintERC721.searchRecords();
});

transactionResponder.on('non-constant', function (req, cb) {
    // console.log('non-constant req', req);
    MintERC721.initialNotice(req);
});

function updatetransactions() {
    models.transaction.find(function (err, transactions) {
        transactionPublisher.publish('update', transactions);
    });
}
