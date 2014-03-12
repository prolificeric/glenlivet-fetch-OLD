var http = require('http');
var express = require('express');
var request = require('request');
var fetch = require('../index');
var glenlivet = require('glenlivet');
var Bottle = glenlivet.Bottle;

glenlivet.plugins.register(fetch);

describe('Fetch plugin integration tests', function () {
    var TEST_PORT = 10001;
    var TEST_BASE = 'http://127.0.0.1:' + TEST_PORT;
    var noop = function () {};
    
    it('should make GET requests', function (done) {
        var app = express();
        var server = http.createServer(app);

        var square = new Bottle({
            fetch: {
                uri: TEST_BASE + '/get-test',
                params: {
                    x: {
                        type: 'query',
                        default: 0
                    }
                }
            }
        });

        app.get('/get-test', function (req, resp) {
            var x = +req.query.x;
            var y = x * x + '';

            resp.send(y);
        });

        server.listen(TEST_PORT, function () {
            square.fetch({
                fetch: {
                    x: 5
                }
            }, function (result) {
                var y = +result.fetch.body;
                y.should.equal(25);
                server.close(done);
            });
        });
    });

    it('should make POST requests', function (done) {
        var app = express();
        var server = http.createServer(app);

        app.use(express.json());
        app.use(express.urlencoded());

        var square = new Bottle({
            fetch: {
                method: 'POST',
                uri: TEST_BASE + '/get-test',
                params: {
                    x: {
                        type: 'body',
                        default: 0
                    }
                }
            }
        });

        app.post('/get-test', function (req, resp) {
            var x = +req.body.x;
            var y = x * x + '';
            
            resp.send(y);
        });

        server.listen(TEST_PORT, function () {
            square.fetch({
                fetch: {
                    x: 5
                }
            }, function (result) {
                var y = +result.fetch.body;
                y.should.equal(25);
                server.close(done);
            });
        });
    });

    it('should make PUT requests', function (done) {
        var app = express();
        var server = http.createServer(app);
        
        app.use(express.json());
        app.use(express.urlencoded());

        var square = new Bottle({
            fetch: {
                method: 'PUT',
                uri: TEST_BASE + '/get-test',
                params: {
                    x: {
                        type: 'body',
                        default: 0
                    }
                }
            }
        });

        app.put('/get-test', function (req, resp) {
            var x = +req.body.x;
            var y = x * x + '';
            
            resp.send(y);
        });

        server.listen(TEST_PORT, function () {
            square.fetch({
                fetch: {
                    x: 5
                }
            }, function (result) {
                var y = +result.fetch.body;
                y.should.equal(25);
                server.close(done);
            });
        });
    });

    it('should make DELETE requests', function (done) {
        var app = express();
        var server = http.createServer(app);

        var square = new Bottle({
            fetch: {
                method: 'DELETE',
                uri: TEST_BASE + '/'
            }
        });

        app['delete']('/', function (req, resp) {
            resp.send('ok');
        });

        server.listen(TEST_PORT, function () {
            square.fetch({
                fetch: {
                    x: 5
                }
            }, function (result) {
                result.fetch.body.should.equal('ok');
                server.close(done);
            });
        });
    });

    it('should trigger fetch:error event on bottle when error is returned', function (done) {
        var square = new Bottle({
            fetch: {
                uri: 'http://localhost/this/does/not/exist'
            }
        }).plugin(function () {
            this.on('fetch:error', function (result) {
                result.fetch.error.should.be.an.instanceOf(Error);
                done();
            });
        }).fetch({}, noop);
    });
});