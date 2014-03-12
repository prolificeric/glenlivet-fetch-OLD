var fetch = require('../index');
var glenlivet = require('glenlivet');
var Bottle = glenlivet.Bottle;

glenlivet.plugins.register(fetch);

describe('Fetch plugin', function () {
	it('should assemble URIs', function (done) {
		var bottle = new Bottle({
			fetch: {
				uri: 'http://www.prolificinteractive.com:page'
			}
		}).plugin(function () {
			this.hooks.after('fetch:request:uri', function (result, next, done) {
				result.fetch.requestOptions.uri.should.equal('http://www.prolificinteractive.com/about');
				done();
			});
		});

		bottle.fetch({
			fetch: {
				page: '/about'
			}
		}, function () {
			done();
		});
	});

	it('should attach query params', function (done) {
		var bottle = new Bottle({
			fetch: {
				uri: 'http://www.prolificinteractive.com/search',
				params: {
					keywords: {
						type: 'query'
					}
				}
			}
		}).plugin(function () {
			this.hooks.after('fetch:request:query', function (result, next, done) {
				result.fetch.requestOptions.qs.keywords.should.equal('glenlivet');
				done();
			});
		});

		bottle.fetch({
			fetch: {
				keywords: 'glenlivet'
			}
		}, function () {
			done();
		});
	});

	it('should attach form params', function (done) {
		var bottle = new Bottle({
			fetch: {
				method: 'POST',
				bodyType: 'form',
				uri: 'http://www.prolificinteractive.com/search',
				params: {
					keywords: {
						type: 'body'
					}
				}
			}
		}).plugin(function () {
			this.hooks.after('fetch:request:body', function (result, next, done) {
				result.fetch.requestOptions.form.keywords.should.equal('glenlivet');
				done();
			});
		});

		bottle.fetch({
			fetch: {
				keywords: 'glenlivet'
			}
		}, function () {
			done();
		});
	});

	it('should attach json body', function (done) {
		var bottle = new Bottle({
			fetch: {
				method: 'POST',
				bodyType: 'json',
				uri: 'http://www.prolificinteractive.com/search',
				params: {
					keywords: {
						type: 'body'
					}
				}
			}
		}).plugin(function () {
			this.hooks.after('fetch:request:body', function (result, next, done) {
				result.fetch.requestOptions.json.keywords.should.equal('glenlivet');
				done();
			});
		});

		bottle.fetch({
			fetch: {
				keywords: 'glenlivet'
			}
		}, function () {
			done();
		});
	});

	it('should attach headers', function (done) {
		var bottle = new Bottle({
			fetch: {
				uri: 'http://www.prolificinteractive.com/search',
				params: {
					foo: {
						type: 'header'
					}
				}
			}
		}).plugin(function () {
			this.hooks.after('fetch:request:headers', function (result, next, done) {
				result.fetch.requestOptions.headers.foo.should.equal('bar');
				done();
			});
		});

		bottle.fetch({
			fetch: {
				foo: 'bar'
			}
		}, function () {
			done();
		});
	});

	describe('Param defaults', function () {
		it('should default URI params', function (done) {
			var bottle = new Bottle({
				fetch: {
					uri: 'http://www.prolificinteractive.com:page',
					params: {
						page: {
							type: 'uri',
							default: '/company'
						}
					}
				}
			}).plugin(function () {
				this.hooks.after('fetch:request:uri', function (result, next, done) {
					result.fetch.requestOptions.uri.should.equal('http://www.prolificinteractive.com/company');
					done();
				});
			});

			bottle.fetch({}, function () {
				done();
			});
		});

		it('should default query params', function (done) {
			var bottle = new Bottle({
				fetch: {
					uri: 'http://www.prolificinteractive.com/search',
					params: {
						keywords: {
							type: 'query',
							default: 'Bobby Emamian'
						}
					}
				}
			}).plugin(function () {
				this.hooks.after('fetch:request:query', function (result, next, done) {
					result.fetch.requestOptions.qs.keywords.should.equal('Bobby Emamian');
					done();
				});
			});

			bottle.fetch({}, function () {
				done();
			});
		});

		it('should default form params', function (done) {
			var bottle = new Bottle({
				fetch: {
					method: 'POST',
					uri: 'http://www.prolificinteractive.com/search',
					bodyType: 'form',
					params: {
						keywords: {
							type: 'body',
							default: 'Bobby Emamian'
						}
					}
				}
			}).plugin(function () {
				this.hooks.after('fetch:request:body', function (result, next, done) {
					result.fetch.requestOptions.form.keywords.should.equal('Bobby Emamian');
					done();
				});
			});

			bottle.fetch({}, function () {
				done();
			});
		});

		it('should default json params', function (done) {
			var bottle = new Bottle({
				fetch: {
					method: 'POST',
					uri: 'http://www.prolificinteractive.com/search',
					bodyType: 'json',
					params: {
						keywords: {
							type: 'body',
							default: 'Bobby Emamian'
						}
					}
				}
			}).plugin(function () {
				this.hooks.after('fetch:request:body', function (result, next, done) {
					result.fetch.requestOptions.json.keywords.should.equal('Bobby Emamian');
					done();
				});
			});

			bottle.fetch({}, function () {
				done();
			});
		});

		it('should default header params', function (done) {
			var bottle = new Bottle({
				fetch: {
					uri: 'http://www.prolificinteractive.com',
					params: {
						foo: {
							type: 'header',
							default: 'bar'
						}
					}
				}
			}).plugin(function () {
				this.hooks.after('fetch:request:headers', function (result, next, done) {
					result.fetch.requestOptions.headers.foo.should.equal('bar');
					done();
				});
			});

			bottle.fetch({}, function () {
				done();
			});
		});
	});
});